import React, { useState, useRef } from 'react';

function GeneratedPaper() {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null); // To access the file input programmatically

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

  // Trigger file input on button click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle form submission or any additional logic with the file
  const handleFileSubmit = () => {
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

      {/* Hidden file input */}
      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden" // Hide the input field
      />

      {/* Button to trigger file browsing */}
      <div className="flex justify-center w-full">
        <button
          onClick={handleButtonClick}
          className="bg-customDarkTeal text-white font-bold py-2 px-4 rounded transition-all hover:bg-customLightTeal hover:text-black"
        >
          Browse and Upload Paper
        </button>
      </div>

      {/* Error message */}
      {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}

      {/* Button to submit the selected file */}
      <div className="flex justify-center w-full mt-4">
        <button
          onClick={handleFileSubmit}
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
