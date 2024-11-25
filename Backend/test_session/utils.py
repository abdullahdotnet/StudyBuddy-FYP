# utils.py
import os
import random
import PyPDF2
from typing import List, Dict

class PaperGenerator:
    def __init__(self):
        # Template for short questions
        self.short_questions = [
            "Define and explain the concept of {topic}.",
            "What are the key characteristics of {topic}?",
            "Compare and contrast {topic1} and {topic2}.",
            "Briefly describe the importance of {topic}.",
            "List and explain three main features of {topic}.",
            "How does {topic} contribute to {field}?",
            "Explain the relationship between {topic1} and {topic2}.",
            "What are the practical applications of {topic}?",
            "Describe the process of {topic}.",
            "Analyze the impact of {topic} on {field}."
        ]
        
        # Template for long questions
        self.long_questions = [
            "Discuss in detail the evolution and significance of {topic}. Include relevant examples and case studies.",
            "Critically analyze the role of {topic} in {field}. Support your answer with appropriate examples.",
            "Evaluate the importance of {topic} in modern context. Discuss challenges and future prospects.",
            "Explain the fundamental principles of {topic} and their practical applications in {field}.",
            "Compare and contrast different approaches to {topic}. Analyze their strengths and limitations."
        ]
        
        # Common topics in Computer Science (add or modify based on your subject)
        self.topics = [
            "Object-Oriented Programming",
            "Data Structures",
            "Algorithms",
            "Database Management",
            "Computer Networks",
            "Operating Systems",
            "Software Engineering",
            "Web Development",
            "Artificial Intelligence",
            "Machine Learning",
            "Cybersecurity",
            "Cloud Computing",
            "Big Data Analytics",
            "System Design",
            "Software Testing"
        ]

    def generate_short_question(self) -> str:
        """Generate a single short question"""
        template = random.choice(self.short_questions)
        if "{topic1}" in template and "{topic2}" in template:
            topics = random.sample(self.topics, 2)
            return template.format(topic1=topics[0], topic2=topics[1])
        elif "{topic}" in template and "{field}" in template:
            topic = random.choice(self.topics)
            field = random.choice([t for t in self.topics if t != topic])
            return template.format(topic=topic, field=field)
        else:
            return template.format(topic=random.choice(self.topics))

    def generate_long_question(self) -> str:
        """Generate a single long question"""
        template = random.choice(self.long_questions)
        topic = random.choice(self.topics)
        field = random.choice([t for t in self.topics if t != topic])
        return template.format(topic=topic, field=field)

    def generate_paper(self) -> str:
        """Generate a complete paper with sections"""
        paper_sections = []
        
        # Add header
        paper_sections.append("COMPUTER SCIENCE EXAMINATION")
        paper_sections.append("Time: 3 hours\tMaximum Marks: 100\n")
        paper_sections.append("Instructions:")
        paper_sections.append("1. Attempt all questions")
        paper_sections.append("2. Each section carries equal marks")
        paper_sections.append("3. Write your answers clearly and neatly\n")
        
        # Section 1: Short Questions
        paper_sections.append("SECTION 1 - SHORT QUESTIONS (50 MARKS)")
        for part in ['A', 'B', 'C']:
            paper_sections.append(f"\nPart {part} (16 marks)")
            for i in range(6):
                paper_sections.append(f"{i+1}. {self.generate_short_question()}")
        
        # Section 2: Long Questions
        paper_sections.append("\nSECTION 2 - LONG QUESTIONS (50 MARKS)")
        paper_sections.append("Attempt all questions. Each question carries equal marks.\n")
        for i in range(3):
            paper_sections.append(f"Question {i+1}:")
            paper_sections.append(self.generate_long_question())
            paper_sections.append("")  # Add spacing between questions
        
        return "\n".join(paper_sections)

def generate_question_paper(num_questions: int = 1) -> List[str]:
    """Main function to generate papers"""
    generator = PaperGenerator()
    return [generator.generate_paper()]



# import os
# import PyPDF2
# from langchain.embeddings import HuggingFaceEmbeddings
# from langchain.vectorstores import Chroma
# from langchain.text_splitter import CharacterTextSplitter, RecursiveCharacterTextSplitter
# from langchain.chains import RetrievalQA
# from langchain_groq import ChatGroq
# from dotenv import load_dotenv

# # Global variables
# qa_chain = None
# embeddings = None
# llm_model = None

# # Set BASE_DIR using current working directory or explicit path
# try:
#     # First try to use __file__ if available (when running as a module)
#     BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# except NameError:
#     # If __file__ is not available, use the current working directory
#     # or set an explicit path
#     BASE_DIR = os.path.abspath(os.path.join(os.getcwd()))
#     # Alternatively, set an explicit path:
#     # BASE_DIR = r"C:\Your\Project\Path"  # Replace with your actual path

# # Define paths relative to BASE_DIR
# PAST_PAPER_FOLDER = os.path.join(BASE_DIR, 'test_session', 'sub_output_pdfs')
# BOOK1_PATH = os.path.join(BASE_DIR, 'test_session', 'cs9.pdf')
# CHROMA_DIR = os.path.join(BASE_DIR, 'test_session', 'chroma_db')
# PDF_CACHE_DIR = os.path.join(BASE_DIR, 'test_session', 'pdf_cache')

# # Create necessary directories
# for directory in [PAST_PAPER_FOLDER, CHROMA_DIR, PDF_CACHE_DIR]:
#     os.makedirs(directory, exist_ok=True)

# def get_embeddings_model():
#     global embeddings
#     try:
#         if embeddings is None:
#             embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
#         return embeddings
#     except Exception as e:
#         raise Exception(f"Failed to initialize embeddings model: {str(e)}")

# def create_or_load_chroma(texts):
#     try:
#         embeddings = get_embeddings_model()
        
#         if os.path.exists(CHROMA_DIR):
#             db = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
#         else:
#             db = Chroma.from_texts(texts, embeddings, persist_directory=CHROMA_DIR)
#             db.persist()
#         return db
#     except Exception as e:
#         raise Exception(f"Failed to create/load Chroma database: {str(e)}")

# def get_llm_model():
#     global llm_model
#     try:
#         if llm_model is None:
#             load_dotenv()
#             groq_api_key = os.getenv("GROQ_API_KEY")
#             if not groq_api_key:
#                 raise Exception("GROQ_API_KEY not found in environment variables")
#             llm_model = ChatGroq(
#                 model="llama3-8b-8192",
#                 temperature=0.7,
#                 groq_api_key=groq_api_key
#             )
#         return llm_model
#     except Exception as e:
#         raise Exception(f"Failed to initialize LLM model: {str(e)}")

# # Normal code
# def initialize_groq():
#     load_dotenv()
#     GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# def extract_text_from_pdf(pdf_path):
#     with open(pdf_path, 'rb') as file:
#         reader = PyPDF2.PdfReader(file)
#         text = ""
#         for page in reader.pages:
#             text += page.extract_text()
#     return text

# def create_qa_system(past_paper_paths, subject_book_paths):
#     all_texts = ""
#     for pdf_path in past_paper_paths + subject_book_paths:
#         pdf_text = extract_text_from_pdf(pdf_path)
#         all_texts += pdf_text + "\\n"

#     text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
#     texts = text_splitter.split_text(all_texts)

#     # Ensure the embedding model matches the Chroma collection's dimensionality
#     embeddings = get_embeddings_model()  # Use a model with 384-dim embeddings
#     db = create_or_load_chroma(texts)  # Ensure this aligns with the embedding dimensionality

#     llm = get_llm_model()

#     qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=db.as_retriever(search_kwargs={"k": 3}))
#     return qa

# def get_pdf_files_from_folder(folder_path):
#     """
#     Returns a list of PDF file paths from the specified folder.
#     """
#     pdf_files = []
#     for file in os.listdir(folder_path):
#         if file.lower().endswith('.pdf'):
#             pdf_files.append(os.path.join(folder_path, file))
#     return pdf_files

# def initialize_chain():
#     """
#     Initialize the QA chain and store it in a global variable for reuse.
#     """
#     global qa_chain
#     global PAST_PAPER_FOLDER
#     global BOOK1_PATH
#     if qa_chain is None:
#         past_paper_folder = PAST_PAPER_FOLDER  
#         past_paper_paths = get_pdf_files_from_folder(past_paper_folder)
#         book1 = BOOK1_PATH  # Add your subject book PDFs here
#         subject_book_paths = [book1]  # Add your subject book PDFs here
#         qa_chain = create_qa_system(past_paper_paths, subject_book_paths)

# def generate_question_paper(num_questions):
#     """
#     Generate questions using the pre-initialized QA system.
#     """
#     global qa_chain
#     if qa_chain is None:
#         raise Exception("QA Chain has not been initialized.")
    
#     questions = []
#     for i in range(num_questions):
#         prompt = f"Generate a new subjective question paper based on the contents of the past papers, ensuring it's within the scope of the subject books. There should be two sections in the paper, in first section there are three parts of short questions and in each part of short question, there are six short questions. Then in second section, there are three long questions. The question should be challenging but fair. Format the question in a structured manner suitable for an exam paper. also space between each question should be at least 2 lines. donot repeat the questions."
#         response = qa_chain.run(prompt)
#         questions.append(response)
#     return questions


# def create_evaluation_qa_system(question_paper):

#     text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
#     texts = text_splitter.split_text(question_paper)

#     embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
#     db = Chroma.from_texts(texts, embeddings)

#     llm = ChatGroq(
#         model="llama3-8b-8192",
#         temperature=0.2,
#         max_tokens=1000,  # Limit token generation
#     )

#     qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=db.as_retriever(search_kwargs={"k": 2}))

#     return qa