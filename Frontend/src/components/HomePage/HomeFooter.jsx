import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#EDEFFF] py-10"  id='contact-section'>
      <div className="container mx-auto text-center">
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-8 mb-6">
          <a href="#" className="text-gray-700 text-2xl">
            <FaFacebookF />
          </a>
          <a href="#" className="text-gray-700 text-2xl">
            <FaTwitter />
          </a>
          <a href="#" className="text-gray-700 text-2xl">
            <FaLinkedinIn />
          </a>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-12 text-gray-700 font-medium">
          <a href="#">Features</a>
          <a href="#">Team</a>
          <a href="#">Gallery</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
