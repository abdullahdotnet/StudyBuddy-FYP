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
          <svg width="40" height="40" viewBox="0 0 39 66" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_486_3543)">
              <path d="M30.8624 6.52687C31.9038 4.75092 31.2616 2.04173 29.7681 1.92613L18.1854 1.02957C17.872 1.00157 17.5532 1.10503 17.2596 1.32998C16.966 1.55493 16.7074 1.89382 16.5088 2.31405L5.91117 25.3163C5.07522 27.1279 5.76431 29.5224 7.15265 29.6298L13.0665 30.0876L5.74762 52.2421C4.7211 55.0363 6.69537 57.8176 8.31784 55.864L20.9665 39.3706L33.6151 22.8771L21.8029 21.9628L30.8624 6.52687Z" stroke="#4255FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" shape-rendering="crispEdges" />
            </g>
            <defs>
              <filter id="filter0_d_486_3543" x="0.464844" y="0.0253906" width="38.1504" height="65.4932" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_486_3543" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_486_3543" result="shape" />
              </filter>
            </defs>
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
              className={`w-8 h-8 flex items-center justify-center rounded-full ${index === 4 || index === 6 || index === 5
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
