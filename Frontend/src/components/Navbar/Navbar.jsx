import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gray-900">
            Genius Buddy
          </div>
          <ul className="hidden md:flex space-x-6">
            <li><a href="#features" className="text-gray-700 hover:text-gray-900">Features</a></li>
            <li><a href="#about" className="text-gray-700 hover:text-gray-900">About Us</a></li>
            <li><a href="#contact" className="text-gray-700 hover:text-gray-900">Contact</a></li>
            <li><a href="#faq" className="text-gray-700 hover:text-gray-900">FAQ/s</a></li>
          </ul>
          <div className="hidden md:flex space-x-4">
            <button className="border border-green-500 text-green-500 py-2 px-4 rounded hover:bg-green-100">
              Sign In
            </button>
            <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
              Join Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
