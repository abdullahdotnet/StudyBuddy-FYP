import os
import PyPDF2
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import CharacterTextSplitter


qa_chain = None
llm_model = None
embeddings = None

BASE_DIR = os.getcwd()
BOOKS_PATH = os.path.join(BASE_DIR, r'papergen\books')
PAPERS_PATH = os.path.join(BASE_DIR, r'papergen\mcqs')
CHROMA_DB_PATH = os.path.join(BASE_DIR, r'papergen\chroma_db')
PDF_CACHE_PATH = os.path.join(BASE_DIR, r'papergen\pdf_cache')


def initialize_groq():
    load_dotenv(os.path.join(BASE_DIR, '.env'))
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    if GROQ_API_KEY is None:
        raise Exception("GROQ_API_KEY not found in environment variables")
    return GROQ_API_KEY


def get_llm_model():
    global llm_model
    if llm_model is None:
        api_key = initialize_groq()
        llm_model = ChatGroq(
            model="llama3-8b-8192",
            api_key=api_key, temperature=0.7
        )
    return llm_model


def get_embeddings_model():
    global embeddings
    if embeddings is None:
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
    return embeddings


def create_or_load_chroma(texts, persist_dir=CHROMA_DB_PATH):
    if os.path.exists(persist_dir):
        db = Chroma(
            persist_directory=persist_dir,
            embedding_function=get_embeddings_model()
        )
    else:
        db = Chroma.from_texts(
            texts, get_embeddings_model(),
            persist_directory=persist_dir
        )
        db.persist()
    return db


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


def extract_or_load_pdf_text(pdf_path, cache_dir=PDF_CACHE_PATH):
    os.makedirs(cache_dir, exist_ok=True)
    cache_file = os.path.join(cache_dir, os.path.basename(pdf_path) + ".txt")

    if os.path.exists(cache_file):
        with open(cache_file, 'r', encoding='utf-8') as f:
            return f.read()
    else:
        text = extract_text_from_pdf(pdf_path)
        with open(cache_file, 'w', encoding='utf-8') as f:
            f.write(text)
        return text


def create_qa_system(past_paper_paths, subject_book_paths):
    all_texts = ""

    for pdf_path in past_paper_paths + subject_book_paths:
        print(pdf_path)
        pdf_text = extract_or_load_pdf_text(pdf_path)
        all_texts += pdf_text + "\n"

    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_text(all_texts)
    embeddings = get_embeddings_model()
    db = create_or_load_chroma(texts)
    llm = get_llm_model()
    qa = RetrievalQA.from_chain_type(
        llm=llm, chain_type="stuff", retriever=db.as_retriever(search_kwargs={"k": 3})
    )
    return qa


def initialize_chain():
    global qa_chain
    global PAPERS_PATH
    global BOOKS_PATH

    if qa_chain is None:
        past_papers = get_pdf_files_from_folder(PAPERS_PATH)
        books = get_pdf_files_from_folder(BOOKS_PATH)
        qa_chain = create_qa_system(past_papers, books)


def generate_question_paper(num_questions):
    global qa_chain

    if qa_chain is None:
        initialize_groq()
        initialize_chain()

    if qa_chain is None:
        raise Exception("QA Chain has not been initialized.")

    questions = []
    for i in range(num_questions):
        prompt = f"Generate a new multiple choice exam which has 10 questions based on the content of the past papers, ensuring it's within the scope of the subject books. The question should be challenging but fair. Format the question in a structured manner suitable for an exam paper, including clear instructions. give mcqs in the form of a,b,c,d options. also space between each question should be at least 2 lines in proper format."
        response = qa_chain.run(prompt)
        questions.append(response)
    return questions


def split_questions(text):
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


def evaluate_mcq_answer(question):
    global qa_chain

    if qa_chain is None:
        initialize_groq()
        initialize_chain()

    if qa_chain is None:
        raise Exception("QA Chain has not been initialized.")

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


def evaluate_mcq_chain(questions):
    evaluation = []
    for question in questions:
        question_id = question["id"]
        response = evaluate_mcq_answer(question)
        result = response.split("\n")
        evaluation.append({
            "question_id": question_id,
            "score": result[0].replace("Score: ", ""),
            "explanation": result[1].replace("Explanation: ", "")
        })

    return evaluation
