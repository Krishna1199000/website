// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/hero-bg.jpg'; // You'll need to add this image

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black bg-opacity-50 p-10 rounded-lg text-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl text-white font-bold mb-6">
          Welcome to Hinglaj Tailor
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-8">
          Seamlessly connect with us. Sign up or sign in to get started.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {/* User Buttons */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => navigate('/user-signup')}
              className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg hover:bg-secondary transition transform hover:scale-105"
            >
              User Sign Up
            </button>
            <button
              onClick={() => navigate('/user-signin')}
              className="mt-4 bg-white text-primary px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              User Sign In
            </button>
          </div>

          {/* Admin Buttons */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => navigate('/admin-signup')}
              className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg hover:bg-secondary transition transform hover:scale-105"
            >
              Admin Sign Up
            </button>
            <button
              onClick={() => navigate('/admin-signin')}
              className="mt-4 bg-white text-primary px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              Admin Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
