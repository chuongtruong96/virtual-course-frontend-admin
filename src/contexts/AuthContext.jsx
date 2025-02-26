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
        // Decode the stored token
        const decoded = jwt_decode(storedUser.token);
        // Ensure we always get the user id from the decoded token, falling back to storedUser.id (if ever available)
        const userId = decoded.accountId || storedUser.id;
        console.log('Decoded token:', decoded, 'User ID:', userId);
        if (decoded.exp * 1000 > Date.now() && userId) {
          // Build the user data ensuring id is always provided
          const userData = {
            ...decoded,
            id: userId,
            email: storedUser.email || decoded.email || '',
            username: storedUser.username || decoded.sub || '',
            roles: storedUser.roles || (decoded.roles ? decoded.roles.map(r => r.authority || r) : []),
          };
          setAuth({
            token: storedUser.token,
            user: userData,
          });
        } else {
          console.warn('Token expired or user id missing. Removing from localStorage.');
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
      // Check for admin privileges
      if (!user.roles.includes('ROLE_ADMIN')) {
        throw new Error('User does not have admin privileges');
      }
      // Get the id from the decoded token or the passed user object, while favoring decoded.accountId
      const userId = decoded.accountId || user.id;
      if (!userId) {
        throw new Error('User id is missing from the token payload');
      }
      const userObject = {
        token: user.token,
        id: userId,
        email: user.email,
        username: user.username,
        roles: user.roles,
      };

      localStorage.setItem('user', JSON.stringify(userObject));

      setAuth({
        token: user.token,
        user: {
          ...decoded,
          id: userId,
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