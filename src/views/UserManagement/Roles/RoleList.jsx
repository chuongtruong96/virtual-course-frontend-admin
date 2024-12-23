// src/components/admin/RoleList.jsx
import React, { useState, useEffect } from 'react';
import { fetchRoles, deleteRole } from '../../../services/roleService';
import { Row, Col, Card, Table, Button, Spinner, Alert, Dropdown, Modal } from 'react-bootstrap';
import RoleForm from './RoleForm';
import '../../../styles/table.css'; // Import your custom CSS

const RoleList = () => {
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null); // For editing

  // Fetch roles on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRoles();
        setRoleData(data);
      } catch (error) {
        setNotification({
          message: 'Failed to load roles. Please try again later.',
          type: 'danger'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle delete role
  const handleDeleteRole = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(id);
        setRoleData((prevData) => prevData.filter((role) => role.id !== id));
        setNotification({
          message: 'Role deleted successfully!',
          type: 'success'
        });
      } catch (error) {
        setNotification({
          message: 'Failed to delete role. Please try again.',
          type: 'danger'
        });
      }
    }
  };

  // Handle show modal for create or edit
  const handleShowModal = (role = null) => {
    setCurrentRole(role);
    setShowModal(true);
  };

  // Handle hide modal
  const handleHideModal = () => {
    setCurrentRole(null);
    setShowModal(false);
  };

  // Handle role created or updated
  const handleRoleUpdate = (updatedRole) => {
    if (currentRole) {
      // Editing existing role
      setRoleData((prevData) => prevData.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
      setNotification({
        message: 'Role updated successfully!',
        type: 'success'
      });
    } else {
      // Creating new role
      setRoleData((prevData) => [...prevData, updatedRole]);
      setNotification({
        message: 'Role created successfully!',
        type: 'success'
      });
    }
    handleHideModal();
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading roles...</p>
      </div>
    );
  }

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title as="h5">Role Management</Card.Title>
            <Button variant="primary" onClick={() => handleShowModal()}>
              Add New Role
            </Button>
          </Card.Header>
          <Card.Body>
            {/* Display notifications */}
            {notification && <Alert variant={notification.type}>{notification.message}</Alert>}

            {/* Table */}
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roleData.length > 0 ? (
                  roleData.map((role) => (
                    <tr key={role.id}>
                      <td>{role.id}</td>
                      <td>{role.name}</td>
                      <td>{role.description || 'N/A'}</td>
                      <td>
                        <Button variant="info" size="sm" className="me-2" onClick={() => handleShowModal(role)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteRole(role.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No roles found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination can be added here if needed */}
          </Card.Body>
        </Card>
      </Col>

      {/* Modal for Create/Edit Role */}
      <Modal show={showModal} onHide={handleHideModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentRole ? 'Edit Role' : 'Add New Role'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RoleForm role={currentRole} onSuccess={handleRoleUpdate} onCancel={handleHideModal} />
        </Modal.Body>
      </Modal>
    </Row>
  );
};

export default RoleList;
