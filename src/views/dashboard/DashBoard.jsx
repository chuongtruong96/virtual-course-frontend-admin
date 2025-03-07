// Thêm import React và các hooks cần thiết
import React, { useState, useEffect, useMemo } from 'react';

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
  BarChart,
  GraduationCap
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
  useTheme, // Thêm useTheme vào đây
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

// Import performance metrics components
import EnhancedPerformanceMetrics from '../finance/EnhancedPerformanceMetrics';
import InstructorPerformanceMetrics from '../finance/InstructorPerformanceMetrics';
import StudentPerformanceMetrics from '../finance/StudentPerformanceMetrics';

// Thêm import cho các components cần thiết
import useAdminDashboard from '../../hooks/useAdminDashboard';
import useNotifications from '../../hooks/useNotifications';
import useAdminReviews from '../../hooks/useAdminReviews';
import useStudentStatistics from '../../hooks/useStudentStatistics';

import { Link, useNavigate } from 'react-router-dom';
import StatsCard from '../../components/StatsCard';
import ChartCard from '../../components/ChartCard';
import StatisticsChart from '../../components/StatisticsChart';
import ApprovalItem from '../../components/ApprovalItem';
import ReviewItem from '../../components/ReviewItem';
import NotificationItem from '../../components/NotificationItem';
import MonthlyTransactionChart from '../transaction/MonthlyTransactionChart';
import TransactionTypePieChart from '../transaction/TransactionTypePieChart';
import TransactionStatusBarChart from '../transaction/TransactionStatusBarChart';

/**
 * Performance Metrics component with tabs for different metric types
 */
const PerformanceMetricsWithTabs = ({
  statistics,
  reviewStatistics,
  transactionStats,
  walletStatistics,
  instructorStatistics,
  studentQuizStatistics,
  isLoading,
  theme,
  onRefresh,
  onExportStudentData
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle refresh click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };
  // Add this function to handle student data export
  const handleExportStudentData = () => {
    try {
      // You can implement this in your main component and pass it as a prop
      // For now, we'll just log a message
      console.log('Exporting student data...');

      // If you have a service method for this:
      // StudentStatisticsService.exportStudentPerformanceData();

      // Use the passed prop if available
      if (onExportStudentData) {
        onExportStudentData();
      }
    } catch (error) {
      console.error('Error exporting student data:', error);
    }
  };
  return (
    <Grid container spacing={3} sx={{ mt: 3 }}>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="medium">
                Platform Performance
              </Typography>

              <Box display="flex" alignItems="center">
                {isLoading && <CircularProgress size={20} color="primary" sx={{ mr: 2 }} />}

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

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Platform Overview" icon={<Activity size={16} />} iconPosition="start" />
              <Tab label="Instructor Performance" icon={<GraduationCap size={16} />} iconPosition="start" />
              <Tab label="Student Learning" icon={<BookOpen size={16} />} iconPosition="start" />
            </Tabs>

            {/* Platform Overview Tab */}
            {tabValue === 0 && (
              <>
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
                        {isLoading ? (
                          <CircularProgress size={24} color="primary" />
                        ) : statistics?.averageCompletionRate ? (
                          `${statistics.averageCompletionRate}%`
                        ) : (
                          '0%'
                        )}
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
                        {isLoading ? (
                          <CircularProgress size={24} color="success" />
                        ) : statistics?.averageRating ? (
                          statistics.averageRating.toFixed(1)
                        ) : (
                          '0.0'
                        )}
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
                        {isLoading ? (
                          <CircularProgress size={24} color="warning" />
                        ) : statistics?.averageRevenue ? (
                          `${statistics.averageRevenue.toLocaleString()} VND`
                        ) : (
                          '0 VND'
                        )}
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
                        {isLoading ? (
                          <CircularProgress size={24} color="info" />
                        ) : statistics?.activeUserRate ? (
                          `${statistics.activeUserRate}%`
                        ) : (
                          '0%'
                        )}
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
              </>
            )}

            {/* Instructor Performance Tab */}
            {tabValue === 1 && (
              <Box sx={{ mt: 2 }}>
                <InstructorPerformanceMetrics
                  instructorStatistics={instructorStatistics}
                  isLoading={isLoading}
                  theme={theme}
                  onRefresh={handleRefresh}
                  onExport={() => console.log('Exporting instructor data...')}
                />
              </Box>
            )}

            {/* Student Learning Tab */}
            {tabValue === 2 && (
              <Box sx={{ mt: 2 }}>
                <StudentPerformanceMetrics
                  studentStatistics={studentQuizStatistics}
                  isLoading={isLoading}
                  theme={theme}
                  onRefresh={handleRefresh}
                  onExport={handleExportStudentData}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const DashDefault = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('allTime');
  const [modelFilter, setModelFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Add state for pending withdrawals
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [pendingWithdrawalsLoading, setPendingWithdrawalsLoading] = useState(false);
  const [approving, setApproving] = useState(false);

  // Add state for review statistics
  const [reviewStatistics, setReviewStatistics] = useState(null);
  const [instructorStatistics, setInstructorStatistics] = useState(null);

  // Add the student statistics hook
  const {
    studentStatistics,
    isLoading: studentStatsLoading,
    error: studentStatsError,
    refreshStudentStatistics,
    exportStudentStatistics
  } = useStudentStatistics();

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
    isLoading: notificationsLoading,
    markAsRead
  } = useNotifications(null, {
    viewAllUsers: true,
    isAdmin: true,
    recentOnly: true,
    size: 5
  });

  // Get recent reviews
  const { reviews: recentReviews, isLoading: reviewsLoading } = useAdminReviews({
    page: 0,
    size: 5
  });

  // NEW: Get transaction statistics
  const {
    statistics: transactionStats,
    monthlyTrends: transactionTrends,
    isLoading: transactionsLoading,
    fetchTransactionStatistics,
    fetchMonthlyTransactionTrends,
    fetchTransactions,
    approveWithdrawal,
    rejectWithdrawal
  } = useTransactions();

  // NEW: Get wallet statistics
  const { isLoading: walletsLoading, getWalletStatistics } = useWallets();

  // Add a state for wallet stats to match the variable name used in quickStats
  const [walletStatistics, setWalletStatistics] = useState(null);

  // Update fetchPendingWithdrawals function to use the hooks properly
  const fetchPendingWithdrawals = async () => {
    setPendingWithdrawalsLoading(true);
    try {
      // Since we don't have a direct method in the hooks for this,
      // we can filter pending withdrawals from transactions
      const transactions = await fetchTransactions({
        type: 'WITHDRAWAL',
        status: 'PENDING'
      });

      // Map the transactions to the format we need
      const pendingWithdrawals =
        transactions?.content?.map((transaction) => ({
          id: transaction.id,
          amount: transaction.amount,
          instructorName: transaction.instructorName || 'Instructor',
          createdAt: transaction.createdAt
        })) || [];

      setPendingWithdrawals(pendingWithdrawals);
    } catch (error) {
      console.error('Error fetching pending withdrawals:', error);
      // Fallback to empty array if API fails
      setPendingWithdrawals([]);
    } finally {
      setPendingWithdrawalsLoading(false);
    }
  };

  // Update approval handlers to use the hooks properly
  const handleApproveWithdrawal = async (id) => {
    setApproving(true);
    try {
      await approveWithdrawal(id);
      // Refresh the list after approval
      fetchPendingWithdrawals();
      // Also refresh transaction statistics
      fetchTransactionStatistics();
    } catch (error) {
      console.error('Error approving withdrawal:', error);
    } finally {
      setApproving(false);
    }
  };

  const handleRejectWithdrawal = async (id) => {
    setApproving(true);
    try {
      // Note: The hook expects an object with id and reason
      await rejectWithdrawal({ id, reason: 'Rejected by admin' });
      // Refresh the list after rejection
      fetchPendingWithdrawals();
      // Also refresh transaction statistics
      fetchTransactionStatistics();
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
    } finally {
      setApproving(false);
    }
  };

  // Log data for debugging
  useEffect(() => {
    console.log('Recent reviews data:', recentReviews);
  }, [recentReviews]);

  useEffect(() => {
    console.log('Recent notifications data:', recentNotifications);
  }, [recentNotifications]);

  // Add this useEffect to fetch monthly trends when component mounts
  useEffect(() => {
    fetchMonthlyTransactionTrends();
    fetchPendingWithdrawals();

    const fetchWalletStats = async () => {
      try {
        const stats = await getWalletStatistics();
        setWalletStatistics(stats);
      } catch (error) {
        console.error('Error fetching wallet statistics:', error);
        setWalletStatistics(null);
      }
    };

    fetchWalletStats();
  }, [fetchMonthlyTransactionTrends, getWalletStatistics, fetchPendingWithdrawals]);

  // Handle refresh - update to include monthly trends
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      // Also refresh financial data
      await fetchTransactionStatistics();
      await fetchMonthlyTransactionTrends();
      await fetchPendingWithdrawals();

      // Refresh wallet statistics
      const stats = await getWalletStatistics();
      setWalletStatistics(stats);

      // Refresh student statistics
      await refreshStudentStatistics();
    } finally {
      setTimeout(() => setRefreshing(false), 800);
    }
  };
  // Handle student data export
  const handleExportStudentData = async () => {
    try {
      const success = await exportStudentStatistics();
      if (success) {
        // Show success message if needed
        console.log('Student data exported successfully');
      }
    } catch (error) {
      console.error('Error exporting student data:', error);
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

    // Calculate financial trends if we have previous data
    const depositGrowth = transactionStats?.depositGrowth
      ? { value: `${Math.abs(transactionStats.depositGrowth).toFixed(1)}%`, isUp: transactionStats.depositGrowth > 0 }
      : { value: '0%', isUp: true };

    const walletGrowth = walletStatistics?.walletGrowth
      ? { value: `${Math.abs(walletStatistics.walletGrowth).toFixed(1)}%`, isUp: walletStatistics.walletGrowth > 0 }
      : { value: '0%', isUp: true };

    const withdrawalGrowth = transactionStats?.withdrawalGrowth
      ? { value: `${Math.abs(transactionStats.withdrawalGrowth).toFixed(1)}%`, isUp: transactionStats.withdrawalGrowth > 0 }
      : { value: '0%', isUp: false };

    const balanceGrowth = walletStatistics?.avgBalanceGrowth
      ? { value: `${Math.abs(walletStatistics.avgBalanceGrowth).toFixed(1)}%`, isUp: walletStatistics.avgBalanceGrowth > 0 }
      : { value: '0%', isUp: true };

    const reviewsCount = statistics?.reviews || recentReviews?.length || 0;

    // Tính toán trend cho reviews
    const reviewsTrend = calculateTrend(reviewsCount, trends?.previousReviews || 0);

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
        count: reviewsCount,
        icon: <Star />,
        trend: reviewsTrend.value,
        trendUp: reviewsTrend.isUp,
        color: 'info',
        path: '/dashboard/reviews'
      },
      // NEW: Add financial stats to quick stats
      {
        title: 'Total Revenue',
        count: transactionStats?.totalDepositAmount ? `${transactionStats.totalDepositAmount.toLocaleString()}VND` : '0VND',
        icon: <DollarSignIcon />,
        trend: depositGrowth.value,
        trendUp: depositGrowth.isUp,
        color: 'success',
        path: '/dashboard/finance/transactions'
      },
      {
        title: 'Active Wallets',
        count: walletStatistics?.activeWallets || 0,
        icon: <Wallet />,
        trend: walletGrowth.value,
        trendUp: walletGrowth.isUp,
        color: 'primary',
        path: '/dashboard/finance/wallets'
      },
      {
        title: 'Pending Withdrawals',
        count: transactionStats?.pendingTransactions || 0,
        icon: <CreditCard />,
        trend: withdrawalGrowth.value,
        trendUp: withdrawalGrowth.isUp,
        color: 'warning',
        path: '/dashboard/finance/withdrawal-requests'
      },
      {
        title: 'Avg. Wallet Balance',
        count: walletStatistics?.averageBalance ? `${walletStatistics.averageBalance.toLocaleString()}VND` : '0VND',
        icon: <BarChart2Icon />,
        trend: balanceGrowth.value,
        trendUp: balanceGrowth.isUp,
        color: 'info',
        path: '/dashboard/finance/wallets'
      }
    ];
  }, [statistics, trends, recentReviews, transactionStats, walletStatistics]);

  // Replace the hardcoded monthlyTransactionData with this:
  const monthlyTransactionData = useMemo(() => {
    // If we have real data from API, use it
    if (transactionTrends && transactionTrends.length > 0) {
      return transactionTrends;
    }

    // Return empty array if no data
    return [];
  }, [transactionTrends]);

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
                label={
                  timeFilter === 'allTime'
                    ? 'All Time'
                    : timeFilter === 'today'
                      ? 'Today'
                      : timeFilter === 'week'
                        ? 'This Week'
                        : timeFilter === 'month'
                          ? 'This Month'
                          : 'This Year'
                }
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
      {(isLoading || transactionsLoading || walletsLoading) && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

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
          <ChartCard title="Overall Growth" subtitle="📊 Statistics Overview" chartType="line">
            <StatisticsChart model="total" filter={timeFilter} title="" />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard title="Course Enrollments" subtitle="📚 Statistics Overview" chartType="bar">
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
          <ChartCard title="Transaction Distribution" subtitle="💰 By Type" chartType="pie" loading={transactionsLoading}>
            <TransactionTypePieChart data={transactionStats} isLoading={transactionsLoading} />
          </ChartCard>
        </Grid>

        {/* Transaction Status Distribution */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Transaction Status" subtitle="📊 Overview" chartType="bar" loading={transactionsLoading}>
            <TransactionStatusBarChart data={transactionStats} isLoading={transactionsLoading} />
          </ChartCard>
        </Grid>

        {/* Monthly Transaction Trends */}
        <Grid item xs={12}>
          <ChartCard title="Monthly Transaction Trends" subtitle="💹 Financial Activity" chartType="line" loading={transactionsLoading}>
            <MonthlyTransactionChart data={transactionStats?.monthlyData || []} isLoading={transactionsLoading} height={300} />
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
        <Button variant="outlined" color="warning" startIcon={<CreditCard />} onClick={() => navigate('/dashboard/finance/withdrawals')}>
          Pending Withdrawals
          {transactionStats?.pendingTransactions > 0 && (
            <Badge badgeContent={transactionStats.pendingTransactions} color="error" sx={{ ml: 1 }} />
          )}
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
                <Badge badgeContent={pendingCourses?.length || 0} color="error" max={99} showZero>
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
                    <ApprovalItem key={course.id} item={course} onApprove={approveCourse} onReject={rejectCourse} type="course" />
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
                <Button component={Link} to="/dashboard/course/list-course" endIcon={<ChevronRight size={16} />} color="primary">
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
                <Badge badgeContent={pendingInstructors?.length || 0} color="error" max={99} showZero>
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
                <Button component={Link} to="/dashboard/instructor/list" endIcon={<ChevronRight size={16} />} color="primary">
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
                  <IconButton component={Link} to="/dashboard/reviews" size="small" color="primary">
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
                  recentReviews.map((review) => {
                    console.log('Processing review:', review);

                    // Kiểm tra cấu trúc dữ liệu thực tế
                    // Điều chỉnh mapping dữ liệu dựa trên cấu trúc API thực tế
                    const safeReview = {
                      id: review?.id || Math.random().toString(),
                      // Kiểm tra các trường có thể có tên khác
                      content: review?.comment || review?.content || review?.reviewText || 'No review content provided.',
                      rating: review?.rating || review?.stars || 0,
                      createdAt: review?.createdAt || review?.created || review?.date || new Date().toISOString(),
                      status: review?.status || 'PENDING',
                      user: {
                        name: review?.studentName || review?.userName || (review?.user ? review.user.name : 'Anonymous User'),
                        avatarUrl: review?.userAvatar || (review?.user ? review.user.avatarUrl : '')
                      },
                      course: {
                        title: review?.courseTitle || (review?.course ? review.course.title : 'Unknown Course')
                      }
                    };

                    return (
                      <ReviewItem
                        key={safeReview.id}
                        review={safeReview}
                        showActions={true}
                        onReply={(reviewId) => {
                          console.log(`Replying to review ${reviewId}`);
                        }}
                        onEdit={(reviewId) => {
                          console.log(`Editing review ${reviewId}`);
                        }}
                        onDelete={(reviewId) => {
                          console.log(`Deleting review ${reviewId}`);
                        }}
                        onClick={(reviewId) => {
                          console.log(`Clicked on review ${reviewId}`);
                        }}
                      />
                    );
                  })
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
                  <IconButton component={Link} to="/dashboard/notification/list" size="small" color="primary">
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
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={(notificationId) => {
                        // Gọi API đánh dấu đã đọc
                        if (markAsRead) {
                          markAsRead(notificationId);
                        }
                      }}
                      onView={(notificationId) => {
                        // Xử lý khi xem thông báo
                        console.log(`Viewing notification ${notificationId}`);
                        // Có thể chuyển hướng đến trang chi tiết nếu cần
                        if (notification.actionUrl) {
                          navigate(notification.actionUrl);
                        }
                      }}
                    />
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

      {/* Performance Metrics with Tabs */}
      <PerformanceMetricsWithTabs
        statistics={statistics}
        reviewStatistics={reviewStatistics}
        transactionStats={transactionStats}
        walletStatistics={walletStatistics}
        instructorStatistics={instructorStatistics}
        studentQuizStatistics={studentStatistics}
        isLoading={isLoading || transactionsLoading || walletsLoading || studentStatsLoading}
        theme={theme}
        onRefresh={handleRefresh}
        onExportStudentData={handleExportStudentData}
      />
    </Box>
  );
};

export default DashDefault;
