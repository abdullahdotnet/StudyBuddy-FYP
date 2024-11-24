import React, { useState, useEffect } from "react";
import axios from "axios";

const Notes = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch the file links from the API
    const fetchFiles = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        const response = await axios.get("http://localhost:8000/api/userspace/user_files/" ,{
          headers: {
            Authorization: `Bearer ${token}`,
        },});
        if (response.data.file_links) {
          // Set the files state with the file links
          setFiles(response.data.file_links.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notes</h2>
        <a href="#" className="text-blue-500 hover:underline">
          view all
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
          >
            <div className="text-red-500 text-4xl">
              <i className="fas fa-file-pdf"></i>
            </div>
            <p className="text-center mt-2 font-medium">
              {file.name || `File ${index + 1}`}
            </p>
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-300"
                onClick={() =>
                  window.open(`http://localhost:8000/media/${file.file_path}`, '_blank')
                }
              >
                Open PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
