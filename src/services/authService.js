// src/services/authService.js
import axios from 'axios';

// URL của backend
const API_URL = 'http://localhost:8080/api/auth/';

// Đăng ký người dùng
const register = (userData) => {
  return axios.post(`${API_URL}register`, userData);
};

// Đăng nhập người dùng
const login = async (userData) => {
  const response = await axios.post(`${API_URL}login`, userData);
    if (response.data.jwt) {
        // Lưu token vào localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Đăng xuất người dùng
const logout = () => {
  localStorage.removeItem('user');
};

// Quên mật khẩu
const forgotPassword = (email) => {
  return axios.post(`${API_URL}forgot-password`, { email });
};

// Đặt lại mật khẩu
const resetPassword = (token, newPassword) => {
  return axios.post(`${API_URL}reset-password`, { token, newPassword });
};

const authService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};

export default authService;
