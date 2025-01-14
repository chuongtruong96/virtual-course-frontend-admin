// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from './contexts/ConfigContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Devtools

// Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Global SCSS
import './index.scss';

// React Query
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './queryClient'; // Import the QueryClient

/**
 * Tạo theme MUI tùy chỉnh
 */
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    success: { main: '#4caf50' },
    error: { main: '#f44336' }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif'
  }
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* 
          Gói ConfigProvider > AuthProvider > NotificationProvider > App 
          => đảm bảo context dùng chung
        */}
        <ConfigProvider>
          <AuthProvider>
            <NotificationProvider>
              <App /> {/* Render App, bao gồm BrowserRouter */}
            </NotificationProvider>
          </AuthProvider>
        </ConfigProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();
