import React, { useState } from 'react';

function GeneratedPaper() {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  // Handle file upload
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    const fileSizeLimit = 10 * 1024 * 1024; // 10 MB file size limit

    // Validate file type and size
    if (!uploadedFile) {
      setErrorMessage('Please select a file.');
      setSuccessMessage('');
      return;
    }

    const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedFileTypes.includes(uploadedFile.type)) {
      setErrorMessage('Only PDF and image files (JPG, PNG) are allowed.');
      setSuccessMessage('');
      return;
    }

    if (uploadedFile.size > fileSizeLimit) {
      setErrorMessage('File size exceeds the 10MB limit.');
      setSuccessMessage('');
      return;
    }

    // Clear errors and update the selected file
    setErrorMessage('');
    setFile(uploadedFile);
    setSuccessMessage(''); // Clear previous success message
  };

  // Handle form submission or any additional logic with the file
  const handleUploadClick = () => {
    if (!file) {
      setErrorMessage('No file uploaded. Please upload a file first.');
      setSuccessMessage('');
      return;
    }

    // Simulate file upload process
    console.log('Uploaded file:', file);

    // Display success message after upload
    setSuccessMessage('Document is uploaded successfully!');
    setErrorMessage(''); // Clear any error message
    setFile(null); // Clear the file after processing
  };

  return (
    <div className="flex flex-col items-start">
      {/* Left-aligned heading */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Generated Paper for Computer Science
      </h1>

      {/* Container for the content */}
      <div className="max-w-3xl text-justify mb-6">
        <p>
          Content will be shown here. This is the section where the generated paper content will appear. 
          It should be properly justified to ensure the text aligns neatly along both the left and right sides of the page.
        </p>
      </div>

      {/* File input */}
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        {/* Error message */}
        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      </div>

      {/* Button to trigger upload */}
      <div className="flex justify-center w-full">
        <button
          onClick={handleUploadClick}
          className="bg-customDarkTeal text-white font-bold py-2 px-4 rounded transition-all hover:bg-customLightTeal hover:text-black"
        >
          Upload Paper
        </button>
      </div>

      {/* Success message */}
      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
    </div>
  );
}

export default GeneratedPaper;
