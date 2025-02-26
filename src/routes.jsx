// // src/routes.jsx

// import React, { Suspense, lazy } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Loader from './components/Loader/Loader';
// import AdminLayout from './layouts/AdminLayout';
// import PrivateRoute from './utils/PrivateRoute';
// import { BASE_URL } from './config/constant';
// // import EditAccount from './views/account/EditAccount';

// // Lazy load components (đảm bảo đường dẫn đúng)
// const SignIn1 = lazy(() => import('./views/auth/signin/SignIn'));
// const SignUp1 = lazy(() => import('./views/auth/signup/SignUp'));
// const ForgotPassword = lazy(() => import('./views/auth/password/ForgotPassword'));
// const ResetPassword = lazy(() => import('./views/auth/password/ResetPassword'));
// const DashDefault = lazy(() => import('./views/dashboard'));
// //Default
// const BasicButton = lazy(() => import('./views/ui-elements/basic/BasicButton'));
// const BasicBadges = lazy(() => import('./views/ui-elements/basic/BasicBadges'));
// const BasicBreadcrumb = lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'));
// const BasicCollapse = lazy(() => import('./views/ui-elements/basic/BasicCollapse'));
// const BasicTabsPills = lazy(() => import('./views/ui-elements/basic/BasicTabsPills'));
// const BasicTypography = lazy(() => import('./views/ui-elements/basic/BasicTypography'));
// const FormsElements = lazy(() => import('./views/forms/FormsElements'));

// // Import các component khác tương tự...
// const ListStudent = lazy(() => import('./views/student/ListStudent'));
// const EditStudent = lazy(() => import('./views/student/EditStudent'));
// const AddStudent = lazy(() => import('./views/student/AddStudent'));

// const InstructorList = lazy(() => import('./views/instructor/InstructorList'));
// const EditInstructorForm = lazy(() => import('./views/instructor/EditInstructorForm'));
// const AddInstructor = lazy(() => import('./views/instructor/AddInstructor'));
// const InstructorDetail = lazy(() => import('./views/instructor/InstructorDetail'));

// // Các component cho Wallet, Transactions, Notifications, Reviews
// const InstructorWallet = lazy(() => import('./views/instructor/others/InstructorWallet'));
// const InstructorTransactions = lazy(() => import('./views/instructor/others/InstructorTransactions'));
// const InstructorNotifications = lazy(() => import('./views/instructor/others/InstructorNotifications'));
// const InstructorReviews = lazy(() => import('./views/instructor/others/InstructorReviews'));

// const ListCategory = lazy(() => import('./views/category/ListCategory'));
// const EditCategory = lazy(() => import('./views/category/EditCategory'));
// const AddCategory = lazy(() => import('./views/category/AddCategory'));

// const ListCourse = lazy(() => import('./views/course/ListCourse'));
// const EditCourse = lazy(() => import('./views/course/EditCourse'));
// const AddCourse = lazy(() => import('./views/course/AddCourse'));

// const AccountList = lazy(() => import('./views/account/AccountList'));

// // MỚI THÊM – Lazy load Review & Ticket
// const ListReview = lazy(() => import('./views/review/ListReview'));
// const AddReview = lazy(() => import('./views/review/AddReview'));

// const ListTicket = lazy(() => import('./views/ticket/ListTicket'));
// const AddTicket = lazy(() => import('./views/ticket/AddTicket'));
// //BANK_ACCOUNT
// // const ListBankAccount = lazy(() => import('./views/bankAccount/ListBankAccount'));
// // const AddBankAccount = lazy(() => import('./views/bankAccount/AddBankAccountModal'));
// // const EditBankAccount = lazy(() => import('./views/bankAccount/EditBankAccount'));
// // const BankAccountDetail = lazy(()=> import('./views/bankAccount/BankAccountDetail'));
// //WALLET
// const ListWallet = lazy(() => import('./views/wallet/ListWallet'));
// const TransactionHistory = lazy(() => import('./views/wallet/TransactionHistory'));
// //NOTIFICATION
// const NotificationList = lazy(() => import('./views/notification/NotificationList'));
// //ROLE
// const RoleList = lazy(() => import('./views/UserManagement/Roles/RoleList'));

// const Nvd3Chart = lazy(() => import('./views/charts/nvd3-chart'));
// const GoogleMaps = lazy(() => import('./views/maps/GoogleMaps'));

// const routes = [
//   {
//     path: '/auth/signin',
//     element: <SignIn1 />
//   },
//   {
//     path: '/auth/signup/signup1',
//     element: <SignUp1 />
//   },
//   {
//     path: '/auth/forgot-password',
//     element: <ForgotPassword />
//   },
//   {
//     path: '/auth/reset-password/:token',
//     element: <ResetPassword />
//   },
//   {
//     path: '/dashboard/*', // Sử dụng wildcard để bao phủ tất cả các con đường
//     element: (
//       <PrivateRoute>
//         <AdminLayout />
//       </PrivateRoute>
//     ),
//     children: [
//       {
//         path: 'default',
//         element: <DashDefault />
//       },
//       {
//         path: 'ui-elements/basic/button',
//         element: <BasicButton />
//       },
//       {
//         path: 'ui-elements/basic/badges',
//         element: <BasicBadges />
//       },
//       {
//         path: 'ui-elements/basic/breadcrumb-paging',
//         element: <BasicBreadcrumb />
//       },
//       {
//         path: 'ui-elements/basic/collapse',
//         element: <BasicCollapse />
//       },
//       {
//         path: 'ui-elements/basic/tabs-pills',
//         element: <BasicTabsPills />
//       },
//       {
//         path: 'ui-elements/basic/typography',
//         element: <BasicTypography />
//       },
//       {
//         path: 'forms/form-basic',
//         element: <FormsElements />
//       },
//       // ACCOUNT
//       {
//         path: 'account/list',
//         element: <AccountList />
//       },
//       // STUDENT
//       {
//         path: 'student/list-student',
//         element: <ListStudent />
//       },
//       {
//         path: 'student/edit-student/:id',
//         element: <EditStudent />
//       },
//       {
//         path: 'student/add-student/:accountId',
//         element: <AddStudent />
//       },
//       // INSTRUCTOR
//       {
//         path: 'instructor/list-instructor',
//         element: <InstructorList />
//       },
//       {
//         path: 'instructor/edit/:instructorId', // Sử dụng instructorId nếu backend sử dụng
//         element: <EditInstructorForm />
//       },
//       {
//         path: 'instructor/add-instructor/:accountId',
//         element: <AddInstructor />
//       },
//       {
//         path: 'instructor/detail/:instructorId',
//         element: <InstructorDetail />
//       },
//       // CATEGORY
//       {
//         path: 'category/list-category',
//         element: <ListCategory />
//       },
//       {
//         path: 'category/edit-category/:categoryId',
//         element: <EditCategory />
//       },
//       {
//         path: 'category/add-category',
//         element: <AddCategory />
//       },
//       // COURSE
//       {
//         path: 'course/list-course',
//         element: <ListCourse />
//       },
//       {
//         path: 'course/edit-course/:courseId',
//         element: <EditCourse />
//       },
//       {
//         path: 'course/add-course/:accountId',
//         element: <AddCourse />
//       },
   
//       {
//         path: 'usermanagement/roles/rolelist',
//         element: <RoleList />
//       },
//       // REVIEW
//       {
//         path: 'review',
//         children: [
//           { path: 'list/:courseId', element: <ListReview /> },
//           { path: 'add/:courseId', element: <AddReview /> }
//         ]
//       },

//       // TICKET
//       {
//         path: 'ticket',
//         children: [
//           // Ticket list
//           { path: 'list', element: <ListTicket /> },
//           // Ticket add
//           { path: 'add', element: <AddTicket /> }
//         ]
//       },
//       // Wallet routes
//       {
//         path: 'wallet/list',
//         element: <ListWallet />
//       },
//       {
//         path: 'wallet/transaction-history/:walletId',
//         element: <TransactionHistory />
//       },

//       // Notification routes
//       {
//         path: 'notification/list',
//         element: <NotificationList />
//       },
//       // CHART & MAPS
//       {
//         path: 'charts/nvd3',
//         element: <Nvd3Chart />
//       },
//       {
//         path: 'maps/google-map',
//         element: <GoogleMaps />
//       },
//       // INSTRUCTOR RELATED ROUTES
//       {
//         path: 'instructor/:instructorId/wallet',
//         element: <InstructorWallet /> 
//       },
//       {
//         path: 'instructor/:instructorId/transactions',
//         element: <InstructorTransactions /> 
//       },
//       {
//         path: 'instructor/:instructorId/notifications',
//         element: <InstructorNotifications /> 
//       },
//       {
//         path: 'instructor/:instructorId/reviews',
//         element: <InstructorReviews /> // Đảm bảo component này tồn tại
//       },
//       {
//         path: '*',
//         element: <Navigate to="/dashboard/default" replace />
//       }
//     ]
//   },
//   // Redirect root to dashboard
//   {
//     path: '/',
//     element: <Navigate to="/dashboard/default" replace />
//   },
//   // Catch-all route
//   {
//     path: '*',
//     element: <Navigate to="/dashboard/default" replace />
//   }
// ];

// const renderRoutes = (routesArray) => {
//   return routesArray.map((route, index) => {
//     const hasElement = !!route.element;
//     const hasPath = !!route.path;
//     console.log(`Route ${index}: path=${route.path}, element=${hasElement ? 'defined' : 'undefined'}`);

//     if (!hasElement && route.path !== '*') {
//       console.warn(`Warning: Route at index ${index} with path "${route.path}" is missing an element.`);
//     }

//     if (route.children) {
//       return (
//         <Route key={index} path={route.path} element={route.element}>
//           {renderRoutes(route.children)}
//         </Route>
//       );
//     } else {
//       return <Route key={index} path={route.path} element={route.element} />;
//     }
//   });
// };

// const AppRoutes = () => (
//   <Suspense fallback={<Loader />}>
//     <Routes>{renderRoutes(routes)}</Routes>
//   </Suspense>
// );

// export default AppRoutes;
