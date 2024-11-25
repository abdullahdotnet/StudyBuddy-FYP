/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../services/Utils";
import FormatPaper from "../../components/FormatPaper/FormatPaper";
import { CirclesWithBar } from "react-loader-spinner";

function GeneratedPaper() {
  const [files, setFiles] = useState([]); // Store multiple files
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState("");
  const [uploadedFileNames, setUploadedFileNames] = useState([]); // Store file names
  const [submitting, setSubmitting] = useState(false); // State for submit loading
  const [evaluationResult, setEvaluationResult] = useState(null); // Store evaluation result

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
      const uploadedFiles = Array.from(event.target.files); // Convert to array
      setFiles(uploadedFiles);
      const fileNames = uploadedFiles.map((file) => file.name);
      setUploadedFileNames(fileNames);
      handleSuccess(`${fileNames.length} files uploaded successfully`);
    } catch (err) {
      console.error(err);
      handleError("An error occurred. Please try again.");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setEvaluationResult(null); // Reset the result before submission

    const formData = new FormData();
    formData.append("paper_text", generatedData); // Append paper_text
    files.forEach((file) => {
      formData.append("answer_images", file); // Append each file as answer_images
    });

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/test-session/evaluate-paper/",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        handleSuccess("Paper evaluated successfully!");
        setEvaluationResult(result); // Store the result
      } else {
        handleError("Failed to submit paper for evaluation. Please try again.");
      }
    } catch (err) {
      console.error(err);
      handleError("An error occurred while submitting the paper.");
    } finally {
      setSubmitting(false);
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
          <div className="w-full mb-6">
            <FormatPaper paper={generatedData} />
          </div>

          {/* Buttons Section */}
          <div className="flex justify-center w-full space-x-4"> {/* Use space-x-4 to add spacing */}
            <input
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              multiple // Allow multiple file selection
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-customDarkTeal text-white font-bold py-2 px-4 rounded transition-all hover:bg-customLightTeal hover:text-black w-48" // Fixed width for buttons
            >
              Browse and Upload Papers
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting || files.length === 0}
              className={`bg-customDarkTeal text-white font-bold py-2 px-4 rounded transition-all w-48 ${ // Fixed width for buttons
                submitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-customLightTeal hover:text-black"
              }`}
            >
              {submitting ? "Submitting..." : "Submit for Evaluation"}
            </button>
          </div>

          {/* Uploaded files list with better styling */}
          {uploadedFileNames.length > 0 && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md w-full">
              <h3 className="text-lg font-semibold text-gray-800">Uploaded Files:</h3>
              <ul className="list-disc ml-6 mt-2">
                {uploadedFileNames.map((fileName, index) => (
                  <li key={index} className="text-gray-700">{fileName}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Display evaluation result */}
          {evaluationResult && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Evaluation Result:</h2>
              <div className="space-y-4">
                {evaluationResult.results.map((result, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      Question {result.question_number}
                    </h3>
                    <p className="text-gray-700">{result.evaluation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GeneratedPaper;