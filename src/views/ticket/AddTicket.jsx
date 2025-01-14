// src/views/ticket/AddTicket.jsx
import React, { useState } from 'react';
import ticketService from '../../services/ticketService';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const AddTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creatorAccountId, setCreatorAccountId] = useState(0); // Lấy từ context?
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        title,
        description,
        creatorAccountId
      };
      await ticketService.createTicket(data);
      setNotification({ type: 'success', message: 'Ticket created successfully' });
      setTitle('');
      setDescription('');
    } catch (error) {
      setNotification({ type: 'danger', message: 'Failed to create ticket' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create a Support Ticket</h2>
      {notification && <Alert variant={notification.type}>{notification.message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
          />
        </Form.Group>
        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control 
            as="textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required 
          />
        </Form.Group>
        <Form.Group controlId="formCreator" className="mb-3">
          <Form.Label>Creator Account Id</Form.Label>
          <Form.Control
            type="number"
            value={creatorAccountId}
            onChange={(e) => setCreatorAccountId(parseInt(e.target.value))}
            required
          />
        </Form.Group>
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Create Ticket'}
        </Button>
      </Form>
    </div>
  );
};

export default AddTicket;
