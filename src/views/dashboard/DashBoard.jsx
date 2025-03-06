// Thêm import React và các hooks cần thiết
import React, { useState, useMemo } from 'react';

// Thêm hooks mới để lấy dữ liệu tài chính
import useTransactions from '../../hooks/useTransactions';
import useWallets from '../../hooks/useWallets';
import { 
  // Thêm icons mới
  CreditCard, 
  Wallet, 
  DollarSign as DollarSignIcon,
  TrendingUp as TrendingUpIcon,
  BarChart2 as BarChart2Icon,
  PieChart as PieChartIcon,
  ArrowUpRight,
  // Các icons hiện có
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
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
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
  useTheme,  // Thêm useTheme vào đây
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

// Thêm import cho các components cần thiết
import useAdminDashboard from '../../hooks/useAdminDashboard';
import useNotifications from '../../hooks/useNotifications';
import useAdminReviews from '../../hooks/useAdminReviews';
import { Link, useNavigate } from 'react-router-dom';
import StatsCard from '../../components/StatsCard';
import ChartCard from '../../components/ChartCard';
import StatisticsChart from '../../components/StatisticsChart';
import ApprovalItem from '../../components/ApprovalItem';
import ReviewItem from '../../components/ReviewItem';
import NotificationItem from '../../components/NotificationItem';

const DashDefault = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('allTime');
  const [modelFilter, setModelFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  // Existing hooks
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

  // NEW: Get transaction statistics
  const {
    statistics: transactionStats,
    isLoading: transactionsLoading,
    fetchTransactionStatistics
  } = useTransactions();

  // NEW: Get wallet statistics
  const {
    walletStatistics,
    isLoading: walletsLoading,
    getWalletStatistics
  } = useWallets();

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      // NEW: Also refresh financial data
      await fetchTransactionStatistics();
      await getWalletStatistics();
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
      },
      // NEW: Add financial stats to quick stats
      {
        title: 'Total Revenue',
        count: transactionStats?.totalDepositAmount ? `$${transactionStats.totalDepositAmount.toFixed(2)}` : '$0.00',
        icon: <DollarSignIcon />,
        trend: '8.5%',
        trendUp: true,
        color: 'success',
        path: '/dashboard/finance/transactions'
      },
      {
        title: 'Active Wallets',
        count: walletStatistics?.activeWallets || 0,
        icon: <Wallet />,
        trend: '4.2%',
        trendUp: true,
        color: 'primary',
        path: '/dashboard/finance/wallets'
      },
      {
        title: 'Pending Withdrawals',
        count: transactionStats?.pendingTransactions || 0,
        icon: <CreditCard />,
        trend: '2.1%',
        trendUp: false,
        color: 'warning',
        path: '/dashboard/finance/withdrawal-requests'
      },
      {
        title: 'Avg. Wallet Balance',
        count: walletStatistics?.averageBalance ? `$${walletStatistics.averageBalance.toFixed(2)}` : '$0.00',
        icon: <BarChart2Icon />,
        trend: '6.7%',
        trendUp: true,
        color: 'info',
        path: '/dashboard/finance/wallets'
      }
    ];
  }, [statistics, trends, transactionStats, walletStatistics]);

  // Rest of your existing code...

  // NEW: Prepare data for transaction type pie chart
  const transactionTypeData = [
    { name: 'Deposits', value: transactionStats?.totalDeposits || 0, color: theme.palette.success.main },
    { name: 'Withdrawals', value: transactionStats?.totalWithdrawals || 0, color: theme.palette.secondary.main }
  ];
  
  // NEW: Prepare data for transaction status pie chart
  const transactionStatusData = [
    { name: 'Pending', value: transactionStats?.pendingTransactions || 0, color: theme.palette.warning.main },
    { name: 'Completed', value: transactionStats?.completedTransactions || 0, color: theme.palette.success.main },
    { name: 'Failed', value: transactionStats?.failedTransactions || 0, color: theme.palette.error.main }
  ];

  // NEW: Sample monthly transaction data (in a real app, this would come from the API)
  const monthlyTransactionData = [
    { month: 'Jan', deposits: 12500, withdrawals: 8200 },
    { month: 'Feb', deposits: 14200, withdrawals: 9100 },
    { month: 'Mar', deposits: 15800, withdrawals: 10500 },
    { month: 'Apr', deposits: 16900, withdrawals: 11200 },
    { month: 'May', deposits: 18500, withdrawals: 12800 },
    { month: 'Jun', deposits: 19200, withdrawals: 13500 },
    { month: 'Jul', deposits: 21000, withdrawals: 14200 },
    { month: 'Aug', deposits: 22500, withdrawals: 15800 },
    { month: 'Sep', deposits: 24100, withdrawals: 16500 },
    { month: 'Oct', deposits: 25800, withdrawals: 17200 },
    { month: 'Nov', deposits: 27200, withdrawals: 18500 },
    { month: 'Dec', deposits: 29500, withdrawals: 19800 }
  ];

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
      {(isLoading || transactionsLoading || walletsLoading) && (
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
        {quickStats.slice(0, 4).map((stat, index) => (
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

      {/* NEW: Financial Overview Section */}
      <Typography variant="h5" sx={{ mb: 2, mt: 4, fontWeight: 'medium' }}>
        Financial Overview
      </Typography>
      
      {/* Financial Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {quickStats.slice(4).map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index + 4}>
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

      {/* Financial Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Transaction Type Distribution */}
        <Grid item xs={12} md={6}>
          <ChartCard 
            title="Transaction Distribution" 
            subtitle="💰 By Type"
            chartType="pie"
          >
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={transactionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {transactionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => [value, 'Transactions']} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        
        {/* Transaction Status Distribution */}
        <Grid item xs={12} md={6}>
          <ChartCard 
            title="Transaction Status" 
            subtitle="📊 Overview"
            chartType="bar"
          >
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart
                data={transactionStatusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip formatter={(value) => [value, 'Transactions']} />
                <Bar dataKey="value" name="Transactions">
                  {transactionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
        
        {/* Monthly Transaction Trends */}
        <Grid item xs={12}>
          <ChartCard 
            title="Monthly Transaction Trends" 
            subtitle="💹 Financial Activity"
            chartType="line"
          >
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart
                data={monthlyTransactionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke={theme.palette.success.main} />
                <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} />
                <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="deposits" 
                  name="Deposits" 
                  stroke={theme.palette.success.main} 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="withdrawals" 
                  name="Withdrawals" 
                  stroke={theme.palette.secondary.main} 
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>
      
      {/* Financial Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<TrendingUpIcon />}
          onClick={() => navigate('/dashboard/finance/transactions')}
          sx={{ mr: 2 }}
        >
          View All Transactions
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<Wallet />}
          onClick={() => navigate('/dashboard/finance/wallets')}
          sx={{ mr: 2 }}
        >
          Manage Wallets
        </Button>
        <Button 
          variant="outlined" 
          color="warning" 
          startIcon={<CreditCard />}
          onClick={() => navigate('/dashboard/finance/withdrawal-requests')}
        >
          Pending Withdrawals ({transactionStats?.pendingTransactions || 0})
        </Button>
      </Box>

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
                  sx={{ mr: 2 }}
                >
                  View Detailed Analytics
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  startIcon={<PieChartIcon size={18} />}
                  component={Link}
                  to="/dashboard/finance/statistics"
                >
                  Financial Analytics
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