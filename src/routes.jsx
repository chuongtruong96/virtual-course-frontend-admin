// src/routes.jsx

import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/basic/BasicButton'))
      },
      {
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges'))
      },
      {
        path: '/basic/breadcrumb-paging',
        element: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'))
      },
      {
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      {
        path: '/forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements'))
      },
      // STUDENT
      {
        path: '/student/list-student',
        element: lazy(() => import('./views/student/ListStudent'))
      },
      {
        path: '/student/edit/:studentId',
        element: lazy(() => import('./views/student/EditStudent'))
      },
      {
        path: '/student/add-student/:accountId', 
        element: lazy(() => import('./views/student/AddStudent'))
      },
      // INSTRUCTOR
      {
        path: '/instructor/list-instructor',
        element: lazy(() => import('./views/instructor/InstructorList'))
      },
      {
        path: '/instructor/edit-instructor/:instructorId',
        element: lazy(() => import('./views/instructor/EditInstructorForm'))
      },
      {
        path: '/instructor/add-instructor/:accountId', 
        element: lazy(() => import('./views/instructor/AddInstructor'))
      },
      // CATEGORY
      {
        path: '/category/list-category',
        element: lazy(() => import('./views/category/ListCategory'))
      },
      {
        path: '/category/edit-category/:categoryId',
        element: lazy(() => import('./views/category/EditCategory'))
      },
      {
        path: '/category/add-category',
        element: lazy(() => import('./views/category/AddCategory'))
      },
      // COURSE
      {
        path: '/course/list-course',
        element: lazy(() => import('./views/course/ListCourse'))
      },
      {
        path: '/course/edit-course/:courseId',
        element: lazy(() => import('./views/course/EditCourse'))
      },
      {
        path: '/course/add-course/:accountId',
        element: lazy(() => import('./views/course/AddCourse'))
      },
      // ACCOUNT
      {
        path: '/account/list',
        element: lazy(() => import('./views/account/AccountList'))
      },
      {
        path: '/account/add',
        element: lazy(() => import('./views/account/AddAccountModal'))
      },
      // USER MANAGEMENT
      {
        path: '/usermanagement/roles/rolelist',
        element: lazy(() => import('./views/UserManagement/Roles/RoleList'))
      },
      // CHART & MAPS
      {
        path: '/charts/nvd3',
        element: lazy(() => import('./views/charts/nvd3-chart'))
      },
      {
        path: '/maps/google-map',
        element: lazy(() => import('./views/maps/GoogleMaps'))
      },
      // EXTRA PAGES
      {
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
