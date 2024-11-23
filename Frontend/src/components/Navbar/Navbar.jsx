import React from "react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gray-900">
            StudyBuddy
          </div>
          <ul className="hidden md:flex space-x-6">
            <li><a href="#features-section" className="text-gray-700 hover:text-customDarkOrange">Features</a></li>
            <li><a href="#about-section" className="text-gray-700 hover:text-customDarkOrange">About Us</a></li>
            <li><a href="#contact-section" className="text-gray-700 hover:text-customDarkOrange">Contact</a></li>
            <li><a href="#faq-section" className="text-gray-700 hover:text-customDarkOrange">FAQ/s</a></li>
          </ul>
          <div className="hidden md:flex space-x-4">
            <Link to="/login">
              <button className="border border-green-500 text-[#586380] py-2 px-4 rounded hover:bg-[#EDEFFF]">
                Sign In
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-[#4255FF] text-white py-2 px-4 rounded hover:bg-[#4255EE]">
                Join Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
