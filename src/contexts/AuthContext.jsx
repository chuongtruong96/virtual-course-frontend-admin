// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // Version ^3.x => OK
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null
  });

  useEffect(() => {
    // Kiểm tra token từ localStorage khi app khởi tạo
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.jwt) {
      try {
        const decoded = jwt_decode(storedUser.jwt);
        setAuth({
          token: storedUser.jwt,
          user: decoded,
        });
      } catch (error) {
        console.error('Invalid token:', error);
        // Nếu token lỗi => logout
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decoded = jwt_decode(token);
      localStorage.setItem('user', JSON.stringify({ jwt: token }));
      setAuth({
        token,
        user: decoded
      });
    } catch (error) {
      console.error('Invalid token on login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuth({
      token: null,
      user: null
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; // optional
