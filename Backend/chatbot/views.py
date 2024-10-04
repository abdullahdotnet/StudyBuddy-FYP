# import os
# from rest_framework import status
# from rest_framework.views import APIView
# from rest_framework.response import Response

# from langchain_community.embeddings import HuggingFaceEmbeddings
# from langchain_community.vectorstores import Chroma
# from langchain.chains import RetrievalQA
# from langchain.prompts import PromptTemplate
# from langchain_groq import ChatGroq

# from .template import TEMPLATE_TEXT
# from .serializers import ChatInputSerializer


# class ChatbotAPIView(APIView):

#     def __init__(self, **kwargs):
#         super().__init__(**kwargs)

#         self.setup_llama()
#         self.embedding = HuggingFaceEmbeddings()
#         self.vectordb = Chroma(
#             persist_directory='vector_db/',
#             embedding_function=self.embedding
#         )

#         self.qa_chain_prompt = PromptTemplate.from_template(TEMPLATE_TEXT)
#         self.qa_chain = RetrievalQA.from_chain_type(
#             self.llm,
#             retriever=self.vectordb.as_retriever(),
#             return_source_documents=True,
#             chain_type_kwargs={'prompt': self.qa_chain_prompt}
#         )

#     def setup_llama(self):

#         try:
#             groq_api_key = os.getenv('GROQ_API_KEY')
#             if not groq_api_key:
#                 raise ValueError(
#                     "GROQ_API_KEY is not set in environment variables")

#             os.environ["GROQ_API_KEY"] = groq_api_key

#             self.llm = ChatGroq(
#                 model="llama-3.1-8b-instant",
#                 temperature=0
#             )
#             return
#         except Exception as e:
#             self.setup_llama()

#     def process_qa_retrieval_chain(self, query):
#         response = self.qa_chain.invoke({'query': query})
#         result_str = f'{response["result"]}\n\n'
#         relevant_docs = response['source_documents']

#         for i in range(len(relevant_docs)):
#             result_str += f'Relevant Doc {i+1}:\n'
#             result_str += relevant_docs[i].page_content + '\n'
#             result_str += str(relevant_docs[i].metadata) + '\n\n'

#         return result_str

#     def post(self, request, *args, **kwargs):
#         serializer = ChatInputSerializer(data=request.data)

#         if serializer.is_valid():
#             query = serializer.validated_data['query']
#             result = self.process_qa_retrieval_chain(query)
#             return Response({'query': query, 'response': result}, status=status.HTTP_200_OK)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import (
    load_documents,
    initialize_llm,
    store_embeddings,
    create_compression_retriever,
    create_rag_chain,
)

from langchain_core.messages import AIMessage, HumanMessage

# Define a simple chat history variable (initialize it outside the view)
chat_history = []

# Load the LLM model
llm = initialize_llm()

# Load the text data and create documents
documents = load_documents()

# Store embeddings in Chroma vector store
vector_store = store_embeddings(documents)

# Create the compression retriever
compression_retriever = create_compression_retriever(llm, vector_store)

# Define the system prompt for contextualized conversation
system_prompt = (
    "Act as a conversational assistant similar to ChatGPT. Engage in natural dialogue and answer questions based on the context provided through the chat history or retrieved using Retrieval-Augmented Generation (RAG). If the relevant context is not found either in the conversation or via RAG, respond by stating that the information is unavailable or ask for more clarification from the user. Do not provide speculative or out-of-context information. Always ensure responses are precise and contextually relevant."
)

# Create the RAG chain
rag_chain = create_rag_chain(llm, compression_retriever, system_prompt)


@api_view(['POST'])
def AskQuery(request):
    # Parse the input query
    query = request.data.get('query')
    if not query:
        return Response({"error": "Query parameter is missing."}, status=400)
    
    # Run the RAG pipeline
    result = rag_chain.invoke({"input": query, "chat_history": chat_history})

    # Append the user query and the system response to the chat history
    chat_history.extend(
        [
            HumanMessage(content=query),
            AIMessage(content=result["answer"]),
        ]
    )
    
    # Return the response
    return Response({
        "query": query,
        "answer": result["answer"],
        "context": result.get("context", "No context provided"),
        "chat_history": [msg.content for msg in chat_history]
    })



