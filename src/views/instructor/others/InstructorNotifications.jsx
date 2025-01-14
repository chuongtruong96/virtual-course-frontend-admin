// src/components/InstructorNotifications.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotificationService from '../../../services/notificationService';
import { ListGroup, Spinner, Alert } from 'react-bootstrap';

const InstructorNotifications = () => {
  const { instructorId } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Giả sử bạn có endpoint để lấy thông báo của Instructor
        const notificationsData = await NotificationService.fetchNotificationsByInstructorId(instructorId);
        setNotifications(notificationsData);
      } catch (err) {
        setError(err.message || 'Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [instructorId]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (notifications.length === 0) {
    return <Alert variant="info">No notifications found.</Alert>;
  }

  return (
    <div>
      <h3>Notifications</h3>
      <ListGroup>
        {notifications.map(notification => (
          <ListGroup.Item key={notification.id}>
            <strong>{notification.type}:</strong> {notification.content} <br />
            <small>{new Date(notification.createdAt).toLocaleString()}</small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default InstructorNotifications;
