// src/views/notification/NotificationList.jsx

import React, { useState, useEffect, useContext } from 'react';
import { fetchNotifications, markAsRead, deleteNotification } from '../../services/notificationService';
import { Table, Spinner, Alert, Button, Badge, Modal } from 'react-bootstrap';
import { NotificationContext } from '../../contexts/NotificationContext';

const NotificationList = () => {
  const { addNotification } = useContext(NotificationContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const userId = '';/* Lấy ID người dùng hiện tại từ context hoặc localStorage */
        const data = await fetchNotifications(userId);
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        addNotification('Failed to load notifications.', 'danger');
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, [addNotification]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif));
      addNotification('Notification marked as read.', 'success');
    } catch (err) {
      console.error("Error marking notification as read:", err);
      addNotification('Failed to mark as read.', 'danger');
    }
  };

  const handleDelete = (notification) => {
    setSelectedNotification(notification);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteNotification(selectedNotification.id);
      setNotifications(prev => prev.filter(notif => notif.id !== selectedNotification.id));
      addNotification('Notification deleted successfully.', 'success');
      setShowDeleteModal(false);
      setSelectedNotification(null);
    } catch (err) {
      console.error("Error deleting notification:", err);
      addNotification('Failed to delete notification.', 'danger');
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedNotification(null);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h3>Notification Management</h3>
      {notifications.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Content</th>
              <th>Type</th>
              <th>Sent At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(notif => (
              <tr key={notif.id}>
                <td>{notif.id}</td>
                <td>{notif.content}</td>
                <td>{notif.type}</td>
                <td>{new Date(notif.sentAt).toLocaleString()}</td>
                <td>
                  <Badge bg={notif.isRead ? 'secondary' : 'primary'}>
                    {notif.isRead ? 'Read' : 'Unread'}
                  </Badge>
                </td>
                <td>
                  {!notif.isRead && (
                    <Button variant="success" size="sm" className="me-2" onClick={() => handleMarkAsRead(notif.id)}>
                      Mark as Read
                    </Button>
                  )}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(notif)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No notifications found.</Alert>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this notification?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NotificationList;
