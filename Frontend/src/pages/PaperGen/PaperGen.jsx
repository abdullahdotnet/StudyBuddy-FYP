import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PaperGen = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { grade } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/board/subjects/?grade=${grade}`);
        setSubjects(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load subjects.');
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [grade]);

  const handleGeneratePaper = (subject) => {
    navigate(`/board/objective/${grade}/${subject}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Board Paper Generation</h1>
      <div className="flex flex-col w-11/12 rounded-lg border-2 border-solid border-slate-300">
        {subjects.map((subject, index) => (
          <div
            key={subject.id}
            className={`flex justify-between mb-0 p-2 align-middle ${index < subjects.length - 1 ? 'border-b-2 border-solid border-slate-300' : ''}`}
          >
            <span className="text-lg font-medium mt-1 ml-1">{subject.name}</span>
            <button
              onClick={() => handleGeneratePaper(subject.name.replace(/\s+/g, '-').toLowerCase())}
              className="bg-customDarkOrange text-white font-bold py-2 px-4 rounded transition-all hover:bg-customLightOrange hover:text-black"
            >
              Full Book Paper
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperGen;
