from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .utils import main

class BoardPaperGenerationView(APIView):
    def get(self, request, *args, **kwargs):
        paper = main()  # List of questions
        data = {
            "message": "Hello, Your paper has been generated.!",
            "paper": paper
        }
        return Response(data, status=status.HTTP_200_OK)