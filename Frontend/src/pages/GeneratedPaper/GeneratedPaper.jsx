/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../services/Utils";
import FormatPaper from "../../components/FormatPaper/FormatPaper";
import { CirclesWithBar } from "react-loader-spinner";

function GeneratedPaper() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const fileInputRef = useRef(null);
  const { subjectName } = useParams();

  const fetchPaper = async () => {
    setLoading(true);

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

  useEffect(() => {
    fetchPaper();
  }, []);

  const handleFileUpload = (event) => {
    try {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    console.log(file);
    setUploadedFileName(uploadedFile.name);
    handleSuccess(`File uploaded successfully`);
    }
    catch (err) {
      console.error(err);
      handleError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-start w-11/12">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Generated Paper for {subjectName}
      </h1>

      {loading ? (
        <div className="flex justify-center w-full mb-6">
          <CirclesWithBar
            height="100"
            width="100"
            color="#4fa94d"
            outerCircleColor="#05EAA7"
            innerCircleColor="#FF703C"
            barColor="#FF703C"
            ariaLabel="circles-with-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <div>
          <div className="w-full text-justify mb-6">
            <FormatPaper paper={generatedData} />
          </div>
          <div className="flex justify-center w-full">
            <input
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-customDarkTeal text-white font-bold py-2 px-4 rounded transition-all hover:bg-customLightTeal hover:text-black"
            >
              Browse and Upload Paper
            </button>
            {uploadedFileName && (
              <p className="ml-4 text-gray-800 mt-2">
                Uploaded File: {uploadedFileName}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneratedPaper;