// src/services/AuthService.js

import api from '../untils/api';
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler';

/**
 * AuthService xử lý tất cả các tương tác API liên quan đến Authentication.
 */
const AuthService = {
  login: async (credentials) => {
    try {
      // credentials = { email, password }
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
      // Backend trả về { token, type, id, username, email, roles, ... } (JwtResponse)
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw handleError(error);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw handleError(error);
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      console.error('Error in forgot password:', error);
      throw handleError(error);
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw handleError(error);
    }
  },
};

export default AuthService;
