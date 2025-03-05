import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  // If not authenticated, redirect to sign-in
  if (!auth || !auth.user) {
    return <Navigate to="/auth/signin" replace />;
  }
  // if (roles.length > 0) {
  //   const userRoles = auth.roles.map(role => 
  //     typeof role === 'string' ? role : role.authority
  //   );
    
  //   const hasRequiredRole = roles.some(role => userRoles.includes(role));
    
  //   if (!hasRequiredRole) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }
  // }
  // If authenticated, render children
  return children;
};

export default PrivateRoute;