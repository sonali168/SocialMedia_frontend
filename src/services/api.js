import axios from 'axios';

// Create an Axios instance with the base URL of your backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // Set the base URL for all requests
});

// Attach JWT token (if available) to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
