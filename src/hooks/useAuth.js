// src/hooks/useAuth.js
import { useMutation } from '@tanstack/react-query';
import AuthService from '../services/authService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      console.log('Login successful', data);
      const user = {
        token: data.token,
        id: data.id,
        email: data.email,
        username: data.username,
        roles: data.roles,
      };
      authLogin(user);
      localStorage.setItem('user', JSON.stringify(user));
      addNotification('Đăng nhập thành công!', 'success');
      navigate('/dashboard/default');
    },
    onError: (error) => {
      console.error('Login failed', error);
      const message =
        error?.response?.data?.message || 'Đăng nhập không thành công.';
      addNotification(message, 'danger');
    },
  });

  return {
    login: loginMutation.mutate,
    loginStatus: loginMutation.status,
  };
};

export default useAuth;
