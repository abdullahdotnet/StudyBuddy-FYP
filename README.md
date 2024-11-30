# StudyBuddy

**StudyBuddy** is an innovative platform designed to simplify and enrich the student learning experience. From exam preparation to interactive learning tools, StudyBuddy provides a comprehensive suite of features tailored for students preparing for entrance tests, board exams, and regular coursework.  

## 🌟 Features  

### 1. **Entrance Test Exam Preparation**  
- Focuses on **MDCAT**, **ECAT**, and other competitive entrance exams.  
- Key Features:  
  - A collection of **past papers** for practice.  
  - **Personalized feedback** to identify strengths and weaknesses.  
  - **Recommendations** for targeted improvement.  

### 2. **YouTube Video Extension**  
- Makes learning from YouTube videos more effective with tools like:  
  - **Screenshots** and **timestamped notes** while watching.  
  - AI-powered **video summaries** for quick revision.  
  - A **chatbot** that answers questions about the video content.  
  - Generate and download a **PDF** containing:  
    - Notes  
    - Snapshots  
    - Summaries  
    - Video timestamps for easy navigation.  

### 3. **AI-Powered Chatbot**  
- Designed to resolve student queries with precision.  
- Covers **pre-loaded textbook content** for:  
  - **9th-12th grades**, including Punjab Board and O/A Levels.  

### 4. **Board Exam Preparation**  
- Provides focused guidance and resources for board exams.  
- Helps students understand key concepts, solve exam-oriented questions, and track their progress.  

### 5. **Engagement Features**  
- A dedicated **community option** for:  
  - Peer-to-peer learning.  
  - Sharing study tips and experiences.  
  - Seeking assistance on challenging topics.  

### 6. **Additional Tools**  
- **To-Do List**: Stay organized and manage tasks effectively.  
- **Personal Data Space**: A secure place to store and manage study-related content.  

## 🛠️ Technology Stack  

- **Backend**: Django  
- **Databases**:  
  - **MySQL** for the main server-side storage.  
  - **IndexedDB** for client-side, browser-based storage.  
- **AI and NLP Technologies**:  
  - **LangChain**: Framework for managing workflows and integrating AI components.  
  - **RAG (Retrieval-Augmented Generation)**: Combines retrieved knowledge with AI outputs for accurate responses.  
  - **HuggingFace Embeddings**: Enhances text representation and semantic understanding.  
  - **LLMs with Groq**: Powers querying, summarization, and feedback with optimized performance.  

## 🚀 Installation  

### Prerequisites  
- **Python 3.9+** and **Django** installed.  
- A browser supporting **Chrome Extensions**.  

### Steps  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/YourUsername/StudyBuddy.git  
   cd StudyBuddy  
   ```  
2. Set up the backend:  
   ```bash
   cd Backend
   pip install -r requirements.txt  
   python manage.py migrate  
   python manage.py runserver  
   ```
3. Set up frontend:
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```
4. Install the Chrome extension:  
   - Navigate to `chrome://extensions`.  
   - Enable "Developer mode."  
   - Click "Load unpacked" and select the `Extension` folder.
     
## 📄 License  

The StudyBuddy platform, including its codebase and content, is protected under a restrictive license.  

**Prohibited Actions:**  
1. Copying, modifying, or redistributing the code or content without explicit written permission.  
2. Using this project for commercial purposes without authorization.  
3. Claiming this project or its derivatives as your own.  

For further details, please see the [LICENSE](LICENSE) file.  

## 👥 Developers and Supervisors  

This platform was developed by a dedicated team of five developers under the guidance of two supervisors.  

### Developers  

| Name                      | GitHub Profile                           | LinkedIn Profile                                                   |  
|---------------------------|-------------------------------------------|---------------------------------------------------------------------|  
| **Muhammad Zubair**       | <a href="https://github.com/zubayr-ahmad"><img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white" /></a> | <a href="https://linkedin.com/in/zubayr-ahmad"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" /></a> |  
| **Muhammad Abdullah Ghazi** | <a href="https://github.com/abdullahdotnet"><img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white" /></a> | <a href="https://linkedin.com/in/abdullahdotnet20"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" /></a> |  
| **Anas Tahir**            | <a href="https://github.com/ANAS-TAAHIR"><img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white" /></a> | <a href="https://linkedin.com/in/anas-waleed-tahir-9a5b78214"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" /></a> |  
| **Etisam Ul Haq**         | <a href="https://github.com/etisamulhaq"><img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white" /></a> | <a href="https://linkedin.com/in/etisamhaq"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" /></a> |  
| **Abdullah Ashfaq**       | <a href="https://github.com/abdullahashfaq-ds"><img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white" /></a> | <a href="https://linkedin.com/in/abdullahashfaqvirk"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" /></a> |  

### Supervisors  

| Name                      | LinkedIn Profile                                                   |  
|---------------------------|---------------------------------------------------------------------|  
| **Dr. Kamran Malik**      | <a href="https://linkedin.com/in/muhammad-kamran-malik"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" /></a> |  
| **Dr. Waheed Iqbal**      | <a href="https://linkedin.com/in/waheediqbal751"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" /></a> |  

## 🧑‍💻 Contact  

For queries or issues, feel free to open an issue in this repository.  
