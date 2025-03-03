import React from 'react';
import { Box, Typography } from '@mui/material';
import ReviewManagementPanel from '../components/instructor/reviews/ReviewManagementPanel';
import { useAuth } from '../contexts/AuthContext';

const ReviewManagement = () => {
  const { user } = useAuth();
  const instructorId = user?.id;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Reviews
      </Typography>
      <ReviewManagementPanel instructorId={instructorId} />
    </Box>
  );
};

export default ReviewManagement;