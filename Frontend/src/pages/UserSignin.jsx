// src/components/UserSignin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {UsertokenAtom} from "../stores/Useratoms"
import {Usersignin} from "../services/operations/UserAuthApi"
import { useSetRecoilState } from 'recoil';

const UserSignin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const setToken = useSetRecoilState(UsertokenAtom);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(){
    const token = await Usersignin(form.email,form.password);
    if(token){
        setToken(token);
        setForm({
            email: "",
            password: "",
        })
        console.log('User Signin:', form);
        navigate('/'); // Redirect to home or dashboard
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center">User Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/user-signup')}
            className="text-primary cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserSignin;
