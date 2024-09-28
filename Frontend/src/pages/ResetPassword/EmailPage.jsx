import React, { useState } from 'react';
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../services/Utils";


const ResetPasswordEmail = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        handleSuccess('Check your email for the reset link.');
      } else {
        handleError('This email is not registered.');
      }
    } catch (error) {
      console.error('Error:', error);
      handleError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-around items-center min-h-screen p-8 bg-white">
      <div className="w-full max-w-md mr-8 mb-8 md:mb-0">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f4cbb3] focus:border-transparent"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f4cbb3] hover:bg-[#f0b490] text-white py-3 rounded-md text-lg focus:outline-none transition duration-300"
          >
            {loading ? 'Sending...' : 'Send Email'}
          </button>

          {/* Conditional Message Display */}
          {/* {error && <p className="text-red-500 mt-4">{error}</p>}
          {success && <p className="text-green-500 mt-4">Check your email for the reset link.</p>} */}
        </form>
        <ToastContainer />
      </div>

      {/* Image Section */}
      <div className="w-full max-w-md h-96 flex justify-center items-center">
        <img
          src="/src/assets/images/login.png"
          alt="Reset Password Illustration"
          className="rounded-lg max-w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ResetPasswordEmail;
