// src/views/notification/NotificationForm.jsx

import React, { useState, useContext } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { createNotification } from '../../services/notificationService';
import { NotificationContext } from '../../contexts/NotificationContext';

const NotificationForm = () => {
  const { addNotification } = useContext(NotificationContext);
  const [formData, setFormData] = useState({
    userId: '',
    content: '',
    type: 'TRANSACTION', // Ví dụ: TRANSACTION, SYSTEM, etc.
    courseId: null,
    paymentId: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validation
    if (!formData.userId || !formData.content) {
      setError('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    try {
      const notificationData = {
        userId: parseInt(formData.userId),
        content: formData.content,
        type: formData.type,
        courseId: formData.courseId ? parseInt(formData.courseId) : null,
        paymentId: formData.paymentId ? parseInt(formData.paymentId) : null,
      };
      await createNotification(notificationData);
      addNotification('Notification created successfully!', 'success');
      setFormData({
        userId: '',
        content: '',
        type: 'TRANSACTION',
        courseId: null,
        paymentId: null,
      });
    } catch (err) {
      console.error("Error creating notification:", err);
      addNotification('Failed to create notification.', 'danger');
      setError('Failed to create notification.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h3>Create Notification</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUserId" className="mb-3">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="number"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            placeholder="Enter user ID"
          />
        </Form.Group>

        <Form.Group controlId="formContent" className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Enter notification content"
          />
        </Form.Group>

        <Form.Group controlId="formType" className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select name="type" value={formData.type} onChange={handleChange}>
            <option value="TRANSACTION">Transaction</option>
            <option value="SYSTEM">System</option>
            {/* Thêm các loại thông báo khác nếu cần */}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formCourseId" className="mb-3">
          <Form.Label>Course ID (Optional)</Form.Label>
          <Form.Control
            type="number"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            placeholder="Enter course ID"
          />
        </Form.Group>

        <Form.Group controlId="formPaymentId" className="mb-3">
          <Form.Label>Payment ID (Optional)</Form.Label>
          <Form.Control
            type="number"
            name="paymentId"
            value={formData.paymentId}
            onChange={handleChange}
            placeholder="Enter payment ID"
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? <Spinner as="span" animation="border" size="sm" /> : 'Create Notification'}
        </Button>
      </Form>
    </>
  );
};

export default NotificationForm;
