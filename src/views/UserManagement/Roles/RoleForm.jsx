// src/components/admin/RoleForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { addRole, editRole } from '../../../services/roleService';

const RoleForm = ({ role, onSuccess, onCancel }) => {
  const [name, setName] = useState(role ? role.name : '');
  const [description, setDescription] = useState(role ? role.description : '');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Basic validation
    if (!name) {
      setError('Role name is required.');
      setSubmitting(false);
      return;
    }

    const roleData = {
      name,
      description,
    };

    try {
      if (role) {
        // Edit existing role
        const updatedRole = await editRole(role.id, roleData);
        onSuccess(updatedRole);
      } else {
        // Create new role
        const newRole = await addRole(roleData);
        onSuccess(newRole);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Display error if any */}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3" controlId="roleName">
        <Form.Label>Role Name</Form.Label>
        <Form.Select value={name} onChange={(e) => setName(e.target.value)}>
          <option value="">Select Role</option>
          <option value="ADMIN">ADMIN</option>
          <option value="INSTRUCTOR">INSTRUCTOR</option>
          <option value="STUDENT">STUDENT</option>
          {/* Add more roles as needed */}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="roleDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter role description (optional)"
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </Form>
  );
};

export default RoleForm;
