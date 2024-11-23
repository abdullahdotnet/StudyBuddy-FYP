import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  // Function to navigate to the dashboard
  const navigate = useNavigate();
  const navigateToDashboard = () => {
    navigate('/dashboard');
  };


  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of image sources
  const images = [
    '/src/assets/images/students01.avif',
    '/src/assets/images/students06.jpg',
    '/src/assets/images/students04.jpg'
  ];

  // Automatically rotate the images every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Rotate to the next image
    }, 4000); // 4 seconds interval

    return () => clearInterval(interval); // Clean up the interval
  }, [images.length]);

  // Function to calculate the class for each image
  const getPositionClass = (index) => {
    // Position calculation relative to the current index
    const relativeIndex = (index - currentIndex + images.length) % images.length;

    // Determine the position class based on relativeIndex (left, center, right)
    if (relativeIndex === 0) {
      return 'translate-x-0 scale-125 z-10 opacity-100'; // Center image
    } else if (relativeIndex === 1) {
      return 'translate-x-full scale-90 opacity-90'; // Right image
    } else {
      return '-translate-x-full scale-90 opacity-90'; // Left image
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between p-11 bg-white h-full">
      {/* Left side: Text and button */}
      <div className="flex flex-col space-y-3 md:w-1/2 items-center">
        <h1 className="rosario-font text-5xl font-bold text-gray-900 ">StudyBuddy</h1>
        <p className="text-lg text-black">Your AI buddy for studies.</p>
        <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#05eaa530] via-[#ff703c1c] to-[#ff703c3f] rounded-full shadow-lg hover:shadow-xl transition-shadow"
        onClick={navigateToDashboard}
        >
          <span className="text-gray-800 font-semibold roboto-font">Get Started</span>
          <img src="src/assets/icons/rightarrow.svg" alt="arrow" className="w-5 h-5" />
        </button>
      </div>

      {/* Right side: Sliding and rotating images */}
      <div className="relative flex justify-center items-center mt-10 md:mt-0 md:w-1/2 h-64">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`students0${index + 1}`}
            className={`absolute h-48 w-40 rounded-lg transition-transform transform-gpu duration-1000 ease-in-out ${getPositionClass(index)}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;