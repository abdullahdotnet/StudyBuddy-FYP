import React from 'react'

function GeneratedPaper() {
  return (
    <>
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

        {/* Separate container for the button (centered) */}
        <div className="flex justify-center w-full">
          <button className="bg-customDarkTeal text-white font-bold py-2 px-4 rounded transition-all hover:bg-customLightTeal hover:text-black">
            Upload Paper
          </button>
        </div>
      </div>
    </>
  )
}

export default GeneratedPaper
