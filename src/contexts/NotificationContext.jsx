// src/contexts/NotificationContext.jsx
import React, { createContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, variant = 'info', autoHide = true, delay = 5000) => {
        const id = Date.now();
        setToasts(prevToasts => [
            ...prevToasts,
            { id, message, variant, autoHide, delay }
        ]);
        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <NotificationContext.Provider value={{ 
            addNotification, 
            removeNotification, 
            clearAllNotifications,
            notifications,
            setNotifications
        }}>
            {children}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1070 }}>
                {toasts.map(toast => (
                    <Toast 
                        key={toast.id}
                        onClose={() => removeNotification(toast.id)}
                        show={true}
                        delay={toast.delay}
                        autohide={toast.autoHide}
                        bg={toast.variant}
                        className="mb-2"
                    >
                        <Toast.Header closeButton>
                            <strong className="me-auto">Notification</strong>
                        </Toast.Header>
                        <Toast.Body className={toast.variant === 'dark' ? 'text-white' : ''}>
                            {toast.message}
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </NotificationContext.Provider>
    );
};