// src/pages/Board/PaperTypeSelection.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PaperTypeSelection = () => {
  const navigate = useNavigate();
  const { classId, subjectId } = useParams();

  const handlePaperTypeSelect = (type) => {
    if (type === 'objective') {
      navigate('/papergen/mcqs');
    } else {
      navigate(`/board/${classId}/subject/${subjectId}/subjective`);
    }
  };

  const getSubjectName = (id) => {
    const subjects = {
      '1': 'Biology',
      '2': 'Computer Science',
      '3': 'Physics',
      '4': 'English'
    };
    return subjects[id] || '';
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-#212529">
          Select Paper Type
        </h1>
        <p className="text-center mb-8 text-#212529">
          {getSubjectName(subjectId)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handlePaperTypeSelect('objective')}
            className="bg-white text-customTextDark 
                     font-semibold py-6 px-8 rounded-lg shadow-md 
                     transition-colors duration-300 transform hover:scale-105
                     border-2"
          >
            Objective Paper
          </button>
          <button
            onClick={() => handlePaperTypeSelect('subjective')}
            className="bg-white  text-customTextDark
                     font-semibold py-6 px-8 rounded-lg shadow-md 
                     transition-colors duration-300 transform hover:scale-105
                     border-2"
          >
            Subjective Paper
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaperTypeSelection;