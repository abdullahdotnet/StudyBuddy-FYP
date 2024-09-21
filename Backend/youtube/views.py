import requests
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .utils import transcribe, generate_pdf
from .serializers import ImageDataSerializer


class ImageDataView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ImageDataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class YoutubeSummaryView(APIView):
    CHATBOT_URL = 'http://localhost:8000/api/chatbot/'

    def post(self, request, *args, **kwargs):
        youtube_url = request.data.get('youtube_url')

        if not youtube_url:
            return Response(
                {'youtube_url': ['This field is required.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            transcription, video_id = transcribe(youtube_url)
            summarization = self._get_summarization(transcription)

            path = f'./media/pdfs/{video_id}.pdf'
            pdf = generate_pdf(youtube_url, summarization, filename=path)

            return JsonResponse(
                {
                    'message': 'YouTube summary generated successfully.',
                    'pdf_path': f'/Backend/media/pdfs/{video_id}.pdf',
                    'youtube_url': youtube_url,
                    'summarization': summarization,
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _get_summarization(self, transcription):
        response = requests.post(
            url=self.CHATBOT_URL,
            json={
                'query': f'Generate summarization for the provided transcription in headings and paragraphs: {transcription}'
            }
        )

        if response.status_code == status.HTTP_200_OK:
            return response.json().get('response')

        return Response(
            {'error': 'Failed to generate summarization'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
