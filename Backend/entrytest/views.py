from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
from dotenv import load_dotenv
from .utils import (
    get_pdf_files_from_folder, create_qa_system, 
    generate_question_paper, create_reformatted_question_paper_pdf
)

# Load environment variables
load_dotenv()
groq_api_key = os.getenv('GROQ_API_KEY')
if not groq_api_key:
    raise ValueError("GROQ API key not found in .env file")

os.environ["GROQ_API_KEY"] = groq_api_key

class GenerateQuestionPaperAPIView(APIView):
    """
    APIView to generate a question paper from past papers.
    """

    def get(self, request):
        num_questions = request.query_params.get('num_questions')
        num_questions = int(num_questions)  # Ensure it's an integer
        past_paper_folder = "mcqs_input_pdfs"
        subject_book_paths = []  # Add subject book paths if needed

        past_paper_paths = get_pdf_files_from_folder(past_paper_folder)
        if not past_paper_paths:
            return Response(
                {"error": "No past papers found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            qa_system = create_qa_system(past_paper_paths, subject_book_paths)
            questions = generate_question_paper(qa_system, num_questions)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        output_pdf_path = "mcqs_generation_pdfs/multiple_choice_questions.pdf"
        create_reformatted_question_paper_pdf(questions, output_pdf_path)

        return Response(
            {
                "message": "Question paper generated successfully.",
                "output_pdf_path": output_pdf_path,
                "num_past_papers": len(past_paper_paths),
            },
            status=status.HTTP_200_OK
        )
