// src/pages/instructor/TestManagement.jsx
import React from 'react';
import { Container, Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Home, ChevronRight } from 'lucide-react';
import TestManagementPanel from '../../components/instructor/TestManagementPanel';
import { useAuth } from '../../hooks/useAuth';

const TestManagement = () => {
  const { user } = useAuth();
  const instructorId = user?.instructorId;

  return (
    <Container maxWidth="lg">
      <Box py={3}>
        <Breadcrumbs separator={<ChevronRight size={16} />} aria-label="breadcrumb" mb={3}>
          <Link href="/dashboard" color="inherit" display="flex" alignItems="center">
            <Home size={16} style={{ marginRight: 4 }} />
            Dashboard
          </Link>
          <Typography color="textPrimary">Test Management</Typography>
        </Breadcrumbs>

        <Typography variant="h4" gutterBottom>
          Test Management
        </Typography>
        
        <Box mt={3}>
          <TestManagementPanel instructorId={instructorId} />
        </Box>
      </Box>
    </Container>
  );
};

export default TestManagement;