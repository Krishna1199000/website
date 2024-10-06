// src/components/AdminSignup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Adminsignup} from "../services/operations/AdminAuthApi"
const AdminSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit (e) {
    e.preventDefault();
    const response = await Adminsignup(
        form.firstname,
        form.lastname,
        form.email,
        form.password
    )
    if(response === "Admin created successfully"){
        setForm({
            firstname: "",
            lastname:"",
            email: "",
            password: "",
        });
        console.log('Admin Signup:', form);
        navigate('/admin-signin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstname"
            placeholder="firstname"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.firstname}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastname"
            placeholder="lastname"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.lastname}
            onChange={handleChange}
          />
          <input
            type="text"
            name="email"
            placeholder="email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="password"
            placeholder="password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already an admin?{' '}
          <span
            onClick={() => navigate('/admin-signin')}
            className="text-primary cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
