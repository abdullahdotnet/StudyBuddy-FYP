// src/pages/Board/SubjectSelection.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SubjectSelection = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  const subjects = [
    { id: 1, name: 'Biology', icon: '🧬' },
    { id: 2, name: 'Computer Science', icon: '💻' },
    { id: 3, name: 'Physics', icon: '⚡' },
    { id: 4, name: 'English', icon: '📚' }
  ];

  const handleSubjectSelect = (subjectId) => {
    navigate(`/board/${classId}/subject/${subjectId}/paper-type`);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-#212529">
          Select Subject
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => handleSubjectSelect(subject.id)}
              className="bg-white text-customTextDark 
                       font-semibold py-6 px-8 rounded-lg shadow-md 
                       transition-colors duration-300 transform hover:scale-105
                       border-2"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">{subject.icon}</span>
                <span>{subject.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;