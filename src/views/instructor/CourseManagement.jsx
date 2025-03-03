import React from 'react';
import { Box, Typography } from '@mui/material';
import CourseManagementPanel from '../components/instructor/courses/CourseManagementPanel';
import { useAuth } from '../contexts/AuthContext';

const CourseManagement = () => {
  const { user } = useAuth();
  const instructorId = user?.id;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Courses
      </Typography>
      <CourseManagementPanel instructorId={instructorId} />
    </Box>
  );
};

export default CourseManagement;