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
        <h2 className="text-xl font-bold">Chats</h2>
        <a
          href="#"
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          view all
        </a>
      </div>

      {/* Chat Cards */}
      <div className="flex space-x-4 overflow-x-auto">
        {chatData.map((chat, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-64 p-4 bg-gray-50 text-center rounded-lg shadow-md"
          >
            {chat}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
