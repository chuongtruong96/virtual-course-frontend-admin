// src/App.jsx
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter } from 'react-router-dom';

import routes, { renderRoutes } from './routes';

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
      {renderRoutes(routes)}
    </BrowserRouter>
  );
};

export default App;
