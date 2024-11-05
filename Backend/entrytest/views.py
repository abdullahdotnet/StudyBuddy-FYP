from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
import pandas as pd
import json
import math
from dotenv import load_dotenv
from .utils import generate_mcqs

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

    import os
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class GenerateQuestionPaperAPIView(APIView):

    def get(self, request):
        try:
            # Define the number of questions for each subject
            subjects_questions = {
                "Biology": 63,
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
            
            # Get new Biology MCQs as a list of JSON strings
            selected_biology_questions = biology_questions.sample(n=5).reset_index(drop=True)
            new_biology_mcqs = generate_mcqs("Biology", selected_biology_questions)  # This returns a list of JSON strings
            print("=="*10)
            print("New Biology MCQs:", new_biology_mcqs)

            # Parse the JSON strings and replace the selected rows in the biology_questions DataFrame
            for i in range(5):
                # Parse the JSON string into a dictionary
                new_mcq = json.loads(new_biology_mcqs[i])
                print(f"New MCQ generated{i}", '='*10)
                print(new_mcq)
                # Ensure proper column-wise replacement
                biology_questions.at[selected_biology_questions.index[i], 'Question'] = new_mcq['question']
                biology_questions.at[selected_biology_questions.index[i], 'Option 1'] = new_mcq['options'][0]
                biology_questions.at[selected_biology_questions.index[i], 'Option 2'] = new_mcq['options'][1]
                biology_questions.at[selected_biology_questions.index[i], 'Option 3'] = new_mcq['options'][2]
                biology_questions.at[selected_biology_questions.index[i], 'Option 4'] = new_mcq['options'][3]
                biology_questions.at[selected_biology_questions.index[i], 'Answers'] = new_mcq['answer']
            print("Outside 01","=="*10)
            # Combine the modified biology questions with other subjects
            combined_questions = pd.concat([
                biology_questions, chemistry_questions, 
                physics_questions, english_questions, 
                logical_reasoning_questions
            ])
            print("Outside 02","=="*10)
            
            # Assign sequential IDs to the questions
            combined_questions['ID'] = range(1, len(combined_questions) + 1)
            print("Outside 03","=="*10)
            # Convert to a list of dictionaries for the response
            mcq_paper = []
            answer_map = {
                'A': 0,
                'B': 1,
                'C': 2,
                'D': 3
            }
            print("Combined Questions","=="*10)
            print(len(combined_questions))
            
            for idx, item in combined_questions.iterrows():
                # Check if the question was generated
                print(f"Outside 04 {idx}","=="*10)
                print(item)
                generated_flag = 1 if item['Subject'] == "Biology" and idx in selected_biology_questions.index else 0
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
                    "generated": generated_flag  # Add the generated flag
                })
            # Replace NaN values in 'subject' with an empty string
            for mcq in mcq_paper:
                if isinstance(mcq.get('subject'), float) and math.isnan(mcq['subject']):
                    mcq['subject'] = ''
            print("Combined Questions","=="*10)
            print(mcq_paper)

            return Response({"mcq_paper": mcq_paper}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)