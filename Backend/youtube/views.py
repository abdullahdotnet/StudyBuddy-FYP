import requests
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .utils import transcribe, generate_pdf
from .serializers import ImageDataSerializer
from groq import Groq
import dotenv
import os

# Load environment variables and initialize Groq client
dotenv.load_dotenv()
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

class ImageDataView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ImageDataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class YoutubeSummaryView(APIView):
    def post(self, request, *args, **kwargs):
        youtube_url = request.data.get('youtube_url')

        if not youtube_url:
            return Response(
                {'youtube_url': ['This field is required.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Transcribe the YouTube video
            transcription, video_id = transcribe(youtube_url)
            
            # Generate summarization with Groq
            summarization = self._get_summarization(transcription)
            print(summarization)
            bullets = self._get_summary_bullets(summarization)
            print(">>"*10)
            print(bullets)
            # Generate PDF with summary
            # path = f'./media/pdfs/{video_id}.pdf'
            # pdf = generate_pdf(youtube_url, summarization, filename=path)

            return JsonResponse(
                {
                    'message': 'YouTube summary generated successfully.',
                    # 'pdf_path': f'/Backend/media/pdfs/{video_id}.pdf',
                    'youtube_url': youtube_url,
                    'summary': summarization,
                    'bullets': bullets
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _get_summarization(self, transcription):
        # Use Groq to create a chat completion request
        try:
            chat_completion = client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {
                        "role": "user",
                        "content": f"Summarize the following transcription of video: {transcription}"
                    }
                ],
                temperature=0.5,
                # max_tokens=1024,
                top_p=1,
                stream=False
            )
            # Extract the summary text from the response
            return chat_completion.choices[0].message.content
        
        except Exception as e:
            print(f"Error generating summary with Groq: {e}")
            return "Failed to generate summary."
        
    def _get_summary_bullets(self, summarization):
        try:
            chat_completion = client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {
                        "role": "user",
                        "content": f"Write 3 to 5 bullet points summarizing the following text: {summarization}"
                    }
                ],
                temperature=0.5,
                # max_tokens=1024,
                top_p=1,
                stream=False
            )
            # Extract the summary text from the response
            return chat_completion.choices[0].message.content
        
        except Exception as e:
            print(f"Error generating summary with Groq: {e}")
            return "Failed to generate summary."

