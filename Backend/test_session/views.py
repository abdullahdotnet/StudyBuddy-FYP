# views.py
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .utils import generate_question_paper, initialize_chain

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

