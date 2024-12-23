// src/pages/admin/RoleManagement.jsx
import React from 'react';
import RoleList from '../../components/admin/RoleList';
import { Container } from 'react-bootstrap';

const RoleManagement = () => {
  return (
    <Container fluid className="p-4">
      <RoleList />
    </Container>
  );
};

export default RoleManagement;
