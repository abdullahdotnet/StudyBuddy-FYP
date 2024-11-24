// src/pages/Board/ClassSelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClassSelection = () => {
  const navigate = useNavigate();
  
  const classes = [
    { id: 1, name: '9th Class' },
    { id: 2, name: '10th Class' },
    { id: 3, name: '11th Class' },
    { id: 4, name: '12th Class' }
  ];

  const handleClassSelect = (classId) => {
    navigate(`/board/${classId}/subjects`);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-#212529">
          Select Your Class
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((classItem) => (
            <button
              key={classItem.id}
              onClick={() => handleClassSelect(classItem.id)}
              className="bg-white hover:bg-customLightBlue text-customTextDark 
                         font-semibold py-6 px-8 rounded-lg shadow-md 
                         transition-colors duration-300 transform hover:scale-105
                         border-2"
            >
              {classItem.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassSelection;