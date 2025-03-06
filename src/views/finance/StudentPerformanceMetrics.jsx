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
  TablePagination,
  LinearProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Users,
  CheckCircle,
  BarChart2,
  Star,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Download,
  Clock,
  FileText
} from 'lucide-react';

/**
 * Student Performance Metrics component displays top students and their metrics
 */
const StudentPerformanceMetrics = ({ 
  studentStatistics = null, 
  isLoading = false, 
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

  // Safely get student statistics
  const getStudentStats = () => {
    if (!studentStatistics) return {
      totalQuizzes: 0,
      totalCompletedCourses: 0,
      averageScore: 0,
      topStudents: []
    };
    
    return {
      totalQuizzes: studentStatistics.totalQuizzes || 0,
      totalCompletedCourses: studentStatistics.totalCompletedCourses || 0,
      averageScore: studentStatistics.averageScore || 0,
      topStudents: Array.isArray(studentStatistics.topStudents) ? studentStatistics.topStudents : []
    };
  };

  const stats = getStudentStats();

  // Format time duration (minutes to hours:minutes)
  const formatDuration = (minutes) => {
    if (minutes === undefined || minutes === null) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Calculate completion percentage
  const calculateCompletionPercentage = (student) => {
    if (!student) return 0;
    if (student.totalEnrolledCourses === 0) return 0;
    return Math.round((student.completedCourses / student.totalEnrolledCourses) * 100);
  };

  // Get performance level based on score
  const getPerformanceLevel = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'success' };
    if (score >= 75) return { label: 'Good', color: 'primary' };
    if (score >= 60) return { label: 'Average', color: 'warning' };
    return { label: 'Needs Improvement', color: 'error' };
  };

  // Check if we have valid student data
  const hasStudents = stats.topStudents.length > 0;

  return (
    <Grid container spacing={3} sx={{ mt: 3 }}>
      <Grid item xs={12}>
        <Paper sx={{ borderRadius: 2, boxShadow: 3, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="medium">
              Student Performance
            </Typography>
            
            <Box display="flex" alignItems="center">
              {isLoading && (
                <CircularProgress size={20} color="primary" sx={{ mr: 2 }} />
              )}
              
              <Tooltip title="Export data">
                <IconButton 
                  onClick={handleExport} 
                  disabled={isLoading || !hasStudents}
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

          {/* Summary Statistics */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <FileText size={24} color={theme.palette.primary.main} />
                <Typography variant="h5" fontWeight="bold" mt={1}>
                  {isLoading ? <CircularProgress size={24} /> : stats.totalQuizzes}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Quizzes Taken
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                }}
              >
                <CheckCircle size={24} color={theme.palette.success.main} />
                <Typography variant="h5" fontWeight="bold" mt={1}>
                  {isLoading ? <CircularProgress size={24} /> : stats.totalCompletedCourses}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Completed Courses
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.warning.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                }}
              >
                <Award size={24} color={theme.palette.warning.main} />
                <Typography variant="h5" fontWeight="bold" mt={1}>
                  {isLoading ? <CircularProgress size={24} /> : `${stats.averageScore}%`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Average Quiz Score
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <CircularProgress />
            </Box>
          ) : !hasStudents ? (
            <Box 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                borderRadius: 2
              }}
            >
              <Users size={40} color={theme.palette.text.secondary} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                No student performance data available
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell align="center">Enrolled Courses</TableCell>
                      <TableCell align="center">Completion</TableCell>
                      <TableCell align="center">Study Time</TableCell>
                      <TableCell align="center">Avg. Score</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.topStudents
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((student) => {
                        const completionPercentage = calculateCompletionPercentage(student);
                        const performanceLevel = getPerformanceLevel(student.averageScore || 0);
                        
                        return (
                          <TableRow key={student.studentId}>
                            <TableCell component="th" scope="row">
                              <Box display="flex" alignItems="center">
                                <Avatar 
                                  src={student.avatarImage} 
                                  alt={student.studentName || ''}
                                  sx={{ width: 40, height: 40, mr: 2 }}
                                >
                                  {student.studentName ? student.studentName.charAt(0) : ''}
                                </Avatar>
                                <Box>
                                  <Typography variant="body1" fontWeight="medium">
                                    {student.studentName || 'Unknown Student'}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    ID: {student.studentId || 'N/A'}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="body2" fontWeight="medium">
                                  {student.totalEnrolledCourses || 0}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {student.completedCourses || 0} completed
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ width: '100%', maxWidth: 120, mx: 'auto' }}>
                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                  <Typography variant="caption" color="textSecondary">
                                    Progress
                                  </Typography>
                                  <Typography variant="caption" fontWeight="bold">
                                    {completionPercentage}%
                                  </Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={completionPercentage} 
                                  sx={{ 
                                    height: 8, 
                                    borderRadius: 4,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                  }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center">
                                <Clock size={16} color={theme.palette.text.secondary} style={{ marginRight: 4 }} />
                                <Typography variant="body2">
                                  {formatDuration(student.totalStudyTimeMinutes)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={`${student.averageScore || 0}%`} 
                                size="small" 
                                color={performanceLevel.color}
                                sx={{ fontWeight: 'bold' }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                variant="outlined"
                                size="small"
                                endIcon={<ChevronRight size={14} />}
                                component={Link}
                                to={`/dashboard/student/${student.studentId || 'unknown'}`}
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
                count={stats.topStudents.length}
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
              to="/dashboard/student/statistics"
              sx={{ mr: 2 }}
            >
              View Student Analytics
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<TrendingUp size={18} />}
              component={Link}
              to="/dashboard/student/performance"
            >
              Performance Trends
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default StudentPerformanceMetrics;