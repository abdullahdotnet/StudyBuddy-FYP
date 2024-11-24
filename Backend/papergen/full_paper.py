import os
import PyPDF2
from . import prompts
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import CharacterTextSplitter


GLOBAL_DB = None
GLOBAL_EMBEDDINGS = None
BASE_DIR = os.getcwd()


def initialize_groq():
    load_dotenv(os.path.join(BASE_DIR, '.env'))
    api_key = os.getenv("GROQ_API_KEY")
    if api_key is None:
        raise Exception("GROQ_API_KEY not found in environment variables")
    return api_key


def get_llm_model():
    api_key = initialize_groq()
    llm_model = ChatGroq(
        model="llama3-8b-8192",
        api_key=api_key,
        temperature=0.7
    )
    return llm_model


def get_pdf_files_from_folder(folder_path):
    pdf_files = []
    for file in os.listdir(folder_path):
        if file.lower().endswith('.pdf'):
            pdf_files.append(os.path.join(folder_path, file))
    return pdf_files


def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text


def create_embeddings(pdf_paths):
    global GLOBAL_DB
    global GLOBAL_EMBEDDINGS

    if GLOBAL_DB is not None:
        return GLOBAL_DB

    all_texts = ""
    for pdf_path in pdf_paths:
        pdf_text = extract_text_from_pdf(pdf_path)
        all_texts += pdf_text + "\n"

    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_text(all_texts)

    embeddings = HuggingFaceEmbeddings()
    db = Chroma.from_texts(texts, embeddings)

    GLOBAL_DB = db
    GLOBAL_EMBEDDINGS = embeddings

    return db


def create_qa_system(db):
    llm = get_llm_model()
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=db.as_retriever(
            search_kwargs={"k": 3}
        )
    )
    return qa


def split_objective_questions(text):
    lines = text.split("\n")
    question_no = 1
    questions = []
    current_question = {}

    for line in lines:
        line = line.strip()
        if line and (line[0].isdigit() or line[2].isdigit()):
            if current_question:
                questions.append(current_question)

            question_text = line.split(" ", 1)[1]
            question_text = question_text.replace("**", "")
            current_question = {
                "id": question_no,
                "question": question_text,
                "options": {}
            }
            question_no += 1

        elif line and line[0].isalpha() and line[1] == ")":
            option_label = line[0]
            option_text = line.split(") ", 1)[1]
            current_question["options"][option_label] = option_text

    if current_question:
        questions.append(current_question)

    return questions


def split_subjective_questions_1(text):
    lines = text.split("\n")
    result = {
        "section_A": {},
        "section_B": {}
    }
    current_section = None
    current_part = None
    current_question_no = 1

    for line in lines:
        line = line.strip()

        if line.startswith("**SECTION A"):
            current_section = "section_A"
            current_part = None
            current_question_no = 1

        elif line.startswith("**SECTION B"):
            current_section = "section_B"
            current_part = None
            current_question_no = 1

        elif (line.startswith("**PART") or line.startswith("**Part")) and current_section == "section_A":
            part_name = f"part{len(result['section_A']) + 1}"
            result["section_A"][part_name] = {}
            current_part = part_name
            current_question_no = 1

        elif line and (line[0].isdigit() or (line[1] == '.' and line[0].isdigit())) and current_section == "section_A" and current_part:
            question_text = line.split(" ", 1)[1].replace("**", "")
            result["section_A"][current_part][
                f"question_{current_question_no}"
            ] = question_text
            current_question_no += 1

        elif line and (line[0].isdigit() or line[2].isdigit() or (line[1] == '.' and line[0].isdigit())) and current_section == "section_B":
            question_text = (line.replace("**", "")).split(". ")[1]
            result["section_B"][
                f"question_{current_question_no}"
            ] = question_text
            current_question_no += 1

    return result


def split_subjective_questions_2(text):
    clean_text = text.replace("**", "").strip()
    sections = clean_text.split("Section ")
    paper = {}

    for section in sections[1:]:
        section_title, section_content = section.split(":", 1)
        section_key = f"section_{section_title.lower().strip()}"
        paper[section_key] = section_content.strip()

    return paper


def generate_objective_questions(qa_system):
    prompt = prompts.OBJECTIVE_PROMPT
    response = qa_system.run(prompt)
    return response


def generate_subjective_questions(qa_system):
    prompt = prompts.SUBJECTIVE_PROMPT
    response = qa_system.run(prompt)
    return response


def generate_full_book_embeddings(grade, subject, save_paper=False):
    path = rf"/papergen/board/grade{grade}/{subject}"
    subject_books_folder = BASE_DIR + f"{path}/books"
    objective_past_paper_folder = BASE_DIR + f"{path}/obj_pdfs"
    subjective_past_paper_folder = BASE_DIR + f"{path}/sub_pdfs"

    subject_books_path = get_pdf_files_from_folder(subject_books_folder)
    objective_past_paper_paths = get_pdf_files_from_folder(
        objective_past_paper_folder
    )
    subjective_past_paper_paths = get_pdf_files_from_folder(
        subjective_past_paper_folder
    )
    embeddings_db = create_embeddings(
        objective_past_paper_paths + subjective_past_paper_paths + subject_books_path
    )

    return embeddings_db


def get_objective_questions(grade, subject):
    embeddings_db = generate_full_book_embeddings(grade, subject)
    objective_qa_system = create_qa_system(embeddings_db)
    objective_questions = generate_objective_questions(objective_qa_system)
    objective_json = split_objective_questions(objective_questions)
    return objective_json


def get_subjective_questions(grade, subject):
    embeddings_db = generate_full_book_embeddings(grade, subject)
    subjective_qa_system = create_qa_system(embeddings_db)
    subjective_questions = generate_subjective_questions(subjective_qa_system)
    subjective_json = split_subjective_questions_2(subjective_questions)
    return subjective_json


def evaluate_objective(question, qa_chain):
    prompt = f"""
    Referring to Multiple Choice Question, details are:
    {question}

    Criteria:
    1. Correctness: Is the answer correct? (1 point if correct, 0 if incorrect)
    2. Validity: Is the response a valid option (A, B, C, or D)?

    Instructions:
    - Assign 1 point if the answer is correct and valid, 0 points otherwise.
    - Provide a brief explanation (1-2 sentences) for the score.
    - If the response is invalid, explain why and assign 0 points.

    Format your response as follows:
    Score: [0 or 1]
    Explanation: [Your brief explanation]

    Limit your entire response to 50 words.
    """

    try:
        evaluation = qa_chain.run(prompt)
        return evaluation
    except Exception as e:
        return f"Error: {e}"


def evaluate_objective_chain(questions, grade, subject):
    embeddings_db = generate_full_book_embeddings(grade, subject)
    qa_chain = create_qa_system(embeddings_db)
    evaluation = []
    for question in questions:
        question_id = question["id"]
        response = evaluate_objective(question, qa_chain)
        result = response.split("\n")
        evaluation.append({
            "question_id": question_id,
            "score": result[0].replace("Score: ", ""),
            "explanation": result[1].replace("Explanation: ", "")
        })

    return evaluation
