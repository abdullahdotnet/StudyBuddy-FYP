from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
import pandas as pd
from dotenv import load_dotenv
from .utils import get_pdf_files_from_folder

# Load environment variables
load_dotenv()
groq_api_key = os.getenv('GROQ_API_KEY')
if not groq_api_key:
    raise ValueError("GROQ API key not found in .env file")

os.environ["GROQ_API_KEY"] = groq_api_key
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Function to load all CSV files from input_data folder
def load_data_from_files(folder_path):
    csv_files = [f for f in os.listdir(folder_path) if f.endswith('.csv')]
    all_data = pd.DataFrame()
    
    # Load each CSV file and concatenate
    for file in csv_files:
        file_path = os.path.join(folder_path, file)
        paper_data = pd.read_csv(file_path)
        all_data = pd.concat([all_data, paper_data], ignore_index=True)
        all_data = all_data.dropna()
    return all_data

class GenerateQuestionPaperAPIView(APIView):

    def get(self, request):
        try:
            # Define the number of questions for each subject
            subjects_questions = {
                "Biology": 68,
                "Chemistry": 54,
                "Physics": 54,
                "English": 18,
                "Logical Reasoning": 6
            }

            # Load all data from input_data folder
            data_folder = os.path.join(BASE_DIR, 'entrytest/input_data')
            data = load_data_from_files(data_folder)
            
            # Sample questions for each subject
            biology_questions = data[data['Subject'] == 'Biology'].sample(n=subjects_questions["Biology"])
            chemistry_questions = data[data['Subject'] == 'Chemistry'].sample(n=subjects_questions["Chemistry"])
            physics_questions = data[data['Subject'] == 'Physics'].sample(n=subjects_questions["Physics"])
            english_questions = data[data['Subject'] == 'English'].sample(n=subjects_questions["English"])
            logical_reasoning_questions = data[data['Subject'] == 'Logical Reasoning'].sample(n=subjects_questions["Logical Reasoning"])
            # Combine the sampled questions while maintaining subject order
            combined_questions = pd.concat([
                biology_questions, chemistry_questions, 
                physics_questions, english_questions, 
                logical_reasoning_questions
            ])
            # Assign sequential IDs to the questions
            combined_questions['ID'] = range(1, len(combined_questions) + 1)
            # Convert to a list of dictionaries for the response
            mcq_paper = []
            answer_map = {
                    'A': 0,
                    'B': 1,
                    'C': 2,
                    'D': 3
                }
            for _, item in combined_questions.iterrows():
                mcq_paper.append({
                    "id": item['ID'],
                    "question": item['Question'],
                    "options": [
                        item['Option 1'],
                        item['Option 2'],
                        item['Option 3'],
                        item['Option 4']
                    ],
                    "subject": item['Subject'],
                    "answer": answer_map[item['Answers']],
                })

            return Response({"mcq_paper": mcq_paper}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
