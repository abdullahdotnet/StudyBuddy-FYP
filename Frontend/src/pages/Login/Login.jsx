import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleError, handleSuccess } from "../../services/Utils";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getuserdata = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    try {
      const url = "http://localhost:8000/api/user/profile";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("username", data.name);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      return handleError("Please fill in all fields");
    }

    try {
      const url = "http://127.0.0.1:8000/api/user/login/"; // change this to your API URL
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8", // remove charset=UTF-8 if 415 error occurs
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Set session storage
        sessionStorage.setItem("accessToken", data.token.access);
        handleSuccess(data.msg);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500); // wait for 1.5 seconds
        getuserdata();
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.errors.non_field_errors[0];

        if (errorMessage) {
          handleError(errorMessage); // Display the error message to the user
        } else {
          handleError("An unknown error occurred. Please try again.");
        }
      }
    } catch (error) {
      console.log(error);
      handleError("An error occurred. Please try again");
    }
  };
  return (
    <div className="flex flex-col md:flex-row justify-around items-center min-h-screen p-8 bg-white">
      {/* Login Form */}
      <div className="w-full max-w-md mr-8 mb-8 md:mb-0">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Welcome To STUDY BUDDY!
        </h2>
        <form onSubmit={handleLogin}>
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
              href="/reset-password"
              className="text-sm text-gray-500 mt-2 inline-block hover:text-customDarkBlue"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-customDarkBlue hover:bg-customDarkBlueHover text-white py-3 rounded-md text-lg focus:outline-none transition duration-300"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
        <ToastContainer />

        {/* Sign up Link */}
        <p className="mt-6 text-gray-700 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-customDarkBlue hover:underline">
            Sign up
          </a>
        </p>
      </div>

      {/* Image Section */}
      <div className="w-full max-w-md h-96 flex justify-center items-center">
        <img
          src="/src/assets/images/login.png"
          alt="Login Illustration"
          className="rounded-lg max-w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
