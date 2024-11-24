import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';  
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { name, email, password } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('All fields are required!');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format!');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await API.post('/auth/signup', formData);  
      toast.success('Signup successful!');
      setTimeout(() => navigate('/'), 2000);  
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed!');
    }
  };

  // Navigate to Login page
  const handleLoginRedirect = () => {
    navigate('/');
    
  };

  return (
    <div className="form-container">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <h2>Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Signup</button>

        {/* Redirect to Login Page Button */}
        <button
          type="button"
          className="login-button"
          onClick={handleLoginRedirect}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
