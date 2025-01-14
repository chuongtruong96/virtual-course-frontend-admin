// src/contexts/NotificationContext.jsx

import React, { createContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid'; // Import UUID

// Create the NotificationContext
export const NotificationContext = createContext();

// NotificationProvider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]); // For NavRight aggregation
  const [toasts, setToasts] = useState([]); // For transient toasts

  // Function to add a notification
  const addNotification = useCallback((message, type = 'success') => {
    const id = uuidv4(); // Unique ID
    const newNotification = { id, message, type, timestamp: new Date() };
    setNotifications((prev) => [newNotification, ...prev]);

    // Also add a transient toast
    addToast(message, type);
  }, []);

  // Function to add a transient toast
  const addToast = useCallback((message, type = 'success') => {
    const id = uuidv4(); // Unique ID
    const newToast = { id, message, type };
    setToasts((prev) => [newToast, ...prev]);

    // Auto-remove the toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  // Function to remove a notification (from NavRight)
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}

      {/* Toast Container for Transient Notifications */}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id} // Unique key
            bg={toast.type}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            autohide
            delay={5000}
          >
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </NotificationContext.Provider>
  );
};
