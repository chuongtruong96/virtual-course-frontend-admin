// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import authService from '../contexts/';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  useEffect(() => {
    // Kiểm tra token từ localStorage khi ứng dụng tải lên
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.jwt) {
      const decoded = jwt_decode(storedUser.jwt);
      setAuth({
        token: storedUser.jwt,
        user: decoded,
      });
    }
  }, []);

  const login = (token) => {
    const decoded = jwt_decode(token);
    localStorage.setItem('user', JSON.stringify({ jwt: token }));
    setAuth({
      token,
      user: decoded,
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuth({
      token: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
