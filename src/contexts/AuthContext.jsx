// src/contexts/AuthContext.js (hoặc .jsx)
import React, { createContext, useState, useEffect } from 'react';
// IMPORT default export (nếu bạn đã cài jwt-decode version phù hợp)
import jwt_decode  from 'jwt-decode';
// Hoặc nếu bạn vẫn bị lỗi, hãy thử: 
// import * as jwt_decode from 'jwt-decode'; 
// rồi gọi jwt_decode.default(token) thay vì jwt_decode(token).

import authService from '../services/authService';

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
export default AuthContext;