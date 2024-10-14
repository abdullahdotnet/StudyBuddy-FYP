# import os
# from dotenv import load_dotenv
# from langchain.embeddings import HuggingFaceEmbeddings
# from langchain.vectorstores import Chroma
# from langchain.document_loaders import TextLoader
# from langchain_groq import ChatGroq
# from langchain.schema import Document
# from langchain.retrievers import ContextualCompressionRetriever
# from langchain.retrievers.document_compressors import LLMChainExtractor
# from langchain.chains import create_retrieval_chain
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain_core.prompts import ChatPromptTemplate
# from langchain.chains import create_history_aware_retriever
# from langchain_core.prompts import MessagesPlaceholder
# from langchain_core.messages import AIMessage, HumanMessage

# # Load .env file for API keys
# load_dotenv()
# groq_api_key = os.getenv('GROQ_API_KEY')

# # Initialize the HuggingFace Embedding Model
# embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# # Load the Text Data and Create Documents
# import os
# from langchain.schema import Document

# def load_documents():
#     loader = TextLoader("E:\\University\\Final Year Project\\StudyBuddy-FYP\\Backend\\LLMs\\LearningChatBot\\resources\\9thComputerScience_cleaned.txt",encoding='utf-8')
#     documents = loader.load()
#     return documents

# # def load_documents(file_name="9thComputerScience_cleaned.txt"):
# #     # Start searching from the present working directory
# #     current_dir = os.getcwd()
# #     file_path = None

# #     # Search for the file in the current directory and all subdirectories
# #     for root, dirs, files in os.walk(current_dir):
# #         if file_name in files:
# #             file_path = os.path.join(root, file_name)
# #             break

# #     if not file_path:
# #         raise FileNotFoundError(f"File '{file_name}' not found in the current working directory or its subdirectories.")
# #     loader = TextLoader(file_path)
# #     documents = loader.load()
# #     return documents


# # Store embeddings in Chroma vector store
# def store_embeddings(documents):
#     vector_store = Chroma.from_documents(documents, embedding_model)
#     return vector_store

# # Initialize the LLM
# def initialize_llm(model_name="llama-3.1-70b-versatile", temperature=0):
#     llm = ChatGroq(
#         model=model_name,
#         temperature=temperature,
#     )
#     return llm

# # Create the compression retriever
# def create_compression_retriever(llm, vector_store):
#     compressor = LLMChainExtractor.from_llm(llm)
#     compression_retriever = ContextualCompressionRetriever(
#         base_compressor=compressor,
#         base_retriever=vector_store.as_retriever(search_kwargs={"k": 1}),
#     )
#     return compression_retriever

# # Create the history-aware retriever
# def create_history_aware_retriever(llm, retriever, system_prompt):

    
#     contextualize_q_prompt = ChatPromptTemplate.from_messages(
#         [
#             ("system", system_prompt),
#             MessagesPlaceholder("chat_history"),
#             ("human", "{input}"),
#         ]
#     )
#     history_aware_retriever = create_history_aware_retriever(
#         llm, retriever, contextualize_q_prompt
#     )
#     return history_aware_retriever

# # Create the RAG chain
# def create_rag_chain(llm, retriever, system_prompt):
#     print("inside rag chain",'system prompt = ',system_prompt)

#     print('='*20)
#     # Define the question-answering prompt
#     qa_prompt = ChatPromptTemplate.from_messages(
#         [
#             ("system", system_prompt),
#             MessagesPlaceholder("chat_history"),
#             ("human", "{input}"),
#         ]
#     )
#     print("inside rag chain",qa_prompt)
#     print('='*20)
#     question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
#     print("question_answer_chain generated")
#     print('='*20)
#     rag_chain = create_retrieval_chain(retriever, question_answer_chain)
#     print("rag_chain generated")
#     print('='*20)
#     return rag_chain

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

embedding_model = None
def initialize_embeddings_model():
    global embedding_model
    if embedding_model is None:
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
    EMBEDDINGS_FOLDER = "chatbot\\embeddings"
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

def initialize_documents():
    global documents, book_file_path
    # Load your document
    documents = load_documents(book_file_path)
def initialize_text_splitter():
    global text_splitter
    text_splitter = CustomTextSplitter(chunk_size=1000, chunk_overlap=0)

def intialize_split_docs():
    global split_docs, documents, text_splitter
    split_docs = text_splitter.split_text(documents[0].page_content)

def initialize_vector_store():
    global vector_store, split_docs, embedding_model
    vector_store = store_embeddings(split_docs, embedding_model)
def initialize_embedded_docs():
    global embedded_docs, split_docs, embedding_model
    embedded_docs = embed_documents(split_docs, embedding_model)

def initialize_chat_llm():
    global llm
    llm = initialize_llm()

def initialize_retriever():
    # Create the retriever having contextual compression
    global retriever, llm, vector_store
    retriever = getting_retriever(llm, vector_store)

def initialize_contextualize_q_system_prompt():
    global contextualize_q_system_prompt
    contextualize_q_system_prompt = (
        "Act as a conversational assistant similar to ChatGPT. Engage in natural dialogue and answer questions based on the context provided through the chat history or retrieved using Retrieval-Augmented Generation (RAG). If the relevant context is not found either in the conversation or via RAG, respond by stating that the information is unavailable or ask for more clarification from the user. Do not provide speculative or out-of-context information. Always ensure responses are precise and contextually relevant."
    )

def initialize_contextualize_q_prompt():
    global contextualize_q_prompt
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

def initialize_history_aware_retriever():
    # Creating a new retirever that is aware of the chat history. Rest of the things are same.
    global llm, retriever, contextualize_q_prompt, history_aware_retriever
    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )

def initialize_system_prompt():
    global system_prompt
    system_prompt = (
        "Act as a conversational assistant similar to ChatGPT. Engage in natural dialogue and answer questions based on the context provided through the chat history or retrieved using Retrieval-Augmented Generation (RAG). If the relevant context is not found either in the conversation or via RAG, respond by stating that the information is unavailable or ask for more clarification from the user. Do not provide speculative or out-of-context information. Always ensure responses are precise and contextually relevant."
        "\n\n"
        "{context}"
    )

def initialize_qa_prompt():
    global qa_prompt
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

def initialize_question_answer_chain():
    global llm, qa_prompt, question_answer_chain
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

# def initialize_chain():
#     initialize_embeddings_model()
#     initialize_documents()
#     initialize_text_splitter()
#     intialize_split_docs()
#     # print(split_docs[10])
#     # Create embeddings and store them
#     # initialize_embedded_docs()
#     initialize_vector_store()
#     initialize_chat_llm()
#     initialize_retriever()
#     initialize_contextualize_q_system_prompt()
#     initialize_contextualize_q_prompt()
#     initialize_history_aware_retriever()
#     initialize_system_prompt()
#     initialize_qa_prompt()
#     initialize_question_answer_chain()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
book_file_path = os.path.join(BASE_DIR, 'chatbot\\9thComputerScience_cleaned.txt')  # Remove leading backslash
# documents = None
# text_splitter = None
# split_docs = None
# vector_store = None
# embedded_docs = None
# llm = None
# retriever = None
# contextualize_q_system_prompt = None
# contextualize_q_prompt = None
# history_aware_retriever = None
# system_prompt = None
# qa_prompt = None
# question_answer_chain = None

# def create_rag_chain():
#     global embedding_model, book_file_path, documents, text_splitter, split_docs, vector_store, embedded_docs, llm, retriever, contextualize_q_system_prompt, contextualize_q_prompt, history_aware_retriever, system_prompt, qa_prompt, question_answer_chain
#     if history_aware_retriever is None:     # if the embedding_model is not loaded, it means the chain is not initialized, so initializing all the things for the first time
#         initialize_chain()
#     rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
#     return rag_chain

class RAGChainInitializer:
    _instance = None
    _rag_chain = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RAGChainInitializer, cls).__new__(cls)
        return cls._instance

    def initialize_chain(self):
        if self._rag_chain is None:
            initialize_embeddings_model()
            initialize_documents()
            initialize_text_splitter()
            intialize_split_docs()
            initialize_vector_store()
            initialize_chat_llm()
            initialize_retriever()
            initialize_contextualize_q_system_prompt()
            initialize_contextualize_q_prompt()
            initialize_history_aware_retriever()
            initialize_system_prompt()
            initialize_qa_prompt()
            initialize_question_answer_chain()
            self._rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
        return self._rag_chain

# usage
def create_rag_chain():
    initializer = RAGChainInitializer()
    return initializer.initialize_chain()
