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




# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .utils import (
#     load_documents,
#     initialize_llm,
#     store_embeddings,
#     create_compression_retriever,
#     create_rag_chain,
# )

# from langchain_core.messages import AIMessage, HumanMessage

# # Define a simple chat history variable (initialize it outside the view)
# chat_history = []

# # Load the LLM model
# llm = initialize_llm()

# # Load the text data and create documents
# documents = load_documents()

# # Store embeddings in Chroma vector store
# vector_store = store_embeddings(documents)

# # Create the compression retriever
# compression_retriever = create_compression_retriever(llm, vector_store)

# # Define the system prompt for contextualized conversation
# system_prompt = (
#     "Act as a conversational assistant similar to ChatGPT. Engage in natural dialogue and answer questions based on the context provided through the chat history or retrieved using Retrieval-Augmented Generation (RAG). If the relevant context is not found either in the conversation or via RAG, respond by stating that the information is unavailable or ask for more clarification from the user. Do not provide speculative or out-of-context information. Always ensure responses are precise and contextually relevant."
#     "\n\n"
#     "{context}"
# )

# # Create the RAG chain
# rag_chain = create_rag_chain(llm, compression_retriever, system_prompt)

from rest_framework.decorators import api_view
from rest_framework.response import Response

# Imports Related to LLM
from dotenv import load_dotenv

# imports for precessing text
import os
import pickle
import re

# imports for creating pipeline for rag
from langchain.embeddings import HuggingFaceEmbeddings      # for embeddings
from langchain.vectorstores import Chroma                  # for vector store
from langchain.document_loaders import TextLoader        # for loading text
from langchain.text_splitter import RecursiveCharacterTextSplitter  # acting as base class for splitting text 
from langchain_groq import ChatGroq                         # for initializing LLM from groq
from langchain.schema import Document                   # converting simple text to document object

# For compressing the context of retrieved documents
from langchain.retrievers import ContextualCompressionRetriever     # for compressing retrieved documents context
from langchain.retrievers.document_compressors import LLMChainExtractor     # used in compression

# For creating the retrieval chain for chat history
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# For creating history aware retriever
from langchain.chains import create_history_aware_retriever
from langchain_core.prompts import MessagesPlaceholder
from langchain_core.messages import AIMessage, HumanMessage     # for messages in history aware retriever


# Extra for now
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory


# Load .env file
load_dotenv()
groq_api_key = os.getenv('GROQ_API_KEY')

if not groq_api_key:
    raise ValueError("Groq API key not found in .env file")

# Initialize the HuggingFace Embedding Model
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Load the Text Data and Create Documents
def load_documents(file_path):
    loader = TextLoader(file_path,encoding='utf-8')
    documents = loader.load()
    return documents

# Custom RecursiveCharacterTextSplitter with regex patterns for subtopics and chapters
class CustomTextSplitter(RecursiveCharacterTextSplitter):
    def __init__(self, **kwargs):
        subtopic_pattern = re.compile(r'(\d+(\.\d+)+)')
        chapter_separator = 'chapter end -------------------------------------'

        # Initialize with any other parameters, and add your separators
        super().__init__(separators=[chapter_separator], **kwargs)
        self.subtopic_pattern = subtopic_pattern

    def split_text(self, text):
        # First, split by chapters
        texts = super().split_text(text)
        documents = []
        
        # For each chapter, split by subtopic using the subtopic regex
        chapter_number = 1
        for chapter in texts:
            subtopic_splits = self._split_by_subtopic(chapter, chapter_number)
            documents.extend(subtopic_splits)
            chapter_number += 1
        
        return documents

    def _split_by_subtopic(self, text, chapter_number):
        # Use the subtopic regex to split text
        matches = list(self.subtopic_pattern.finditer(text))
        if not matches:
            # No subtopics found, return the full text as a single Document
            return [Document(page_content=text.strip(), metadata={"chapter": chapter_number})]
        
        subtopics = []
        start_idx = 0
        subtopic_number = 1
        
        for match in matches:
            end_idx = match.start()
            if start_idx != end_idx:
                subtopics.append(Document(
                    page_content=text[start_idx:end_idx].strip(),
                    metadata={"chapter": chapter_number, "subtopic": subtopic_number}
                ))
            start_idx = end_idx
            subtopic_number += 1
            
        # Append the remaining part as a subtopic
        subtopics.append(Document(
            page_content=text[start_idx:].strip(),
            metadata={"chapter": chapter_number, "subtopic": subtopic_number}
        ))
        
        return subtopics

# Create embeddings and handle storage
def embed_documents(split_docs, embedding_model):
    EMBEDDINGS_FOLDER = "embeddings"
    EMBEDDINGS_FILE = os.path.join(EMBEDDINGS_FOLDER, "chatbot_embeddings01.pkl")

    if not os.path.exists(EMBEDDINGS_FOLDER):
        os.makedirs(EMBEDDINGS_FOLDER)

    if os.path.exists(EMBEDDINGS_FILE):
        print(f"Loading existing embeddings from {EMBEDDINGS_FILE}...")
        with open(EMBEDDINGS_FILE, 'rb') as f:
            embedded_docs = pickle.load(f)
            print("Embeddings loaded successfully.")
    else:
        print("Creating new embeddings...")
        texts = [doc.page_content for doc in split_docs]
        embedded_docs = embedding_model.embed_documents(texts)

        with open(EMBEDDINGS_FILE, 'wb') as f:
            pickle.dump(embedded_docs, f)
            print(f"Embeddings saved to {EMBEDDINGS_FILE}")

    return embedded_docs

# Store embeddings in Chroma vector store
def store_embeddings(split_docs, embedding_model):
    vector_store = Chroma.from_documents(split_docs, embedding_model) 
    return vector_store

def getting_retriever(llm,vector_store):
    """Opiton 01: Creating ContextualCompressionRetriever
    Contextual Compression will find the relevant records and only contains the relevant data from chunks instead of whole chunks
    Maximum Marginal Relevance (mmr) is used to get diverse set of documents.
    Option 02: SelfQueryRetrieval for filtering based on sources"""
    # Option 01
    compressor = LLMChainExtractor.from_llm(llm)
    compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vector_store.as_retriever(search_kwargs={"k": 10})
    #search_type = "mmr"
    )
    return compression_retriever

# Initialize the LLM
def initialize_llm(model_name="llama-3.1-70b-versatile", temperature=0):
    llm = ChatGroq(
        model= model_name,
        temperature=temperature,
    )
    return llm


# Load your document
documents = load_documents("C:\\Users\\anast\\Documents\\PUCIT\\Projects\\StudyBuddy-FYP\\Backend\\chatbot\\9thComputerScience_cleaned.txt")
# documents = load_documents("9thComputerScience_cleaned.txt")

# Split the text into smaller chunks
text_splitter = CustomTextSplitter(chunk_size=1000, chunk_overlap=100)
split_docs = text_splitter.split_text(documents[0].page_content)
# print(split_docs[10])

# Create embeddings and store them
embedded_docs = embed_documents(split_docs, embedding_model)
vector_store = store_embeddings(split_docs, embedding_model)
llm = initialize_llm()

# Create the retriever having contextual compression
retriever = getting_retriever(llm,vector_store)

contextualize_q_system_prompt = (
    "Act as a conversational assistant similar to ChatGPT. Engage in natural dialogue and answer questions based on the context provided through the chat history or retrieved using Retrieval-Augmented Generation (RAG). If the relevant context is not found either in the conversation or via RAG, respond by stating that the information is unavailable or ask for more clarification from the user. Do not provide speculative or out-of-context information. Always ensure responses are precise and contextually relevant."
)

contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

# Creating a new retirever that is aware of the chat history. Rest of the things are same.
history_aware_retriever = create_history_aware_retriever(
    llm, retriever, contextualize_q_prompt
)

system_prompt = (
    "Act as a conversational assistant similar to ChatGPT. Engage in natural dialogue and answer questions based on the context provided through the chat history or retrieved using Retrieval-Augmented Generation (RAG). If the relevant context is not found either in the conversation or via RAG, respond by stating that the information is unavailable or ask for more clarification from the user. Do not provide speculative or out-of-context information. Always ensure responses are precise and contextually relevant."
    "\n\n"
    "{context}"
)

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)


question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

chat_history = []   # List of messages in the chat history

@api_view(['POST'])
def ask_query(request):

    global chat_history
    global rag_chain

    # Parse the input query
    query = request.data.get('query')
    print(query)
    if not query:
        return Response({"error": "Query parameter is missing."}, status=400)
    print(query)
    # Run the RAG pipeline
    result = rag_chain.invoke({"input": query, "chat_history": chat_history})
    print(query)
    # Append the user query and the system response to the chat history
    chat_history.extend(
        [
            HumanMessage(content=query),
            AIMessage(content=result["answer"]),
        ]
    )
    print(result['answer'])
    # Return the response
    return Response({
        "query": query,
        "answer": result["answer"],
        "context": [result.get("context", "No context provided")],
        "chat_history": [msg.content for msg in chat_history]
    })



