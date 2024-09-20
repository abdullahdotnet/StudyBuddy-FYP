import os
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq

from .template import TEMPLATE_TEXT
from .serializers import ChatInputSerializer


class ChatbotAPIView(APIView):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.setup_llama()
        self.embedding = HuggingFaceEmbeddings()
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

    def setup_llama(self):

        try:
            groq_api_key = os.getenv('GROQ_API_KEY')
            if not groq_api_key:
                raise ValueError(
                    "GROQ_API_KEY is not set in environment variables")

            os.environ["GROQ_API_KEY"] = groq_api_key

            self.llm = ChatGroq(
                model="llama-3.1-8b-instant",
                temperature=0
            )
            return
        except Exception as e:
            self.setup_llama()

    def process_qa_retrieval_chain(self, query):
        response = self.qa_chain.invoke({'query': query})
        result_str = f'{response["result"]}\n\n'
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
            return Response({'query': query, 'response': result}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
