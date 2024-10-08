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
