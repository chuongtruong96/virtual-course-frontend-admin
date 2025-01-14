// src/components/admin/RoleList.jsx

import React, { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import roleService from '../../../services/roleService';
import { Row, Col, Card, Table, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import RoleForm from './RoleForm';
// import '../../../styles/RoleList.css'; // Import your custom CSS
import { NotificationContext } from '../../../contexts/NotificationContext';

const RoleList = () => {
  const { addNotification } = useContext(NotificationContext);
  const queryClient = useQueryClient();

  // State cho modal Add/Edit Role
  const [showModal, setShowModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null); // Role hiện tại để chỉnh sửa

  // Fetch roles using React Query v5
  const { data: roles, isLoading, isError, error } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.fetchAll, // Truyền trực tiếp phương thức fetchAll
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 2, // Retry failed requests twice
  });

  // Mutation for deleting a role
  const deleteMutation = useMutation({
    mutationFn: ({ id }) => roleService.deleteRole({ id, signal: undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      addNotification('Role deleted successfully!', 'success');
    },
    onError: (error) => {
      console.error('Error deleting role:', error);
      addNotification('Failed to delete role. Please try again.', 'danger');
    },
  });

  // Hàm xử lý xóa role
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      deleteMutation.mutate({ id });
    }
  };

  // Hàm mở modal Add/Edit Role
  const handleShowModal = (role = null) => {
    setCurrentRole(role);
    setShowModal(true);
  };

  // Hàm đóng modal
  const handleHideModal = () => {
    setCurrentRole(null);
    setShowModal(false);
  };

  // Hàm xử lý khi thêm hoặc chỉnh sửa thành công
  const handleRoleSuccess = (role) => {
    addNotification(`Role ${currentRole ? 'updated' : 'created'} successfully!`, 'success');
    handleHideModal();
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" aria-label="Loading Roles">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading roles...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="danger">
        {error?.message || 'Failed to load roles. Please try again later.'}
      </Alert>
    );
  }

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title as="h5">Role Management</Card.Title>
            <Button variant="primary" onClick={() => handleShowModal()} aria-label="Add New Role">
              Add New Role
            </Button>
          </Card.Header>
          <Card.Body>
            {/* Roles Table */}
            <Table striped bordered hover responsive aria-label="Role Management Table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <tr key={role.id}>
                      <td>{role.id}</td>
                      <td>{role.name}</td>
                      <td>{role.description || 'N/A'}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowModal(role)}
                          aria-label={`Edit Role ${role.name}`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(role.id)}
                          aria-label={`Delete Role ${role.name}`}
                          disabled={deleteMutation.isLoading}
                        >
                          {deleteMutation.isLoading ? (
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                          ) : (
                            'Delete'
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No roles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>

      {/* Modal for Add/Edit Role */}
      <Modal show={showModal} onHide={handleHideModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentRole ? 'Edit Role' : 'Add New Role'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RoleForm
            role={currentRole}
            onSuccess={handleRoleSuccess}
            onCancel={handleHideModal}
          />
        </Modal.Body>
      </Modal>
    </Row>
  );
};

export default RoleList;
