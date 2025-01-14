// src/untils/PrivateRoute.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * PrivateRoute (React Router v6):
 * - Nếu đã đăng nhập (auth.token != null) và có vai trò 'ROLE_ADMIN' thì cho render children
 * - Ngược lại, chuyển hướng về /auth/signin
 */
const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  // Thêm log để kiểm tra trạng thái auth
  console.log("Current auth state:", auth);

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!auth || !auth.token) {
    console.warn("User not authenticated. Redirecting to /auth/signin");
    return <Navigate to="/auth/signin" replace />;
  }

  // Kiểm tra xem người dùng có vai trò 'ROLE_ADMIN' không
  if (!auth.user?.roles?.includes('ROLE_ADMIN')) {
    console.warn("User does not have ADMIN role. Redirecting to /auth/signin");
    return <Navigate to="/auth/signin" replace />;
  }

  // Nếu tất cả điều kiện đều thỏa mãn, render children hoặc Outlet
  return children ? children : <Outlet />;
};

export default PrivateRoute;
