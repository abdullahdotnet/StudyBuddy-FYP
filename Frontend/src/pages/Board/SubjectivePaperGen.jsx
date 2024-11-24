// src/pages/Board/SubjectivePaperGen.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SubjectivePaperGen = () => {
  const navigate = useNavigate();
  const { classId, subjectId } = useParams();

  const getSubjectName = (id) => {
    const subjects = {
      '1': 'Biology',
      '2': 'Computer Science',
      '3': 'Physics',
      '4': 'English'
    };
    return subjects[id] || '';
  };

  const handleGeneratePaper = () => {
    const subjectName = getSubjectName(subjectId);
    navigate(`/generated-paper/${subjectName}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Subjective Paper
        </h1>
        <p className="text-center mb-6 text-gray-600">
          {getSubjectName(subjectId)} - Class {classId}
        </p>

        <button
          onClick={handleGeneratePaper}
          className="w-full bg-blue-500 hover:bg-blue-600 text-gray-800 hover:text-white
                   font-bold py-4 px-8 rounded-lg shadow-md 
                   transition-all duration-300 transform hover:scale-105
                   border-2 border-[#FFCBA4]"
        >
          Generate Paper
        </button>
      </div>
    </div>
  );
};

export default SubjectivePaperGen;