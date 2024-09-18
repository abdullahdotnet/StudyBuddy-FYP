import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import StudentPic from '../../assets/images/students06.jpg'

const DashboardNavbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = useCallback(() => {
        setDropdownOpen(prev => !prev);
    }, []);

    return (
        <nav className="bg-white">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-gray-900">
                        Genius Buddy
                    </div>
                    {/* Left side links */}
                    <div className="hidden md:flex space-x-6">
                        <Link to="/home" className="text-gray-800 hover:text-customDarkOrange">Home</Link>
                        <Link to="/faqs" className="text-gray-800 hover:text-customDarkOrange">FAQs</Link>
                        <Link to="/notifications" className="text-gray-800 hover:text-customDarkOrange">Notifications</Link>
                        <Link to="/contact" className="text-gray-800 hover:text-customDarkOrange">Contact</Link>
                        <Link to="/about-us" className="text-gray-800 hover:text-customDarkOrange">About Us</Link>
                    </div>

                    {/* Right side profile with dropdown */}
                    <div className="relative">
                        <img
                            src={StudentPic}  // Update this with the actual path to the user profile image
                            alt="Profile"
                            className="w-12 h-11 rounded-full cursor-pointer"
                            onClick={toggleDropdown}
                            aria-expanded={dropdownOpen}
                            aria-haspopup="true"
                        />
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md">
                                <Link
                                    to="/settings"
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                    Settings
                                </Link>
                                <Link
                                    to="/logout"
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default DashboardNavbar;
