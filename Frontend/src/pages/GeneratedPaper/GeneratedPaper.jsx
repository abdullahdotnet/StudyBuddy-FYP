/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

function GeneratedPaper() {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedData, setGeneratedData] = useState(''); // State to store fetched data

  const fileInputRef = useRef(null);
  const { subjectName } = useParams(); // Get the subject name from the URL

  const fetchPaper = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/test-session/board-paper-generate/"
      );
      const data = await response.json();

      if (response.ok) {
        setGeneratedData(data.paper.join("\n")); // Store the generated paper data
      } else {
        setError("Failed to generate paper. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to fetch paper data on component mount
  useEffect(() => {
    fetchPaper();
  }, []);

  return (
    <div className="flex flex-col items-start w-11/12">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Generated Paper for {subjectName}
      </h1>

      <div className="w-full text-justify mb-6">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <p className="font-medium">{generatedData || "No data generated yet."}</p>
        )}
      </div>

      {/* File upload part */}
      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png"
        onChange={(event) => {
          setFile(event.target.files[0]);
          setSuccessMessage("File Uploaded Successfully");
          setErrorMessage('');
        }}
        ref={fileInputRef}
        className="hidden"
      />
      <div className="flex justify-center w-full">
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-customDarkTeal text-white font-bold py-2 px-4 rounded transition-all hover:bg-customLightTeal hover:text-black"
        >
          Browse and Upload Paper
        </button>
      </div>

      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}

    </div>
  );
}

export default GeneratedPaper;