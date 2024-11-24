import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';  // Import the API instance
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      toast.error('All fields are required!');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format!');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await API.post('/auth/login', formData);
      console.log('Form Data Sent to API:', formData); // Use the base URL set in API
      toast.success('Login successful!');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed!');
    }
  };

  // Navigate to Signup page
  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="form-container">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="off" // Disable autofill for the email field
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          data-password="true"
        />
        <button type="submit">Login</button>

        {/* Redirect to Signup Page Button */}
        <button
          type="button"
          className="signup-button"
          onClick={handleSignupRedirect}
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
