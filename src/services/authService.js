// src/services/authService.js
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const AuthService = {
  login: async (credentials) => {
    console.log('Sending login request:', credentials);
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    console.log('Login response:', response);
    return response.data;
  },
  register: async (userData) => {
    console.log('Sending register request:', userData);
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
    console.log('Register response:', response);
    return response.data;
  },
  forgotPassword: async (email) => {
    console.log('Sending forgot password request:', email);
    const response = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    console.log('Forgot password response:', response);
    return response.data;
  },
  resetPassword: async (token, newPassword) => {
    console.log('Sending reset password request:', { token, newPassword });
    const response = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
    console.log('Reset password response:', response);
    return response.data;
  },
};

export default AuthService;
