import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../services/Utils";
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation checks
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !fullName ||
      !classGrade ||
      !dateOfBirth
    ) {
      return handleError("Please fill in all fields");
    }
    if (password !== confirmPassword) {
      return handleError("Passwords do not match");
    }

    try {
      const url = "http://127.0.0.1:8000/api/user/register/"; // Change this to your signup API URL
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email,
          name: fullName,
          password,
          password2: confirmPassword,
          classlevel: classGrade,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      if (response.ok) {
        const { msg } = await response.json();
        handleSuccess(msg);
        setTimeout(() => {
          navigate('/login');
        }, 1500); // wait for 1.5 seconds
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.errors.email[0];
      
        if (errorMessage) {
          handleError(errorMessage); // Display the error message to the user
        } else {
          handleError('An unknown error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.log(error);
      handleError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-around items-center min-h-screen p-8 bg-white">
      {/* Image Section */}
      <div className="w-full max-w-md h-96 flex justify-center items-center">
        <img
          src="/src/assets/images/signup.png"
          alt="Signup Illustration"
          className="rounded-lg max-w-full h-full object-cover"
        />
      </div>

      {/* Signup Form */}
      <div className="w-full max-w-md mr-8 mb-8 md:mb-0">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Sign Up for GENIUS BUDDY!
        </h2>
        <form onSubmit={handleSignup}>
          {/* Full Name Input */}
          <div className="mb-6">
            <label htmlFor="fullName" className="block text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f4cbb3] focus:border-transparent"
            />
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f4cbb3] focus:border-transparent"
            />
          </div>

          {/* Class and Date of Birth (side by side) */}
          <div className="flex space-x-4 mb-6">
            {/* Class Selector */}
            <div className="w-1/2">
              <label htmlFor="class" className="block text-gray-700 mb-2">
                Select Your Class
              </label>
              <select
                id="class"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f4cbb3] focus:border-transparent"
              >
                <option value="">Select Class</option>
                <option value="9th">9th Grade</option>
                <option value="10th">10th Grade</option>
              </select>
            </div>

            {/* Date of Birth Input */}
            <div className="w-1/2">
              <label htmlFor="dob" className="block text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f4cbb3] focus:border-transparent"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f4cbb3] focus:border-transparent"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f4cbb3] focus:border-transparent"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-[#f4cbb3] hover:bg-[#f0b490] text-white py-3 rounded-md text-lg focus:outline-none transition duration-300"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <ToastContainer />

        {/* Login Link */}
        <p className="mt-6 text-gray-700 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-[#f0b490] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
