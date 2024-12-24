// src/index.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ConfigProvider } from './contexts/ConfigContext';
import { AuthProvider } from './contexts/AuthContext';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.scss';

// Tạo một theme tùy chỉnh cho Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Màu chính
    },
    secondary: {
      main: '#dc004e', // Màu phụ
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConfigProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
