// src/hooks/useAuth.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AuthService from '../services/authService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: AuthService.login, // credentials => POST /auth/login
    onSuccess: (data) => {
      // data = { token, type, id, username, email, roles, ... }
      // Giả sử data.type="Bearer", data.token="eyJhbGci..."
      // => Ta chỉ lưu raw JWT (Option A)

      const rawToken = data.token;  // "eyJhbGci..."
      const userObject = {
        token: rawToken,
        id: data.id,
        email: data.email,
        username: data.username,
        roles: data.roles, // ['ROLE_ADMIN']
      };

      localStorage.setItem('user', JSON.stringify(userObject));
      queryClient.invalidateQueries(['user']); // optional

      addNotification('Đăng nhập thành công!', 'success');
      navigate('/dashboard');
    },
    onError: (error) => {
      addNotification(error.message || 'Đăng nhập không thành công.', 'danger');
    },
  });

  // Register
  const registerMutation = useMutation({
    mutationFn: AuthService.register,
    onSuccess: () => {
      addNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
      navigate('/auth/signin');
    },
    onError: (error) => {
      addNotification(error.message || 'Đăng ký không thành công.', 'danger');
    },
  });

  // Forgot Password
  const forgotPasswordMutation = useMutation({
    mutationFn: AuthService.forgotPassword,
    onSuccess: () => {
      addNotification('Vui lòng kiểm tra email để đặt lại mật khẩu.', 'success');
    },
    onError: (error) => {
      addNotification(error.message || 'Yêu cầu đặt lại mật khẩu không thành công.', 'danger');
    },
  });

  // Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: AuthService.resetPassword,
    onSuccess: () => {
      addNotification('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.', 'success');
      navigate('/auth/signin');
    },
    onError: (error) => {
      addNotification(error.message || 'Đặt lại mật khẩu không thành công.', 'danger');
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,

    // status if needed
    loginStatus: loginMutation.status,
    registerStatus: registerMutation.status,
    forgotPasswordStatus: forgotPasswordMutation.status,
    resetPasswordStatus: resetPasswordMutation.status,
  };
};

export default useAuth;
