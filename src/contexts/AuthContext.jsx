import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;

    if (storedUser?.token) {
      try {
        const decoded = jwt_decode(storedUser.token);

        if (decoded.exp * 1000 > Date.now()) {
          setAuth({
            token: storedUser.token,
            user: {
              ...decoded,
              id: storedUser.id,
              email: storedUser.email,
              username: storedUser.username,
              roles: storedUser.roles,
            },
          });
        } else {
          console.warn('Token expired. Removing from localStorage.');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('user');
      }
    }

    setAuthLoading(false);
  }, []);

  const login = (user) => {
    try {
      const decoded = jwt_decode(user.token);

      // Ensure we have the admin role
      if (!user.roles.includes('ROLE_ADMIN')) {
        throw new Error('User does not have admin privileges');
      }

      const userObject = {
        token: user.token,
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles,
      };

      localStorage.setItem('user', JSON.stringify(userObject));

      setAuth({
        token: user.token,
        user: {
          ...decoded,
          id: user.id,
          email: user.email,
          username: user.username,
          roles: user.roles,
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      localStorage.removeItem('user');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuth({
      token: null,
      user: null,
    });
  };

  const hasRole = (role) => {
    return auth.user?.roles?.includes(role) || false;
  };

  if (authLoading) {
    return <p>Loading user information...</p>;
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;