import os
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_community.llms import GooglePalm
from langchain_community.embeddings import GooglePalmEmbeddings

from .template import TEMPLATE_TEXT
from .serializers import ChatInputSerializer


class ChatbotAPIView(APIView):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.google_palm()
        self.embedding = GooglePalmEmbeddings(
            google_api_key=os.getenv('GOOGLE_API_KEY')
        )
        self.vectordb = Chroma(
            persist_directory='vector_db/',
            embedding_function=self.embedding
        )

        self.qa_chain_prompt = PromptTemplate.from_template(TEMPLATE_TEXT)
        self.qa_chain = RetrievalQA.from_chain_type(
            self.llm,
            retriever=self.vectordb.as_retriever(),
            return_source_documents=True,
            chain_type_kwargs={'prompt': self.qa_chain_prompt}
        )

    def google_palm(self):
        try:
            self.llm = GooglePalm(
                google_api_key=os.getenv('GOOGLE_API_KEY'),
                temperature=0
            )
            return
        except Exception as e:
            self.google_palm()

    def process_qa_retrieval_chain(self, query):
        response = self.qa_chain.invoke({'query': query})
        result_str = f'Query: {response["query"]}\n\n'
        result_str += f'Result: {response["result"]}\n\n'
        relevant_docs = response['source_documents']

        for i in range(len(relevant_docs)):
            result_str += f'Relevant Doc {i+1}:\n'
            result_str += relevant_docs[i].page_content + '\n'
            result_str += str(relevant_docs[i].metadata) + '\n\n'

        return result_str

    def post(self, request, *args, **kwargs):
        serializer = ChatInputSerializer(data=request.data)

        if serializer.is_valid():
            query = serializer.validated_data['query']
            result = self.process_qa_retrieval_chain(query)
            return Response({'response': result}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
