import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  alpha,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Users,
  DollarSign,
  BarChart2,
  Star,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Download
} from 'lucide-react';

/**
 * Instructor Performance Metrics component displays top instructors and their metrics
 */
const InstructorPerformanceMetrics = ({ 
  instructorStatistics = [], 
  isLoading, 
  theme,
  onRefresh,
  onExport
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle refresh click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Handle export click
  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format currency values
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '0 VND';
    return `${value.toLocaleString()} VND`;
  };

  // Calculate instructor performance score (0-100)
  const calculatePerformanceScore = (instructor) => {
    if (!instructor) return 0;
    
    // This is a simplified scoring algorithm - can be adjusted based on business needs
    const courseWeight = 0.3;
    const studentWeight = 0.3;
    const transactionWeight = 0.2;
    const balanceWeight = 0.2;
    
    // Normalize each metric to a 0-100 scale
    // These max values should be adjusted based on your data
    const maxCourses = 20;
    const maxStudents = 1000;
    const maxTransactions = 500;
    const maxBalance = 10000000; // 10M VND
    
    const courseScore = Math.min(100, (instructor.totalPublishedCourses / maxCourses) * 100);
    const studentScore = Math.min(100, (instructor.totalStudents / maxStudents) * 100);
    const transactionScore = Math.min(100, ((instructor.totalDeposits + instructor.totalWithdrawals) / maxTransactions) * 100);
    const balanceScore = Math.min(100, (instructor.balance / maxBalance) * 100);
    
    // Calculate weighted score
    const performanceScore = (
      courseScore * courseWeight +
      studentScore * studentWeight +
      transactionScore * transactionWeight +
      balanceScore * balanceWeight
    );
    
    return Math.round(performanceScore);
  };

  // Get performance level based on score
  const getPerformanceLevel = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'success' };
    if (score >= 60) return { label: 'Good', color: 'primary' };
    if (score >= 40) return { label: 'Average', color: 'warning' };
    return { label: 'Needs Improvement', color: 'error' };
  };

  // Safely check if instructorStatistics is an array and has items
  const hasInstructors = Array.isArray(instructorStatistics) && instructorStatistics.length > 0;

  return (
    <Grid container spacing={3} sx={{ mt: 3 }}>
      <Grid item xs={12}>
        <Paper sx={{ borderRadius: 2, boxShadow: 3, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="medium">
              Instructor Performance
            </Typography>
            
            <Box display="flex" alignItems="center">
              {isLoading && (
                <CircularProgress size={20} color="primary" sx={{ mr: 2 }} />
              )}
              
              <Tooltip title="Export data">
                <IconButton 
                  onClick={handleExport} 
                  disabled={isLoading || !hasInstructors}
                  sx={{ mr: 1 }}
                >
                  <Download size={18} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Refresh data">
                <IconButton 
                  onClick={handleRefresh} 
                  disabled={isRefreshing || isLoading}
                  sx={{ 
                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                >
                  <RefreshCw size={18} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <CircularProgress />
            </Box>
          ) : !hasInstructors ? (
            <Box 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 2
              }}
            >
              <Award size={40} color={theme.palette.text.secondary} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                No instructor data available
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Instructor</TableCell>
                      <TableCell align="center">Courses</TableCell>
                      <TableCell align="center">Students</TableCell>
                      <TableCell align="center">Transactions</TableCell>
                      <TableCell align="right">Balance</TableCell>
                      <TableCell align="center">Performance</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {instructorStatistics
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((instructor) => {
                        const performanceScore = calculatePerformanceScore(instructor);
                        const performanceLevel = getPerformanceLevel(performanceScore);
                        
                        return (
                          <TableRow key={instructor.instructorId}>
                            <TableCell component="th" scope="row">
                              <Box display="flex" alignItems="center">
                                <Avatar 
                                  src={instructor.avatarImage} 
                                  alt={instructor.instructorName || ''}
                                  sx={{ width: 40, height: 40, mr: 2 }}
                                >
                                  {instructor.instructorName ? instructor.instructorName.charAt(0) : ''}
                                </Avatar>
                                <Box>
                                  <Typography variant="body1" fontWeight="medium">
                                    {instructor.instructorName || 'Unknown Instructor'}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    ID: {instructor.instructorId || 'N/A'}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="body2" fontWeight="medium">
                                  {instructor.totalPublishedCourses || 0}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {(instructor.totalPendingCourses || 0) > 0 && `+${instructor.totalPendingCourses} pending`}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight="medium">
                                {instructor.totalStudents || 0}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="body2" fontWeight="medium">
                                  {instructor.totalTransactions || 0}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <Chip 
                                    label={`${instructor.totalDeposits || 0} in`} 
                                    size="small" 
                                    color="success" 
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: '0.6rem' }}
                                  />
                                  <Chip 
                                    label={`${instructor.totalWithdrawals || 0} out`} 
                                    size="small" 
                                    color="secondary" 
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: '0.6rem' }}
                                  />
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="medium">
                                {formatCurrency(instructor.balance)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" flexDirection="column" alignItems="center">
                                <Box 
                                  sx={{ 
                                    width: 45, 
                                    height: 45, 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    bgcolor: alpha(theme.palette[performanceLevel.color].main, 0.1),
                                    border: `2px solid ${theme.palette[performanceLevel.color].main}`,
                                    mb: 0.5
                                  }}
                                >
                                  <Typography variant="body2" fontWeight="bold" color={`${performanceLevel.color}.main`}>
                                    {performanceScore}
                                  </Typography>
                                </Box>
                                <Chip 
                                  label={performanceLevel.label} 
                                  size="small" 
                                  color={performanceLevel.color}
                                  sx={{ height: 20, fontSize: '0.6rem' }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                variant="outlined"
                                size="small"
                                endIcon={<ChevronRight size={14} />}
                                component={Link}
                                to={`/dashboard/instructor/${instructor.instructorId || 'unknown'}`}
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={instructorStatistics.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="center">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<BarChart2 size={18} />}
              component={Link}
              to="/dashboard/instructor/statistics"
              sx={{ mr: 2 }}
            >
              View Instructor Analytics
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<TrendingUp size={18} />}
              component={Link}
              to="/dashboard/instructor/performance"
            >
              Performance Trends
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default InstructorPerformanceMetrics;