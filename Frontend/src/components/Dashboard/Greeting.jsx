import React from "react";

const Greeting = ({ name, quote, streak }) => {
  return (
    <div className="h-[286px] w-full md:w-[calc(100%-356px)] bg-white rounded-lg p-6 flex flex-col justify-between">
      {/* Greeting */}
      <div>
        <h1 className="text-4xl font-bold">
          Hi there, <span className="text-blue-600">{name}!</span>
        </h1>
        <p className="text-gray-500 italic mt-2">{`"${quote}"`}</p>
      </div>

      {/* Streak */}
      <div className="flex flex-col items-center mt-4">
        <div className="flex items-center text-lg font-medium text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-blue-600 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L20.25 16.5H6.75L13.5 4.5z"
            />
          </svg>
          {streak} Days Streak
        </div>
      </div>

      {/* Days Tracker */}
      <div className="flex justify-center mt-4">
        <div className="flex space-x-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <div
              key={index}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index === 2 || index === 3 || index === 5
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Greeting;
