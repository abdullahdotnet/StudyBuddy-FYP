# utils.py
import os
import PyPDF2
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# Global variable to hold the initialized chain
qa_chain = None

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
        pdf_text = extract_text_from_pdf(pdf_path)
        all_texts += pdf_text + "\\n"

    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_text(all_texts)

    # Ensure the embedding model matches the Chroma collection's dimensionality
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")  # Use a model with 384-dim embeddings
    db = Chroma.from_texts(texts, embeddings)  # Ensure this aligns with the embedding dimensionality

    llm = ChatGroq(
        model="llama-3.1-70b-versatile",
        temperature=0.7,
    )

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
    if qa_chain is None:
        past_paper_folder = "E:\\University\\Final Year Project\\StudyBuddy-FYP\\Backend\\test_session\\sub_output_pdfs"  # Folder containing past paper PDFs
        past_paper_paths = get_pdf_files_from_folder(past_paper_folder)
    
        subject_book_paths = ["E:\\University\\Final Year Project\\StudyBuddy-FYP\\Backend\\test_session\\cs9.pdf"]  # Add your subject book PDFs here

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


