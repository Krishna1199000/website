// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserSignup from "./pages/UserSignup"
import UserSignin from "./pages/UserSignin"
import AdminSignup from  "./pages/AdminSignup"
import AdminSignin from "./pages/AdminSignin"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-signup" element={<UserSignup />} />
        <Route path="/user-signin" element={<UserSignin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-signin" element={<AdminSignin />} />
      </Routes>
    </Router>
  );
}

export default App;
