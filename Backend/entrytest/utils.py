import os
import PyPDF2
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_groq import ChatGroq
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_JUSTIFY
from django.conf import settings

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

def get_pdf_files_from_folder(folder_name):
    entrytest_dir = os.path.dirname(os.path.abspath(__file__))
    folder_path = os.path.join(entrytest_dir, folder_name)  # Join with the entrytest directory

    pdf_files = []
    try:
        for file in os.listdir(folder_path):
            if file.lower().endswith('.pdf'):
                pdf_files.append(os.path.join(folder_path, file))
    except FileNotFoundError:
        print(f"Error: The folder '{folder_path}' does not exist.")
    
    return pdf_files

def create_qa_system(past_paper_paths, subject_book_paths):
    all_texts = ""
    for pdf_path in past_paper_paths + subject_book_paths:
        pdf_text = extract_text_from_pdf(pdf_path)
        all_texts += pdf_text + "\n"

    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_text(all_texts)

    embeddings = HuggingFaceEmbeddings()
    db = Chroma.from_texts(texts, embeddings)

    llm = ChatGroq(model="llama-3.1-70b-versatile", temperature=0.7)
    qa = RetrievalQA.from_chain_type(
        llm=llm, chain_type="stuff", retriever=db.as_retriever(search_kwargs={"k": 3})
    )

    return qa

def generate_question_paper(qa_system, num_questions):
    questions = []
    for _ in range(num_questions):
        prompt = (
            "Generate a new multiple choice exam which has 10 questions based "
            "on the content of the past papers, ensuring it's within the scope "
            "of the subject books. The question should be challenging but fair. "
            "Format the question in a structured manner suitable for an exam paper, "
            "including clear instructions. Give MCQs in the form of a, b, c, d options. "
            "Also, space between each question should be at least 2 lines in proper format."
        )
        response = qa_system.run(prompt)
        questions.append(response)
    return questions

def create_reformatted_question_paper_pdf(questions, output_path):
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    content = []

    content.append(Paragraph("Generated Question Paper", styles['Title']))
    content.append(Spacer(1, 12))
    styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))

    for i, question in enumerate(questions, 1):
        content.append(Paragraph(f"Question {i}", styles['Heading2']))
        lines = question.split('\n')
        for line in lines:
            if line.strip():
                if line.startswith('*') or line.startswith('-'):
                    content.append(Paragraph(f"• {line.strip('*- ')}", styles['BodyText']))
                else:
                    content.append(Paragraph(line, styles['Justify']))
        content.append(Spacer(1, 12))

    doc.build(content)


