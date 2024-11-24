import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Notes = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

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

  const handleViewAllClick = () => {
    navigate('/user-space'); // Programmatically route to /todo
};
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold roboto-font">Notes</h2>
        <button  onClick={handleViewAllClick}
                        className="px-6 py-2 bg-customDarkBlue text-white rounded-lg hover:bg-customDarkBlueHover"
                    >
                        View All
                    </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
          >
            <div className="text-red-500 text-4xl">

              <img
                  src="https://cdn-icons-png.flaticon.com/512/337/337946.png" // Use a CDN link for a PDF icon
                  alt="PDF Icon"
                  className="w-16 h-16 mx-auto"
                />
            </div>
            <p className="text-center mt-2 font-medium">
              {file.file_name || `File ${index + 1}`}
            </p>
            <button
                className="bg-customDarkBlue text-white px-4 py-2 rounded-lg hover:bg-customDarkBlueHover transition duration-300"
                onClick={() =>
                  window.open(`http://localhost:8000/media/${file.file_path}`, '_blank')
                }
              >
                Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
