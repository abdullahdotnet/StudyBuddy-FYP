import React, { useState } from "react";
import { Link } from "react-router-dom";

const PaperGen = () => {
  const subjects = [
    { id: 1, name: "Computer Science" },
    // { id: 2, name: 'Mathematics' },
    // { id: 3, name: 'Chemistry' },
    // { id: 4, name: 'Physics' },
    // { id: 5, name: 'Biology' },
  ];

  // State to store the generated paper
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle API call
  const handleGeneratePaper = async (subjectName) => {
    setLoading(true);
    setError(null);
    setGeneratedPaper(null); // Reset previous paper

    try {
      const response = await fetch("http://127.0.0.1:8000/api/test-session/board-paper-generate/");
      const data = await response.json();

      if (response.ok) {
        setGeneratedPaper(data.paper.join("\n")); // Storing paper in state
      } else {
        setError("Failed to generate paper. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Paper Generator</h1>
        <div className="flex flex-col">
          {subjects.map((subject) => (
            <div key={subject.id} className="flex justify-between mb-4 me-5">
              <span className="text-lg">{subject.name}</span>
              <button
                onClick={() => handleGeneratePaper(subject.name)}
                className="bg-customDarkOrange text-white font-bold py-2 px-4 rounded transition-all hover:bg-customLightOrange hover:text-black"
              >
                Generate Paper
              </button>
            </div>
          ))}
        </div>

        {/* Display the generated paper */}
        <div className="mt-6">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {generatedPaper && (
            <div className="border p-4 rounded bg-gray-100">
              <h2 className="text-2xl font-semibold mb-4">Generated Paper:</h2>
              <pre className="whitespace-pre-wrap">{generatedPaper}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaperGen;

