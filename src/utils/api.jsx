import axios from 'axios';
import ENDPOINTS from '../config/endpoints';

// Create an Axios instance
const api = axios.create({
  baseURL: ENDPOINTS.API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;
    if (storedUser?.token) {
      config.headers.Authorization = `Bearer ${storedUser.token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors and other responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized error
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear auth and redirect to login on 401
      localStorage.removeItem('user');
      window.location.href = '/auth/signin';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;