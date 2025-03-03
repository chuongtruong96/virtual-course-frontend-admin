import React from 'react';
import { Box, Typography } from '@mui/material';
import TestManagementPanel from '../components/instructor/tests/TestManagementPanel';
import { useAuth } from '../contexts/AuthContext';

const TestManagement = () => {
  const { user } = useAuth();
  const instructorId = user?.id;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tests & Quizzes
      </Typography>
      <TestManagementPanel instructorId={instructorId} />
    </Box>
  );
};

export default TestManagement;