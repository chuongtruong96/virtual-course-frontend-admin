import React, { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Spinner, Alert, Button, Badge, Modal } from 'react-bootstrap';
import { NotificationContext } from '../../contexts/NotificationContext';
import NotificationService from '../../services/notificationService';

const NotificationList = () => {
  const { addNotification } = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [userId] = useState(''); // Replace this with the actual userId from context or localStorage

  // Fetch notifications
  const {
    data: notifications = [],
    isLoading,
    isError,
    error
  } = useQuery(['notifications', userId], () => NotificationService.fetchNotifications(userId), {
    onError: () => {
      addNotification('Failed to load notifications.', 'danger');
    }
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation(NotificationService.markAsRead, {
    onSuccess: () => {
      addNotification('Notification marked as read.', 'success');
      queryClient.invalidateQueries(['notifications', userId]);
    },
    onError: () => {
      addNotification('Failed to mark as read.', 'danger');
    }
  });

  // Delete mutation
  const deleteNotificationMutation = useMutation(NotificationService.deleteNotification, {
    onSuccess: () => {
      addNotification('Notification deleted successfully.', 'success');
      queryClient.invalidateQueries(['notifications', userId]);
      setShowDeleteModal(false);
      setSelectedNotification(null);
    },
    onError: () => {
      addNotification('Failed to delete notification.', 'danger');
    }
  });

  const handleMarkAsRead = (id) => {
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (notification) => {
    setSelectedNotification(notification);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedNotification) {
      deleteNotificationMutation.mutate(selectedNotification.id);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedNotification(null);
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (isError) {
    return <Alert variant="danger">{error?.message || 'Error fetching notifications.'}</Alert>;
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
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleMarkAsRead(notif.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(notif)}
                  >
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

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
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