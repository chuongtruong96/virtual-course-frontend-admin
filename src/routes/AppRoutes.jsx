import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import PrivateRoute from '../utils/PrivateRoute';
import AdminLayout from '../layouts/AdminLayout';

// Lazy load components
const SignIn = lazy(() => import('../views/auth/signin/SignIn'));
const SignUp = lazy(() => import('../views/auth/signup/SignUp'));
const ForgotPassword = lazy(() => import('../views/auth/password/ForgotPassword'));
const ResetPassword = lazy(() => import('../views/auth/password/ResetPassword'));
const DashDefault = lazy(() => import('../views/dashboard/Dashboard'));

// User Management
const ListStudent = lazy(() => import('../views/student/ListStudent'));
const InstructorList = lazy(() => import('../views/instructor/InstructorList'));
const InstructorDetail = lazy(() => import('../views/instructor/InstructorDetail'));
const PendingInstructors = lazy(() => import('../views/instructor/PendingInstructors'));

// Content Management
const ListCategory = lazy(() => import('../views/category/ListCategory'));
const EditCategory = lazy(() => import('../views/category/EditCategory'));
const AddCategory = lazy(() => import('../views/category/AddCategory'));
const ListCourse = lazy(() => import('../views/course/ListCourse'));
const PendingCourses = lazy(() => import('../views/course/PendingCourses'));
const CourseDetail = lazy(() => import('../views/course/CourseDetail'));

// Account Management
const AccountList = lazy(() => import('../views/account/AccountList'));

// Reviews & Support
const ListReview = lazy(() => import('../views/review/ListReview'));
const ListTicket = lazy(() => import('../views/ticket/ListTicket'));
const NotificationList = lazy(() => import('../views/notification/NotificationList'));

const AppRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password/:token" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard/*"
        element={
          // <PrivateRoute>
<PrivateRoute roles={['ROLE_ADMIN']}>

            <AdminLayout />
          </PrivateRoute>
        }
      >
        {/* Dashboard */}
        <Route path="default" element={<DashDefault />} />

        {/* ACCOUNT */}
        <Route path="account/list" element={<AccountList />} />

        {/* STUDENT */}
        <Route path="student">
          <Route path="list-student" element={<ListStudent />} />
        </Route>

        {/* INSTRUCTOR */}
        <Route path="instructor">
          <Route path="list" element={<InstructorList />} />
          <Route path="pending" element={<PendingInstructors />} />
          <Route path="detail/:instructorId" element={<InstructorDetail />} />
        </Route>

        {/* CATEGORY */}
        <Route path="category">
          <Route path="list-category" element={<ListCategory />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="edit-category/:id" element={<EditCategory />} />
        </Route>

        {/* COURSE */}
        <Route path="course">
          <Route path="list-course" element={<ListCourse />} />
          <Route path="pending-approval" element={<PendingCourses />} />
          <Route path="detail/:id" element={<CourseDetail />} />
        </Route>

        {/* REVIEW */}
        <Route path="review/list" element={<ListReview />} />

        {/* TICKET */}
        <Route path="ticket/list" element={<ListTicket />} />

        {/* NOTIFICATION */}
        <Route path="notification/list" element={<NotificationList />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/dashboard/default" replace />} />
      </Route>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard/default" replace />} />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/dashboard/default" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
