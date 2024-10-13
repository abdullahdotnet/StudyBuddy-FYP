# utils.py
import os
import PyPDF2
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter,RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# Global variables and functions to persist things across requests 
qa_chain = None
embeddings = None
llm_model = None
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAST_PAPER_FOLDER = os.path.join(BASE_DIR, 'test_session\\sub_output_pdfs')
BOOK1_PATH = os.path.join(BASE_DIR, 'test_session\\cs9.pdf')

def get_embeddings_model():
    global embeddings
    if embeddings is None:
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    return embeddings

def create_or_load_chroma(texts, persist_dir=os.path.join(BASE_DIR, r'test_session\\chroma_db')):
    # Check if the persist directory already exists
    if os.path.exists(persist_dir):
        # Load the existing Chroma vector store from disk
        db = Chroma(persist_directory=persist_dir, embedding_function=get_embeddings_model())
    else:
        # Create a new Chroma vector store and persist it
        db = Chroma.from_texts(texts, get_embeddings_model(), persist_directory=persist_dir)
        db.persist()  # No arguments needed for persist()
    return db

def extract_or_load_pdf_text(pdf_path, cache_dir=os.path.join(BASE_DIR, r"test_session\\pdf_cache")):
    os.makedirs(cache_dir, exist_ok=True)
    cache_file = os.path.join(cache_dir, os.path.basename(pdf_path) + ".txt")
    if os.path.exists(cache_file):
        # Load cached text if available
        with open(cache_file, 'r', encoding='utf-8') as f:
            return f.read()
    else:
        # Extract and save text if not cached
        text = extract_text_from_pdf(pdf_path)
        with open(cache_file, 'w', encoding='utf-8') as f:
            f.write(text)
        return text

def get_llm_model():
    global llm_model
    if llm_model is None:
        llm_model = ChatGroq(model="llama-3.1-70b-versatile", temperature=0.7)
    return llm_model

# Normal code
def initialize_groq():
    load_dotenv()
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

def create_qa_system(past_paper_paths, subject_book_paths):
    all_texts = ""
    for pdf_path in past_paper_paths + subject_book_paths:
        pdf_text = extract_or_load_pdf_text(pdf_path)
        all_texts += pdf_text + "\\n"

    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_text(all_texts)

    # Ensure the embedding model matches the Chroma collection's dimensionality
    embeddings = get_embeddings_model()  # Use a model with 384-dim embeddings
    db = create_or_load_chroma(texts)  # Ensure this aligns with the embedding dimensionality

    llm = get_llm_model()

    qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=db.as_retriever(search_kwargs={"k": 3}))
    return qa

def get_pdf_files_from_folder(folder_path):
    """
    Returns a list of PDF file paths from the specified folder.
    """
    pdf_files = []
    for file in os.listdir(folder_path):
        if file.lower().endswith('.pdf'):
            pdf_files.append(os.path.join(folder_path, file))
    return pdf_files

def initialize_chain():
    """
    Initialize the QA chain and store it in a global variable for reuse.
    """
    global qa_chain
    global PAST_PAPER_FOLDER
    global BOOK1_PATH
    if qa_chain is None:
        past_paper_folder = PAST_PAPER_FOLDER  
        past_paper_paths = get_pdf_files_from_folder(past_paper_folder)
        book1 = BOOK1_PATH  # Add your subject book PDFs here
        subject_book_paths = [book1]  # Add your subject book PDFs here
        qa_chain = create_qa_system(past_paper_paths, subject_book_paths)

def generate_question_paper(num_questions):
    """
    Generate questions using the pre-initialized QA system.
    """
    global qa_chain
    if qa_chain is None:
        raise Exception("QA Chain has not been initialized.")
    
    questions = []
    for i in range(num_questions):
        prompt = f"Generate a new subjective question paper based on the contents of the past papers, ensuring it's within the scope of the subject books. There should be two sections in the paper, in first section there are three parts of short questions and in each part of short question, there are six short questions. Then in second section, there are three long questions. The question should be challenging but fair. Format the question in a structured manner suitable for an exam paper. also space between each question should be at least 2 lines. donot repeat the questions."
        response = qa_chain.run(prompt)
        questions.append(response)
    return questions


def create_evaluation_qa_system(question_paper):

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_text(question_paper)

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
    db = Chroma.from_texts(texts, embeddings)

    llm = ChatGroq(
        model="llama-3.1-70b-versatile",
        temperature=0.2,
        max_tokens=1000,  # Limit token generation
    )

    qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=db.as_retriever(search_kwargs={"k": 2}))

    return qa