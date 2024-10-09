# views.py
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .utils import generate_question_paper, initialize_chain
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import os
import tempfile
# Initialize the chain when the server starts
initialize_chain()

class BoardPaperGenerationView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Directly use the initialized chain to generate the paper
            paper = generate_question_paper(num_questions=1)  # Adjust the number of questions if needed
            data = {
                "message": "Hello, Your paper has been generated.!",
                "paper": paper
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BoardPaperEvaluation(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file', None)

        if file is None or not file.name.endswith('.pdf'):
            return Response({'error': 'Please upload a valid PDF file.'}, status=status.HTTP_400_BAD_REQUEST)

        # Save the uploaded file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            for chunk in file.chunks():
                temp_pdf.write(chunk)
            temp_pdf_path = temp_pdf.name
            print(temp_pdf_path)
        try:
            # POPPLER_PATH = 'E:\\University\\Release-24.08.0-0\\poppler-24.08.0\\Library\\bin'  # Change this to the actual path of poppler's bin folder
            # Convert PDF pages to images
            images = convert_from_path(temp_pdf_path)
            print(images)
            # Extract text from each image using pytesseract
            extracted_text = ""
            for image in images:
                extracted_text += pytesseract.image_to_string(image)
            print(extracted_text)
            # Cleanup the temp file
            os.remove(temp_pdf_path)

            return Response({'extracted_text': extracted_text}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)