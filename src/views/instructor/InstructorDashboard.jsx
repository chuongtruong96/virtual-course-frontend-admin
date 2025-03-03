// src/components/instructor/InstructorDashboard.jsx
import React from 'react';
import { Grid, Box } from '@mui/material';
import { useInstructorDashboard } from '../../hooks/useInstructorDashboard';
import { useInstructorMetrics } from '../../hooks/useInstructorMetrics';
import StatisticsPanel from './StatisticsPanel';
import PerformanceMetrics from './PerformanceMetrics';
import CourseManagementPanel from './CourseManagementPanel';
import TestManagementPanel from './TestManagementPanel';
import ReviewManagementPanel from './ReviewManagementPanel';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const InstructorDashboard = ({ instructorId }) => {
  const {
    dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    timeRange,
    changeTimeRange
  } = useInstructorDashboard(instructorId);

  const {
    metrics,
    isLoadingMetrics,
    metricsError
  } = useInstructorMetrics(instructorId);

  if (isDashboardLoading || isLoadingMetrics) {
    return <LoadingSpinner />;
  }

  if (dashboardError || metricsError) {
    return <ErrorAlert error={dashboardError || metricsError} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Statistics Overview */}
        <Grid item xs={12}>
          <StatisticsPanel 
            data={dashboardData}
            timeRange={timeRange}
            onTimeRangeChange={changeTimeRange}
          />
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <PerformanceMetrics metrics={metrics} />
        </Grid>

        {/* Course Management */}
        <Grid item xs={12}>
          <CourseManagementPanel instructorId={instructorId} />
        </Grid>

        {/* Test Management */}
        <Grid item xs={12}>
          <TestManagementPanel instructorId={instructorId} />
        </Grid>

        {/* Review Management */}
        <Grid item xs={12}>
          <ReviewManagementPanel instructorId={instructorId} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InstructorDashboard;