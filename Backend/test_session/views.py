from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .utils import generate_question_paper
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
import pytesseract
import logging
import gc
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
import cv2


import logging

logger = logging.getLogger(__name__)

class BoardPaperGenerationView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            paper = generate_question_paper(num_questions=1)
            return Response({
                "message": "Paper generated successfully!",
                "paper": paper
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error generating paper: {str(e)}")
            return Response(
                {"error": "Failed to generate paper"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



# # Set up logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# class BoardPaperEvaluation(APIView):
#     parser_classes = (MultiPartParser, FormParser)

#     def post(self, request):
#         question_paper_text = request.data.get('paper_text')
#         if not question_paper_text:
#             return Response({'error': 'Question paper text is required'}, status=400)
        
#         # Save images from the request to temporary storage
#         answer_images = request.FILES.getlist('answer_images')
#         if not answer_images:
#             return Response({'error': 'Answer images are required'}, status=400)

#         # Create QA system from the question paper text
#         try:
#             qa_system = self.create_qa_system(question_paper_text)
#         except Exception as e:
#             logging.error(f"Error creating QA system: {e}")
#             return Response({'error': 'Failed to create QA system'}, status=500)

#         results = []
#         for question_number, image in enumerate(answer_images, start=1):
#             image_path = default_storage.save(f"temp/{image.name}", image)
#             image_full_path = default_storage.path(image_path)
            
#             student_answer_text = self.extract_text_from_image(image_full_path)
#             if student_answer_text:
#                 evaluation = self.evaluate_answer(qa_system, question_number, student_answer_text)
#                 results.append({
#                     "question_number": question_number,
#                     "evaluation": evaluation
#                 })
#             else:
#                 results.append({
#                     "question_number": question_number,
#                     "error": "Could not extract text from image"
#                 })

#             # Clean up temporary image file
#             default_storage.delete(image_path)

#             # Clear some memory after each iteration
#             gc.collect()

#         return Response({"results": results})

#     def create_qa_system(self, question_paper_text):
#         # Split the question paper into chunks for embeddings
#         text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
#         texts = text_splitter.split_text(question_paper_text)
#         # Load embeddings using Hugging Face's model
#         embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
#         db = Chroma.from_texts(texts, embeddings)

#         # Set up the language model (ChatGroq)
#         llm = ChatGroq(
#             model="llama3-8b-8192",
#             temperature=0.2,
#             max_tokens=1000,
#         )

#         # Create a RetrievalQA chain using the language model and embeddings
#         qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=db.as_retriever(search_kwargs={"k": 2}))
#         return qa

#     def extract_text_from_image(self, image_path):
#         """ Extract text from an image using pytesseract after preprocessing """
#         try:
#             image = cv2.imread(image_path)
#             gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#             denoised = cv2.fastNlMeansDenoising(gray)
#             threshold = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
#             text = pytesseract.image_to_string(threshold)
#             return text
#         except Exception as e:
#             logging.error(f"Error extracting text from image: {e}")
#             return ""

#     def evaluate_answer(self, qa_system, question_number, student_answer):
#         """ Evaluate the student's answer using the QA system """
#         prompt = f"""
#         Referring to Question {question_number} in the question paper:

#         Student's Answer: {student_answer}

#         Evaluate the student's answer based on these criteria:
#         1. Correctness
#         2. Completeness 
#         3. Clarity 
#         4. Relevance 

#         Provide a brief evaluation for each criterion with points.
#         Sum the points for an overall score out of 10.
#         Give a short paragraph of constructive feedback.

#         Limit your response to 200 words.
#         """
#         try:
#             evaluation = qa_system.run(prompt)
#             return evaluation
#         except Exception as e:
#             logging.error(f"Error during evaluation: {e}")
#             return "Error occurred during evaluation."