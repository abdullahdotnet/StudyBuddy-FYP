OBJECTIVE_PROMPT = """
Generate a new multiple choice exam which has 10 questions based on the content of the past papers, 
ensuring it's within the scope of the subject books. The questions should be challenging but fair. 
Format the questions in a structured manner suitable for an exam paper, including clear instructions. 
Give MCQs in the form of a, b, c, d options. 
Also, space between each question should be at least 2 lines in proper format.
"""

SUBJECTIVE_PROMPT = """
Generate a new subjective question paper based on the contents of the past papers, 
ensuring it's within the scope of the subject books. There should be two sections in the paper. 
In the first section, there are three parts of short questions, and in each part of short questions, 
there are six short questions. Then in the second section, there are three long questions. 
The questions should be challenging but fair. 
Format the questions in a structured manner suitable for an exam paper. 
Also, space between each question should be at least 2 lines. Do not repeat the questions.

The output must be in following format and don't change this format a bit.

**Section A:**

Part 1:
1. <question no 1>
2. <question no 2>
...

Part 2:
...

Part 3:
...

**Section B:**

1. <question no 1>
2. <question no 2>
3. <question no 3>

"""
