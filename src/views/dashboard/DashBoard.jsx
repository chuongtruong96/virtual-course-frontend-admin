import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Button, 
  FormControl, 
  Select, 
  MenuItem, 
  IconButton, 
  Chip, 
  Divider, 
  Tooltip, 
  CircularProgress, 
  Alert, 
  Paper, 
  Badge,
  Tab,
  Tabs,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useAdminDashboard from '../../hooks/useAdminDashboard';
import useNotifications from '../../hooks/useNotifications';
import useAdminReviews from '../../hooks/useAdminReviews';
import StatisticsChart from '../../components/statistics/StatisticsChart';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Grid as GridIcon, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Star,
  Bell,
  Calendar,
  DollarSign,
  BarChart2,
  Activity,
  Eye,
  Clock,
  RefreshCw,
  Filter,
  ChevronRight,
  MessageCircle,
  Award,
  AlertCircle,
  Download,
  FileText,
  MoreVertical,
  Settings,
  PieChart,
  LineChart,
  BarChart
} from 'lucide-react';
import { format, parseISO, isToday, isThisWeek, isThisMonth, subMonths } from 'date-fns';

// Custom components
const StatsCard = ({ title, count, icon, trend, trendUp, color, onClick }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: theme.shadows[10] }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        sx={{ 
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          cursor: onClick ? 'pointer' : 'default',
          boxShadow: theme.shadows[3],
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            backgroundColor: theme.palette[color].main
          }
        }}
        onClick={onClick}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Avatar 
              sx={{ 
                bgcolor: alpha(theme.palette[color].main, 0.1), 
                color: theme.palette[color].main,
                width: 56,
                height: 56,
                borderRadius: 2
              }}
            >
              {icon}
            </Avatar>
            <Box textAlign="right">
              <Typography variant="h4" component="div" fontWeight="bold">
                {count?.toLocaleString() || 0}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {title}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mt={2}>
            {trendUp ? 
              <TrendingUp size={16} color={theme.palette.success.main} /> : 
              <TrendingDown size={16} color={theme.palette.error.main} />
            }
            <Typography
              variant="body2"
              color={trendUp ? "success.main" : "error.main"}
              sx={{ ml: 1, fontWeight: 'medium' }}
            >
              {trend} {trendUp ? 'increase' : 'decrease'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ApprovalItem = ({ item, onApprove, onReject, type }) => {
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [rejectionDialog, setRejectionDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const theme = useTheme();
  
  const handleApprove = () => {
    onApprove({ 
      [type === 'course' ? 'courseId' : 'instructorId']: item.id, 
      notes 
    });
    setApprovalDialog(false);
  };
  
  const handleReject = () => {
    onReject({ 
      [type === 'course' ? 'courseId' : 'instructorId']: item.id, 
      reason 
    });
    setRejectionDialog(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper 
        elevation={1} 
        sx={{ 
          mb: 2, 
          p: 2, 
          borderRadius: 2,
          transition: 'all 0.3s',
          '&:hover': {
            boxShadow: 3,
            transform: 'translateY(-2px)'
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {type === 'course' ? item.titleCourse : `${item.firstName || ''} ${item.lastName || ''}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {type === 'course' 
                ? `By ${item.instructorFirstName || ''} ${item.instructorLastName || ''}`
                : item.email
              }
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Submitted: {item.createdAt ? format(parseISO(item.createdAt), 'MMM dd, yyyy') : 'N/A'}
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Approve">
              <Button
                size="small"
                variant="outlined"
                startIcon={<CheckCircle size={16} />}
                color="success"
                onClick={() => setApprovalDialog(true)}
                sx={{ mr: 1 }}
              >
                Approve
              </Button>
            </Tooltip>
            <Tooltip title="Reject">
              <Button
                size="small"
                variant="outlined"
                startIcon={<XCircle size={16} />}
                color="error"
                onClick={() => setRejectionDialog(true)}
              >
                Reject
              </Button>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Approval Dialog */}
        <Dialog open={approvalDialog} onClose={() => setApprovalDialog(false)}>
          <DialogTitle>Approve {type === 'course' ? 'Course' : 'Instructor'}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" paragraph>
              Are you sure you want to approve this {type}?
            </Typography>
            <TextField
              label="Notes (Optional)"
              multiline
              rows={3}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              variant="outlined"
              placeholder="Add any notes about this approval"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApprovalDialog(false)}>Cancel</Button>
            <Button onClick={handleApprove} color="success" variant="contained">
              Approve
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Rejection Dialog */}
        <Dialog open={rejectionDialog} onClose={() => setRejectionDialog(false)}>
          <DialogTitle>Reject {type === 'course' ? 'Course' : 'Instructor'}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" paragraph>
              Please provide a reason for rejection:
            </Typography>
            <TextField
              label="Reason for Rejection"
              multiline
              rows={3}
              fullWidth
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              variant="outlined"
              placeholder="Explain why this is being rejected"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectionDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleReject} 
              color="error" 
              variant="contained"
              disabled={!reason.trim()}
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  );
};

const ReviewItem = ({ review }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Box display="flex" alignItems="flex-start">
        <Avatar 
          src={review.studentAvatar} 
          alt={review.studentName}
          sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
        >
          {review.studentName?.charAt(0) || 'U'}
        </Avatar>
        <Box flex={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" fontWeight="bold">
              {review.studentName || `Student ${review.studentId}`}
            </Typography>
            <Box>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  fill={i < review.rating ? theme.palette.warning.main : 'transparent'} 
                  stroke={i < review.rating ? theme.palette.warning.main : theme.palette.text.disabled}
                />
              ))}
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            for <Link to={`/dashboard/course/detail/${review.courseId}`} style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
              {review.courseTitle || `Course ${review.courseId}`}
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {review.comment}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {format(parseISO(review.createdAt), 'MMM dd, yyyy')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const NotificationItem = ({ notification }) => {
  const theme = useTheme();
  
  // Determine icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'course_approval':
      case 'CourseApprv':
        return <BookOpen size={16} />;
      case 'instructor_approval':
      case 'InstApprv':
        return <Users size={16} />;
      case 'review':
      case 'Review':
        return <Star size={16} />;
      case 'payment':
      case 'Payment':
        return <DollarSign size={16} />;
      default:
        return <Bell size={16} />;
    }
  };
  
  // Format the time
  const getTimeDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = parseISO(dateString);
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE, h:mm a');
    } else {
      return format(date, 'MMM dd, yyyy');
    }
  };
  
  // Determine notification color
  const getNotificationColor = () => {
    switch (notification.type) {
      case 'course_approval':
      case 'CourseApprv':
        return 'success';
      case 'instructor_approval':
      case 'InstApprv':
        return 'info';
      case 'review':
      case 'Review':
        return 'warning';
      case 'payment':
      case 'Payment':
        return 'primary';
      default:
        return 'primary';
    }
  };
  
  return (
    <Box 
      sx={{ 
        mb: 2, 
        p: 2, 
        bgcolor: notification.read ? 'background.paper' : alpha(theme.palette.primary.light, 0.1), 
        borderRadius: 2,
        boxShadow: 1,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 2,
          bgcolor: notification.read ? alpha(theme.palette.background.paper, 0.8) : alpha(theme.palette.primary.light, 0.15)
        }
      }}
    >
      <Box display="flex" alignItems="flex-start">
        <Avatar 
          sx={{ 
            mr: 2, 
            bgcolor: alpha(theme.palette[getNotificationColor()].main, 0.1),
            color: theme.palette[getNotificationColor()].main,
            width: 40,
            height: 40
          }}
        >
          {getIcon()}
        </Avatar>
        <Box flex={1}>
          <Typography variant="subtitle2" fontWeight={notification.read ? 'regular' : 'bold'}>
            {notification.title || 'Notification'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {notification.content || notification.message}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {getTimeDisplay(notification.createdAt)}
          </Typography>
        </Box>
        {!notification.read && (
          <Chip 
            label="New" 
            size="small" 
            color="primary" 
            sx={{ height: 20, fontSize: '0.7rem' }} 
          />
        )}
      </Box>
    </Box>
  );
};

// Chart card component with options menu
const ChartCard = ({ title, subtitle, children, height = 300, chartType = "line" }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const getChartIcon = () => {
    switch(chartType.toLowerCase()) {
      case 'line':
        return <LineChart size={16} />;
      case 'bar':
        return <BarChart size={16} />;
      case 'pie':
        return <PieChart size={16} />;
      default:
        return <BarChart2 size={16} />;
    }
  };
  
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box>
            <Typography variant="h6" fontWeight="medium">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box>
            <Tooltip title="Chart options">
              <IconButton
                size="small"
                onClick={handleClick}
                aria-controls={open ? "chart-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <MoreVertical size={18} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Menu
          id="chart-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'chart-button',
          }}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              {getChartIcon()}
            </ListItemIcon>
            <ListItemText>Change Chart Type</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Download size={16} />
            </ListItemIcon>
            <ListItemText>Export as PDF</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <FileText size={16} />
            </ListItemIcon>
            <ListItemText>Export Data</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings size={16} />
            </ListItemIcon>
            <ListItemText>Chart Settings</ListItemText>
          </MenuItem>
        </Menu>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ height: height }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

const DashDefault = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('allTime');
  const [modelFilter, setModelFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  // Use the hooks
  const {
    statistics,
    trends,
    pendingCourses,
    pendingInstructors,
    isLoading,
    isError,
    error,
    approveCourse,
    rejectCourse,
    approveInstructor,
    rejectInstructor,
    refetch
  } = useAdminDashboard(timeFilter, modelFilter);

  // Get notifications
  const { 
    notifications: recentNotifications, 
    isLoading: notificationsLoading 
  } = useNotifications(null, { 
    viewAllUsers: true, 
    isAdmin: true, 
    recentOnly: true, 
    size: 5 
  });

  // Get recent reviews
  const { 
    reviews: recentReviews, 
    isLoading: reviewsLoading 
  } = useAdminReviews({ 
    page: 0, 
    size: 5 
  });

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setTimeout(() => setRefreshing(false), 800);
    }
  };

  // Calculate trends and percentages
  const calculateTrend = (current, previous) => {
    if (!previous) return { value: '0%', isUp: true };
    const diff = current - previous;
    const percentage = previous !== 0 ? (diff / previous) * 100 : 0;
    return {
      value: `${Math.abs(percentage).toFixed(1)}%`,
      isUp: percentage >= 0
    };
  };

  // Prepare quick stats with calculated trends
  const quickStats = useMemo(() => {
    if (!statistics || !trends) return [];

    return [
      {
        title: 'Total Users',
        count: statistics?.accounts || 0,
        icon: <Users />,
        trend: calculateTrend(statistics?.accounts || 0, trends?.previousAccounts || 0).value,
        trendUp: calculateTrend(statistics?.accounts || 0, trends?.previousAccounts || 0).isUp,
        color: 'primary',
        path: '/dashboard/account/list'
      },
      {
        title: 'Active Courses',
        count: statistics?.courses || 0,
        icon: <BookOpen />,
        trend: calculateTrend(statistics?.courses || 0, trends?.previousCourses || 0).value,
        trendUp: calculateTrend(statistics?.courses || 0, trends?.previousCourses || 0).isUp,
        color: 'success',
        path: '/dashboard/course/list-course'
      },
      {
        title: 'Categories',
        count: statistics?.categories || 0,
        icon: <GridIcon />,
        trend: calculateTrend(statistics?.categories || 0, trends?.previousCategories || 0).value,
        trendUp: calculateTrend(statistics?.categories || 0, trends?.previousCategories || 0).isUp,
        color: 'warning',
        path: '/dashboard/category/list-category'
      },
      {
        title: 'Reviews',
        count: statistics?.reviews || 0,
        icon: <Star />,
        trend: calculateTrend(statistics?.reviews || 0, trends?.previousReviews || 0).value,
        trendUp: calculateTrend(statistics?.reviews || 0, trends?.previousReviews || 0).isUp,
        color: 'info',
        path: '/dashboard/reviews'
      }
    ];
  }, [statistics, trends]);

  // Create sample course data for better charts
  useEffect(() => {
    // This is just a simulation - in a real app, you'd modify your backend
    // to provide better data or use real data from your API
    const createSampleCourseData = () => {
      // Create sample data for the last 12 months
      const now = new Date();
      const sampleData = [];
      
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(now, i);
        const monthName = format(date, 'MMM');
        
        // Generate random but increasing values
        const baseValue = 50 + (11 - i) * 15; // Base value increases as we get closer to present
        const randomFactor = Math.random() * 20 - 10; // Random variation between -10 and +10
        
        sampleData.push({
          month: monthName,
          enrollments: Math.max(0, Math.round(baseValue + randomFactor)),
          revenue: Math.round((baseValue + randomFactor) * 25) / 10,
          courses: Math.round((11 - i) * 1.5 + Math.random() * 2)
        });
      }
      
      return sampleData;
    };
    
    // In a real app, you'd dispatch this data to your state management
    // or use it directly in your charts
    window.sampleCourseData = createSampleCourseData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      {/* Header with filters and refresh */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center">
              <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mr: 2 }}>
                Dashboard
              </Typography>
              <Chip 
                icon={<Calendar size={16} />} 
                label={timeFilter === 'allTime' ? 'All Time' : 
                      timeFilter === 'today' ? 'Today' : 
                      timeFilter === 'week' ? 'This Week' : 
                      timeFilter === 'month' ? 'This Month' : 'This Year'} 
                color="primary" 
                variant="outlined" 
                sx={{ mr: 1 }}
              />
              <Tooltip title="Refresh data">
                <IconButton 
                  color="primary" 
                  onClick={handleRefresh} 
                  disabled={refreshing || isLoading}
                  sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }}
                >
                  <RefreshCw size={20} />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                displayEmpty
                variant="outlined"
                startAdornment={<Filter size={16} style={{ marginRight: 8 }} />}
              >
                <MenuItem value="allTime">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Loading indicator */}
      {isLoading && (
        <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />
      )}

      {/* Error message */}
      {isError && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          Failed to load dashboard data: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard
              title={stat.title}
              count={stat.count}
              icon={stat.icon}
              trend={stat.trend}
              trendUp={stat.trendUp}
              color={stat.color}
              onClick={() => navigate(stat.path)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Statistics Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <ChartCard 
            title="Overall Growth" 
            subtitle="📊 Statistics Overview"
            chartType="line"
          >
            <StatisticsChart model="total" filter={timeFilter} title="" />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard 
            title="Course Enrollments" 
            subtitle="📚 Statistics Overview"
            chartType="bar"
          >
            <StatisticsChart model="courses" filter={timeFilter} title="" />
          </ChartCard>
        </Grid>
      </Grid>

      {/* Pending Approvals */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="medium">
                  Pending Course Approvals
                </Typography>
                <Badge 
                  badgeContent={pendingCourses?.length || 0} 
                  color="error"
                  max={99}
                  showZero
                >
                  <AlertCircle size={20} />
                </Badge>
              </Box>
              
              {isLoading ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress size={40} />
                </Box>
              ) : Array.isArray(pendingCourses) && pendingCourses.length > 0 ? (
                <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                  {pendingCourses.map((course) => (
                    <ApprovalItem 
                      key={course.id} 
                      item={course} 
                      onApprove={approveCourse} 
                      onReject={rejectCourse} 
                      type="course" 
                    />
                  ))}
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    borderRadius: 2
                  }}
                >
                  <CheckCircle size={40} color={theme.palette.success.main} />
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    No pending courses to approve
                  </Typography>
                </Box>
              )}
              
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button 
                  component={Link} 
                  to="/dashboard/course/list-course" 
                  endIcon={<ChevronRight size={16} />}
                  color="primary"
                >
                  View All Courses
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="medium">
                  Pending Instructor Approvals
                </Typography>
                <Badge 
                  badgeContent={pendingInstructors?.length || 0} 
                  color="error"
                  max={99}
                  showZero
                >
                  <AlertCircle size={20} />
                </Badge>
              </Box>
              
              {isLoading ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress size={40} />
                </Box>
              ) : Array.isArray(pendingInstructors) && pendingInstructors.length > 0 ? (
                <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                  {pendingInstructors.map((instructor) => (
                    <ApprovalItem 
                      key={instructor.id} 
                      item={instructor} 
                      onApprove={approveInstructor} 
                      onReject={rejectInstructor} 
                      type="instructor" 
                    />
                  ))}
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    borderRadius: 2
                  }}
                >
                  <CheckCircle size={40} color={theme.palette.success.main} />
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    No pending instructors to approve
                  </Typography>
                </Box>
              )}
              
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button 
                  component={Link} 
                  to="/dashboard/instructor/list" 
                  endIcon={<ChevronRight size={16} />}
                  color="primary"
                >
                  View All Instructors
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="medium">
                  Recent Reviews
                </Typography>
                <Tooltip title="View all reviews">
                  <IconButton 
                    component={Link} 
                    to="/dashboard/reviews" 
                    size="small"
                    color="primary"
                  >
                    <Eye size={18} />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ height: 400, overflowY: 'auto', pr: 1 }}>
                {reviewsLoading ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress size={30} />
                  </Box>
                ) : recentReviews && recentReviews.length > 0 ? (
                  recentReviews.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))
                ) : (
                  <Box 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                      borderRadius: 2
                    }}
                  >
                    <MessageCircle size={40} color={theme.palette.text.secondary} />
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      No reviews yet
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="medium">
                  Recent Notifications
                </Typography>
                <Tooltip title="View all notifications">
                  <IconButton 
                    component={Link} 
                    to="/dashboard/notification/list" 
                    size="small"
                    color="primary"
                  >
                    <Eye size={18} />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ height: 400, overflowY: 'auto', pr: 1 }}>
                {notificationsLoading ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress size={30} />
                  </Box>
                ) : recentNotifications && recentNotifications.length > 0 ? (
                  recentNotifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
                ) : (
                  <Box 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                      borderRadius: 2
                    }}
                  >
                    <Bell size={40} color={theme.palette.text.secondary} />
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      No notifications yet
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Platform Performance
              </Typography>
              
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Activity size={24} color={theme.palette.primary.main} />
                    <Typography variant="h5" fontWeight="bold" mt={1}>
                      {statistics?.averageCompletionRate ? `${statistics.averageCompletionRate}%` : '85%'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Course Completion Rate
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Award size={24} color={theme.palette.success.main} />
                    <Typography variant="h5" fontWeight="bold" mt={1}>
                      {statistics?.averageRating ? statistics.averageRating.toFixed(1) : '4.7'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Average Course Rating
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <DollarSign size={24} color={theme.palette.warning.main} />
                    <Typography variant="h5" fontWeight="bold" mt={1}>
                      {statistics?.averageRevenue ? `$${statistics.averageRevenue.toFixed(2)}` : '$49.99'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Avg. Revenue per User
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.info.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    <Users size={24} color={theme.palette.info.main} />
                    <Typography variant="h5" fontWeight="bold" mt={1}>
                      {statistics?.activeUserRate ? `${statistics.activeUserRate}%` : '78%'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Active User Rate
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Box display="flex" justifyContent="center" mt={3}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<BarChart2 size={18} />}
                  component={Link}
                  to="/dashboard/reviews/statistics"
                >
                  View Detailed Analytics
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashDefault;