// src/utils/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  return auth.user ? children : <Navigate to="/auth/signin" />;
};

export default PrivateRoute;
