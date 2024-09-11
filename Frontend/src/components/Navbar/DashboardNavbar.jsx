import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

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
                        <Link to="/dashboard" className="text-gray-800 hover:text-gray-600">Home</Link>
                        <Link to="/faqs" className="text-gray-800 hover:text-gray-600">FAQs</Link>
                        <Link to="/notifications" className="text-gray-800 hover:text-gray-600">Notifications</Link>
                        <Link to="/contact" className="text-gray-800 hover:text-gray-600">Contact</Link>
                        <Link to="/about-us" className="text-gray-800 hover:text-gray-600">About Us</Link>
                    </div>

                    {/* Right side profile with dropdown */}
                    <div className="relative">
                        <img
                            src="/path-to-profile-picture.jpg"  // Update this with the actual path to the user profile image
                            alt="Profile"
                            className="w-10 h-10 rounded-full cursor-pointer"
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
