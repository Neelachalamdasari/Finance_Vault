import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const { signup } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { companyName, name, email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="flex items-center min-h-[91.5vh] bg-[#073737]">
      <div className="w-full max-w-md p-8 space-y-6 bg-transparent">
        <h2 className="text-2xl font-bold text-[#FDFFD4]">
          Create your organization
        </h2>
        <p className="text-sm text-[#FDFFD4]/80">
          You will be registered as <strong className="text-[#FDFFD4]">Viewer</strong>
        </p>
        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* --- Your Name Input --- */}
          <div>
            <label
              htmlFor="name"
              // Text color updated
              className="block mb-2 text-sm font-medium text-[#FDFFD4]"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              // Focus ring color updated
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#073737] focus:border-[#073737]"
            />
          </div>
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
              // Focus ring color updated
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
            Sign Up
          </button>
        </form>
        {/* --- Link to Login Page --- */}
        <p className="text-sm text-[#FDFFD4]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-500 underline hover:text-[#FDFFD4]">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;