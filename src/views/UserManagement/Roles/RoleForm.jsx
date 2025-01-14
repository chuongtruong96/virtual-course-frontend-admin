// src/components/admin/RoleForm.jsx

import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { NotificationContext } from '../../../contexts/NotificationContext';
import roleService from '../../../services/roleService';

const RoleForm = ({ role, onSuccess, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: role || {
      name: '',
      description: '',
    },
  });

  const [submissionError, setSubmissionError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { addNotification } = useContext(NotificationContext);

  const onSubmitForm = async (data) => {
    setSubmitting(true);
    setSubmissionError(null);
    try {
      if (role) {
        // Chỉnh sửa role hiện tại
        const updatedRole = await roleService.edit({ id: role.id, data, signal: undefined }); // Sửa cú pháp
        addNotification('Role updated successfully!', 'success');
        onSuccess(updatedRole);
      } else {
        // Thêm role mới
        const newRole = await roleService.add(data);
        addNotification('Role created successfully!', 'success');
        onSuccess(newRole);
        reset(); // Reset form sau khi thêm thành công
      }
    } catch (error) {
      console.error('Error saving role:', error);
      setSubmissionError('An error occurred while saving the role. Please try again.');
      addNotification('Failed to save role. Please try again.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmitForm)} aria-label={role ? 'Edit Role Form' : 'Add Role Form'}>
      {submissionError && <Alert variant="danger">{submissionError}</Alert>}

      <Form.Group controlId="roleName" className="mb-3">
        <Form.Label>
          Role Name <span style={{ color: 'red' }}>*</span>
        </Form.Label>
        <Form.Select
          {...register('name', { required: true })}
          isInvalid={errors.name}
          aria-required="true"
        >
          <option value="">Select Role</option>
          <option value="ADMIN">ADMIN</option>
          <option value="INSTRUCTOR">INSTRUCTOR</option>
          <option value="STUDENT">STUDENT</option>
          {/* Add more roles as needed */}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          Role name is required.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="roleDescription" className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter role description (optional)"
          {...register('description')}
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button
          variant="secondary"
          onClick={onCancel}
          className="me-2"
          disabled={submitting}
          aria-label="Cancel"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={submitting}
          aria-label="Save Role"
        >
          {submitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </Form>
  );
};

RoleForm.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.number, // Thêm prop id nếu cần
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RoleForm;
