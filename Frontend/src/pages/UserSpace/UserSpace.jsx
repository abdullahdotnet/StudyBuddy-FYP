import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserSpace = () => {
  const [fileLinks, setFileLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch files from the backend API
    const fetchFiles = async () => {
      try {
        const token = sessionStorage.getItem('accessToken'); // get token from sessionStorage
        const response = await axios.get('http://localhost:8000/api/userspace/user_files/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
        setFileLinks(response.data.file_links);
      } catch (err) {
        setError('Failed to fetch files. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) {
    return <div className="text-center mt-6 text-xl">Loading your files...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Files</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {fileLinks.length > 0 ? (
          fileLinks.map((file, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-4">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/337/337946.png" // Use a CDN link for a PDF icon
                  alt="PDF Icon"
                  className="w-16 h-16 mx-auto"
                />
              </div>
              <h4 className="text-lg font-semibold mb-4 text-gray-700"> {file.file_name}</h4>
              <button
                className="bg-customDarkBlue text-white px-4 py-2 rounded-lg hover:bg-customDarkBlueHover transition duration-300"
                onClick={() =>
                  window.open(`http://localhost:8000/media/${file.file_path}`, '_blank')
                }
              >
                Open
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            No files found in your space.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSpace;
