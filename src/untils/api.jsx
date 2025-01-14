// src/utils/api.js
import axios from 'axios';

// Tạo instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;
    if (storedUser && storedUser.token) {
      // Gán config.headers.Authorization = "Bearer " + rawToken
      config.headers.Authorization = `Bearer ${storedUser.token}`;
      console.log("Attached Authorization header:", config.headers.Authorization);
    } else {
      console.warn("No token found in localStorage for API request.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
