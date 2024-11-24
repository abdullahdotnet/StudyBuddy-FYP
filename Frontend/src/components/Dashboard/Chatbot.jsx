import React from "react";

const Chats = () => {
  const chatData = [
    "What is thermodynamics?",
    "Binary Proposition",
    "What is thermodynamics?",
  ];

  return (
    <div className="w-full bg-white p-4 rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold roboto-font">Chats</h2>
        <a
          href="#"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          view all
        </a>
      </div>

      {/* Chat Cards */}
      <div className="flex justify-between space-x-4">
        {chatData.map((chat, index) => (
          <div
            key={index}
            className="flex-grow p-4 bg-white text-center rounded-lg shadow-md"
          >
            {chat}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
