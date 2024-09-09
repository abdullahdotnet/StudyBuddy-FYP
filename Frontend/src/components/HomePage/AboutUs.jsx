import React from 'react';

const AboutUs = () => {
  return (
    <section className="relative bg-[#FFCBA4] py-16 px-8 mb-3">
      <h2 className="text-5xl font-bold text-center mb-10">ABOUT US</h2>

      <div className="flex flex-col lg:flex-row items-center lg:space-x-8 poppins-font">
        {/* Left Side - Image */}
        <div className="w-full lg:w-5/12 relative">
          <div className="overflow-hidden rounded-r-full">
            <img
              src="/src/assets/images/students01.avif"
              alt="Students working together"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Right Side - Content with 2 Columns */}
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Four Content Sections */}
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-lg font-bold">
                  {num}
                </div>
              </div>
              <div>
                <p className="text-gray-700">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="text-center mt-10">
        <button className="bg-[#E0FBF3] px-6 py-3 rounded-full text-black font-bold shadow-md">
          More Information
        </button>
      </div>
    </section>
  );
};

export default AboutUs;
