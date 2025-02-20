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
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma    
from langchain_community.embeddings import HuggingFaceEmbeddings      # for embeddings
from langchain.text_splitter import CharacterTextSplitter
from django.http import StreamingHttpResponse   # for streaming response
import json




# Load environment variables and initialize Groq client
dotenv.load_dotenv()
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

EMBEDDING_MODEL = HuggingFaceEmbeddings()
LLM = ChatGroq(
    model="llama-3.1-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.2,
    streaming=True
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
        transcription = request.data.get('transcription')

        # Check if youtube_url and transcription are provided
        if not youtube_url:
            return Response(
                {'youtube_url': ['This field is required.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not transcription:
            return Response(
                {'transcription': ['This field is required.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Generate summarization with Groq
            summarization = self._get_summarization(transcription)
            print(summarization)
            bullets = self._get_summary_bullets(summarization)
            print(">>" * 10)
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
                # model="llama-3.1-70b-versatile",
                model="llama3-8b-8192",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {
                        "role": "user",
                        "content": f"Summarize the following transcription of video such that the user gets the full story of the video. Don't write any starting line just start providing the summary of the video. Transcription: {transcription}"
                    }
                ],
                temperature=0.2,
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
                model="llama3-8b-8192",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {
                        "role": "user",
                        "content": f"Write 4 to 5 key take aways from the following context in the form of bullets.: {summarization}"
                    }
                ],
                temperature=0.1,
                # max_tokens=1024,
                top_p=1,
                stream=False
            )
            # Extract the summary text from the response
            return chat_completion.choices[0].message.content
        
        except Exception as e:
            print(f"Error generating summary with Groq: {e}")
            return "Failed to generate summary."


class YoutubeChatView(APIView):
    def post(self, request, *args, **kwargs):
        youtube_url = request.data.get('youtube_url')
        user_query = request.data.get('query')

        if not youtube_url or not user_query:
            return Response(
                {
                    'youtube_url': ['This field is required.'],
                    'query': ['This field is required.']
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            transcription, video_id = transcribe(youtube_url)
            embeddings_path = f'./youtube/embeddings/{video_id}_embeddings'

            if not os.path.exists(embeddings_path):
                text_splitter = CharacterTextSplitter(
                    chunk_size=150, chunk_overlap=20
                )
                chunks = text_splitter.split_text(transcription)
                db = Chroma.from_texts(
                    chunks, EMBEDDING_MODEL, persist_directory=embeddings_path
                )
                db.persist()
            else:
                db = Chroma(
                    persist_directory=embeddings_path,
                    embedding_function=EMBEDDING_MODEL
                )

            retriever = db.as_retriever(search_kwargs={"k": 3})
            qa = RetrievalQA.from_chain_type(
                llm=LLM, chain_type="stuff", retriever=retriever
            )

            request.session['transcription'] = transcription
            request.session['query'] = user_query
            return Response(
                {"message": "Data processed. Start streaming."},
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            print(f"Error during chat processing: {e}")
            return Response(
                {"error": "Failed to process chat."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )




class YoutubeChatView(APIView):
    def post(self, request, *args, **kwargs):
        youtube_url = request.data.get('youtube_url')
        user_query = request.data.get('query')

        if not youtube_url or not user_query:
            return Response(
                {
                    'youtube_url': ['This field is required.'],
                    'query': ['This field is required.']
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        def generate_response():
            try:
                # Transcription and embedding logic remains the same
                transcription, video_id = transcribe(youtube_url)
                embeddings_path = f'./youtube/embeddings/{video_id}_embeddings'

                if not os.path.exists(embeddings_path):
                    text_splitter = CharacterTextSplitter(
                        chunk_size=150, chunk_overlap=20
                    )
                    chunks = text_splitter.split_text(transcription)
                    db = Chroma.from_texts(
                        chunks, EMBEDDING_MODEL, persist_directory=embeddings_path
                    )
                    db.persist()
                else:
                    db = Chroma(
                        persist_directory=embeddings_path,
                        embedding_function=EMBEDDING_MODEL
                    )

                retriever = db.as_retriever(search_kwargs={"k": 3})
                
                # Use streaming LLM for token-by-token response
                prompt = f"""Provide a concise answer to the user's question (50-60 words max) based on the video content. 
                Ensure the response is contextually accurate. 
                If the user engages in greetings or casual chat unrelated to the video, respond in a professional tone.

                User Query: {user_query}
                Video Transcription: {transcription}
                """
                
                # Stream tokens
                for chunk in LLM.stream(prompt):
                    if chunk.content:
                        print(f"data: {chunk.content}",end=", ")
                        print(len(chunk.content))
                        yield f"data: {chunk.content} \n\n"
                
                yield "data: [DONE]\n\n"

            except Exception as e:
                print(f"Error during chat processing: {e}")
                yield f"data: Error: {str(e)}\n\n"

        return StreamingHttpResponse(generate_response(), content_type='text/event-stream')