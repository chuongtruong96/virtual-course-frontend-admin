// src/routes.jsx

import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './untils/PrivateRoute';
import { BASE_URL } from './config/constant';

// Sử dụng React.lazy để tải các component một cách lười biếng
const SignIn1 = lazy(() => import('./views/auth/signin/SignIn1'));
const SignUp1 = lazy(() => import('./views/auth/signup/SignUp1'));
const ForgotPassword = lazy(() => import('../src/views/auth/password/ForgotPassword'));
const ResetPassword = lazy(() => import('../src/views/auth/password/ResetPassword'));
const DashDefault = lazy(() => import('./views/dashboard'));
const BasicButton = lazy(() => import('./views/ui-elements/basic/BasicButton'));
const BasicBadges = lazy(() => import('./views/ui-elements/basic/BasicBadges'));
const BasicBreadcrumb = lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'));
const BasicCollapse = lazy(() => import('./views/ui-elements/basic/BasicCollapse'));
const BasicTabsPills = lazy(() => import('./views/ui-elements/basic/BasicTabsPills'));
const BasicTypography = lazy(() => import('./views/ui-elements/basic/BasicTypography'));
const FormsElements = lazy(() => import('./views/forms/FormsElements'));

// Import các component khác tương tự...
const ListStudent = lazy(() => import('./views/student/ListStudent'));
const EditStudent = lazy(() => import('./views/student/EditStudent'));
const AddStudent = lazy(() => import('./views/student/AddStudent'));

const InstructorList = lazy(() => import('./views/instructor/InstructorList'));
const EditInstructorForm = lazy(() => import('./views/instructor/EditInstructorForm'));
const AddInstructor = lazy(() => import('./views/instructor/AddInstructor'));

const ListCategory = lazy(() => import('./views/category/ListCategory'));
const EditCategory = lazy(() => import('./views/category/EditCategory'));
const AddCategory = lazy(() => import('./views/category/AddCategory'));

const ListCourse = lazy(() => import('./views/course/ListCourse'));
const EditCourse = lazy(() => import('./views/course/EditCourse'));
const AddCourse = lazy(() => import('./views/course/AddCourse'));

const AccountList = lazy(() => import('./views/account/AccountList'));
const AddAccountModal = lazy(() => import('./views/account/AddAccountModal'));

const RoleList = lazy(() => import('./views/UserManagement/Roles/RoleList'));

const Nvd3Chart = lazy(() => import('./views/charts/nvd3-chart'));
const GoogleMaps = lazy(() => import('./views/maps/GoogleMaps'));

const SamplePage = lazy(() => import('./views/extra/SamplePage'));

const routes = [
  {
    path: '/auth/signin',
    element: <SignIn1 />,
  },
  {
    path: '/auth/signup/signup1',
    element: <SignUp1 />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/auth/reset-password/:token',
    element: <ResetPassword />,
  },
  {
    path: '/app',
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: 'dashboard/default',
        element: <DashDefault />,
      },
      {
        path: 'ui-elements/basic/button',
        element: <BasicButton />,
      },
      {
        path: 'ui-elements/basic/badges',
        element: <BasicBadges />,
      },
      {
        path: 'ui-elements/basic/breadcrumb-paging',
        element: <BasicBreadcrumb />,
      },
      {
        path: 'ui-elements/basic/collapse',
        element: <BasicCollapse />,
      },
      {
        path: 'ui-elements/basic/tabs-pills',
        element: <BasicTabsPills />,
      },
      {
        path: 'ui-elements/basic/typography',
        element: <BasicTypography />,
      },
      {
        path: 'forms/form-basic',
        element: <FormsElements />,
      },
      // STUDENT
      {
        path: 'student/list-student',
        element: <ListStudent />,
      },
      {
        path: 'student/edit-student/:id',
        element: <EditStudent />,
      },
      {
        path: 'student/add-student/:accountId',
        element: <AddStudent />,
      },
      // INSTRUCTOR
      {
        path: 'instructor/list-instructor',
        element: <InstructorList />,
      },
      {
        path: 'instructor/edit-instructor/:instructorId',
        element: <EditInstructorForm />,
      },
      {
        path: 'instructor/add-instructor/:accountId',
        element: <AddInstructor />,
      },
      // CATEGORY
      {
        path: 'category/list-category',
        element: <ListCategory />,
      },
      {
        path: 'category/edit-category/:categoryId',
        element: <EditCategory />,
      },
      {
        path: 'category/add-category',
        element: <AddCategory />,
      },
      // COURSE
      {
        path: 'course/list-course',
        element: <ListCourse />,
      },
      {
        path: 'course/edit-course/:courseId',
        element: <EditCourse />,
      },
      {
        path: 'course/add-course/:accountId',
        element: <AddCourse />,
      },
      // ACCOUNT
      {
        path: 'account/list',
        element: <AccountList />,
      },
      {
        path: 'account/add',
        element: <AddAccountModal />,
      },
      // USER MANAGEMENT
      {
        path: 'usermanagement/roles/rolelist',
        element: <RoleList />,
      },
      // CHART & MAPS
      {
        path: 'charts/nvd3',
        element: <Nvd3Chart />,
      },
      {
        path: 'maps/google-map',
        element: <GoogleMaps />,
      },
      // EXTRA PAGES
      {
        path: 'sample-page',
        element: <SamplePage />,
      },
      // Redirect all unknown paths to dashboard
      {
        path: '*',
        element: <Navigate to={`${BASE_URL}/dashboard/default`} replace />,
      },
    ],
  },
  // Redirect root to dashboard
  {
    path: '/',
    element: <Navigate to={`${BASE_URL}/dashboard/default`} replace />,
  },
  // Catch-all route
  {
    path: '*',
    element: <Navigate to={`${BASE_URL}/dashboard/default`} replace />,
  },
];

const renderRoutes = (routesArray) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routesArray.map((route, index) => {
        if (route.children) {
          return (
            <Route key={index} path={route.path} element={route.element}>
              {renderRoutes(route.children)}
            </Route>
          );
        } else {
          return <Route key={index} path={route.path} element={route.element} />;
        }
      })}
    </Routes>
  </Suspense>
);

export default routes;
export { renderRoutes };
