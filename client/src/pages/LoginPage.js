import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login(formData);
  };

  return (
    // Background updated to the theme's light cream color
    <div 
      className="flex items-center  min-h-[91.5vh] bg-[#073737] "
    >
      {/* Card styled with a white background and subtle border */}
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Heading text color updated to dark teal */}
        <h2 className="text-2xl font-bold  text-[#FDFFD4]">
          Login to Your Account
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* --- Email Input --- */}
          <div>
            <label
              htmlFor="email"
              // Text color updated
              className="block mb-2 text-sm font-medium text-[#FDFFD4]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              // Focus ring color updated to the new main color
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#073737] focus:border-[#073737]"
            />
          </div>
          {/* --- Password Input --- */}
          <div>
            <label
              htmlFor="password"
              // Text color updated
              className="block mb-2 text-sm font-medium text-[#FDFFD4]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              // Focus ring color updated
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#073737] focus:border-[#073737]"
            />
          </div>
          {/* --- Submit Button --- */}
          <button
            type="submit"
            // Button color updated to the new main color
            className="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-emerald-600 transition-all duration-300 transform"
          >
            Login
          </button>
        </form>
        {/* --- Link to Signup Page --- */}
        <p className="text-sm text-[#FDFFD4] mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-emerald-500 underline hover:text-[#FDFFD4]">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;