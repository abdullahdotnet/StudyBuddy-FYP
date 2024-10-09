/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from "../../services/Utils";

function GeneratedPaper() {
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedData, setGeneratedData] = useState(''); 
  const [uploadedFileName, setUploadedFileName] = useState(''); 

  const fileInputRef = useRef(null);
  const { subjectName } = useParams(); 


  const fetchPaper = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/test-session/board-paper-generate/"
      );
      const data = await response.json();

      if (response.ok) {
        setGeneratedData(data.paper.join("\n")); 
      } else {
        handleError("Failed to generate paper. Please try again.");
      }
    } catch (err) {
      console.error(err);
      handleError("An error occurred. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to fetch paper data on component mount
  useEffect(() => {
    fetchPaper();
  }, []);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setUploadedFileName(uploadedFile.name);
    handleSuccess(`File uploaded successfully`);
  };

  return (
    <div className="flex flex-col items-start w-11/12">
      <ToastContainer />
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
        onChange={handleFileUpload}
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
        {uploadedFileName && (
          <p className="ml-4 text-gray-800">Uploaded File: {uploadedFileName}</p>
        )}
      </div>
    </div>
  );
}

export default GeneratedPaper;