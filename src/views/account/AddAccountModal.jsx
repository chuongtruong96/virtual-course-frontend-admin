// src/views/account/AddAccountModal.jsx

import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import accountService from '../../services/accountService';
import roleService from '../../services/roleService';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../contexts/NotificationContext';
import { FaSave, FaTimes } from 'react-icons/fa';
import AddInstructorModal from '../instructor/AddInstructor'; // Import AddInstructorModal

const AddAccountModal = ({ show, handleClose, addAccountToList }) => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const [error, setError] = useState(null);
  const [showAddInstructor, setShowAddInstructor] = useState(false);
  const [newAccountId, setNewAccountId] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: [],
    enable: true,
    verifiedEmail: false,
    authenticationType: 'LOCAL',
    type: '',
    status: 'active'
  });

  // Fetch roles using React Query
  const {
    data: rolesData,
    isLoading: isRolesLoading,
    isError: isRolesError,
    error: rolesError
  } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.fetchAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    enabled: show, // Only fetch when modal is open
    onError: (error) => {
      console.error('Error fetching roles:', error);
      setError('Failed to fetch roles. Please try again.');
    }
  });

  // Mutation for adding account
  const addAccountMutation = useMutation({
    mutationFn: (newAccount) => accountService.add(newAccount),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['accounts']);
      addAccountToList(data); // Thêm vào danh sách
      addNotification('Account created successfully!', 'success');

      // Redirect based trên roles
      if (data.roles.includes('INSTRUCTOR')) {
        handleClose(); // Close AddAccount modal
        setNewAccountId(data.id); // Lưu accountId để sử dụng trong AddInstructorModal
        setShowAddInstructor(true); // Mở AddInstructorModal
      } else if (data.roles.includes('STUDENT')) {
        handleClose(); // Close AddAccount modal
        navigate(`/dashboard/student/add-student/${data.id}`); // Redirect tới AddStudent
      } else {
        handleClose(); // Close AddAccount modal
      }
    },
    onError: (error) => {
      console.error('Error adding account:', error);
      setError('Failed to add account. Please try again.');
      addNotification('Failed to add account.', 'danger');
    },
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    if (name === 'roles') {
      // Handle multiple select
      const selectedRoles = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedRoles.push(options[i].value); // Đã thêm ROLE_ prefix trong value
        }
      }
      setFormData((prev) => ({ ...prev, roles: selectedRoles }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    addAccountMutation.mutate(formData);
  };

  // Reset form when modal closes
  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      roles: [],
      enable: true,
      verifiedEmail: false,
      authenticationType: 'LOCAL',
      type: '',
      status: 'active'
    });
    setError(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    if (!addAccountMutation.isLoading) {
      resetForm();
      handleClose();
    }
  };

  // Handle close AddInstructorModal
  const handleAddInstructorClose = () => {
    setShowAddInstructor(false);
    setNewAccountId(null);
  };

  return (
    <>
      <Modal show={show} onHide={handleModalClose} backdrop="static" keyboard={!addAccountMutation.isLoading}>
        <Modal.Header closeButton={!addAccountMutation.isLoading}>
          <Modal.Title>Add Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} aria-label="Add Account Form">
            {/* Username */}
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>
                Username <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
              />
            </Form.Group>

            {/* Email */}
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>
                Email <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter email" />
            </Form.Group>

            {/* Password */}
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>
                Password <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            </Form.Group>

            {/* Roles */}
            <Form.Group controlId="formRoles" className="mb-3">
              <Form.Label>Roles</Form.Label>
              <Form.Control
                as="select"
                multiple
                name="roles"
                value={formData.roles}
                onChange={handleChange}
                aria-label="Select Roles"
                disabled={isRolesLoading || isRolesError}
              >
                {isRolesLoading ? (
                  <option>Loading roles...</option>
                ) : isRolesError ? (
                  <option>Failed to load roles</option>
                ) : rolesData && Array.isArray(rolesData) && rolesData.length > 0 ? (
                  rolesData.map((role) => (
                    <option key={role.id} value={role.name.toUpperCase()}>
                      {role.name}
                    </option>
                  ))
                ) : (
                  <option>No roles available</option>
                )}
              </Form.Control>
              <Form.Text className="text-muted">Hold down the Ctrl (windows) or Command (Mac) button to select multiple options.</Form.Text>
            </Form.Group>

            {/* Authentication Type */}
            <Form.Group controlId="formAuthenticationType" className="mb-3">
              <Form.Label>Authentication Type</Form.Label>
              <Form.Control
                as="select"
                name="authenticationType"
                value={formData.authenticationType}
                onChange={handleChange}
                aria-label="Select Authentication Type"
              >
                <option value="LOCAL">Local</option>
                <option value="GOOGLE">Google</option>
                <option value="FACEBOOK">Facebook</option>
                {/* Add other authentication methods if needed */}
              </Form.Control>
            </Form.Group>

            {/* Status */}
            <Form.Group controlId="formStatus" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" name="status" value={formData.status} onChange={handleChange} required aria-label="Select Status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Control>
            </Form.Group>

            {/* Enable Account */}
            <Form.Group controlId="formEnable" className="mb-3">
              <Form.Check
                type="checkbox"
                label="Enable Account"
                name="enable"
                checked={formData.enable}
                onChange={(e) => setFormData((prev) => ({ ...prev, enable: e.target.checked }))}
                aria-label="Enable Account"
              />
            </Form.Group>

            {/* Verified Email */}
            <Form.Group controlId="formVerifiedEmail" className="mb-3">
              <Form.Check
                type="checkbox"
                label="Verified Email"
                name="verifiedEmail"
                checked={formData.verifiedEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, verifiedEmail: e.target.checked }))}
                aria-label="Verified Email"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose} disabled={addAccountMutation.isLoading} aria-label="Cancel">
            <FaTimes /> Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={addAccountMutation.isLoading || isRolesError} aria-label="Save">
            {addAccountMutation.isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Saving...
              </>
            ) : (
              <>
                <FaSave /> Save
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* AddInstructorModal */}
      {showAddInstructor && (
        <AddInstructorModal
          show={showAddInstructor}
          handleClose={handleAddInstructorClose}
          accountId={newAccountId}
        />
      )}
    </>
  );
};

export default AddAccountModal;
