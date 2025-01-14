// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log("Stored User from localStorage:", storedUser);

    if (storedUser && storedUser.token) {
      try {
        const rawToken = storedUser.token; // raw JWT
        // Decode token
        const decoded = jwt_decode(rawToken);
        console.log("Decoded Token Payload:", decoded);

        // Check token expiration
        if (decoded.exp * 1000 > Date.now()) {
          setAuth({
            token: rawToken,
            user: {
              id: storedUser.id,
              email: storedUser.email,
              username: storedUser.username,
              roles: storedUser.roles, // ['ROLE_ADMIN']
              ...decoded,
            },
          });
        } else {
          console.error("Token expired");
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (user) => {
    // user = {token, id, email, username, roles}
    try {
      const decoded = jwt_decode(user.token);
      console.log("Decoded Token Payload on Login:", decoded);

      localStorage.setItem('user', JSON.stringify(user));

      setAuth({
        token: user.token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          roles: user.roles, // ['ROLE_ADMIN']
          ...decoded,
        },
      });
    } catch (error) {
      console.error('Invalid token on login:', error);
      localStorage.removeItem('user');
    }
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
