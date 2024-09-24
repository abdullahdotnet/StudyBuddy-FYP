import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, handleSuccess } from "./Utils";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      return handleError("Please fill in all fields");
    }

    try {
      const url = "http://127.0.0.1:5000/login"; // change this to your API URL
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8", // remove charset=UTF-8 if 415 error occurs
        },
      });

      const data = await response.json(); // Change this to your response data structure
        if (data.success) {              
            handleSuccess(data.message);
            // Redirect to dashboard
            window.location.href = "/dashboard";
        } else {
            handleError(data.message);
        }
      
    } catch (error) {

      console.log(error);
      handleError("An error occurred. Please try again");
    }
  };
  return (
    <div className="flex flex-col md:flex-row justify-around items-center min-h-screen p-8 bg-[#f7f3ef]">
      {/* Login Form */}
      <div className="w-full max-w-md mr-8 mb-8 md:mb-0">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Welcome To GENIUS BUDDY!
        </h2>
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="text"
              id="email"
              placeholder="email@gmail.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f4cbb3] focus:border-transparent"
            />
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
            <a
              href="/forgot-password"
              className="text-sm text-gray-500 mt-2 inline-block"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#f4cbb3] hover:bg-[#f0b490] text-white py-3 rounded-md text-lg focus:outline-none transition duration-300"
          >
            Login
          </button>
        </form>
        <ToastContainer />

        {/* Sign up Link */}
        <p className="mt-6 text-gray-700 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#f0b490] hover:underline">
            Sign up
          </a>
        </p>
      </div>

      {/* Image Section */}
      <div className="w-full max-w-md h-96 flex justify-center items-center">
        <img
          src="/src/pages/Login/login.png"
          alt="Login Illustration"
          className="rounded-lg max-w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
