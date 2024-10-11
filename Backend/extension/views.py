import os
import uuid
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from .models import UserSpace
import jwt

class FileUploadAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        # Extract user token from headers
        user_token = request.headers.get('Authorization')
        if not user_token:
            return Response({'error': 'Authorization token is missing'}, status=status.HTTP_401_UNAUTHORIZED)

        # Decode the JWT token to get the user ID
        try:
            payload = jwt.decode(user_token.split(' ')[1], settings.SECRET_KEY, algorithms=['HS256'])
            
            user_id = payload['user_id']
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, KeyError):
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if file is in the request
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['file']

        # Check if the file is a PDF
        if file.content_type != 'application/pdf':
            return Response({'error': 'Only PDF files are allowed'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a unique file name and save the file
        unique_id = uuid.uuid4()
        file_name = f"{unique_id}.pdf"
        file_path = os.path.join('userspace', file_name)
        full_file_path = default_storage.save(file_path, file)

        # Save the file path and user ID in the UserSpace model
        UserSpace.objects.create(user_id=user_id, file_path=full_file_path)

        return Response({'status': 'file uploaded', 'file_path': full_file_path}, status=status.HTTP_200_OK)