import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Divider } from '@mui/material';
import InstructorMetrics from '../metrics/InstructorMetrics';
import PerformanceMetrics from '../metrics/PerformanceMetrics';
import { useInstructorMetrics } from '../../../hooks/useInstructorMetrics';

const PerformanceTab = ({ instructor, instructorId }) => {
  const { 
    metrics, 
    isLoadingMetrics 
  } = useInstructorMetrics(instructorId);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Performance Overview
      </Typography>
      
      {/* Summary Metrics */}
      <Box mb={4}>
        <InstructorMetrics 
          instructor={instructor} 
          metrics={metrics} 
        />
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" gutterBottom>
        Detailed Performance Analysis
      </Typography>
      
      {/* Detailed Performance Charts */}
      <Box mt={2}>
        <PerformanceMetrics metrics={metrics} />
      </Box>
    </Box>
  );
};

PerformanceTab.propTypes = {
  instructor: PropTypes.object.isRequired,
  instructorId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
};

export default PerformanceTab;