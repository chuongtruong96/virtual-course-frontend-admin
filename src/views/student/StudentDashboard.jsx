import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Box, useTheme, Alert, Snackbar } from '@mui/material';
import StudentPerformanceMetrics from '../finance/StudentPerformanceMetrics';
import StudentPerformanceService from '../../services/StudentPerformanceService';

/**
 * Student Dashboard component that displays student performance metrics
 */
const StudentDashboard = () => {
  const theme = useTheme();
  const [studentStatistics, setStudentStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Fetch student performance data on component mount
  useEffect(() => {
    fetchStudentPerformanceData();
  }, []);

  // Fetch student performance data from the API
  const fetchStudentPerformanceData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await StudentPerformanceService.getStudentPerformanceStatistics();
      setStudentStatistics(data);
    } catch (error) {
      console.error('Error fetching student performance data:', error);
      setError('Failed to load student performance data. Please try again later.');
      setSnackbar({
        open: true,
        message: 'Failed to load student performance data',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await StudentPerformanceService.refreshStudentPerformanceData();
      setStudentStatistics(data);
      setSnackbar({
        open: true,
        message: 'Student performance data refreshed successfully',
        severity: 'success'
      });
      return true;
    } catch (error) {
      console.error('Error refreshing student performance data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to refresh student performance data',
        severity: 'error'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle export button click
  const handleExport = () => {
    StudentPerformanceService.exportStudentPerformanceData()
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Student performance data exported successfully',
          severity: 'success'
        });
      })
      .catch(error => {
        console.error('Error exporting student performance data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to export student performance data',
          severity: 'error'
        });
      });
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {isLoading && !studentStatistics ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        ) : (
          <StudentPerformanceMetrics
            studentStatistics={studentStatistics}
            isLoading={isLoading}
            theme={theme}
            onRefresh={handleRefresh}
            onExport={handleExport}
          />
        )}
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default StudentDashboard;