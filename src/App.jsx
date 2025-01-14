// src/App.jsx

import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
// import defineRoutes from './defineRoutes';
import AppRoutes from './routes'; // Import AppRoutes thay vì renderRoutes

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
// <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
