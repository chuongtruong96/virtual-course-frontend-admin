import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Divider,
  Tooltip,
  CircularProgress,
  Paper,
  useTheme,
  alpha,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Wallet,
  RefreshCw,
  BarChart2,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import FinancialService from '../../services/FinancialService';
import WalletStatistics from './WalletStatistics';
// Financial Stats Card Component
export const FinancialStatsCard = ({ title, value, icon, trend, trendUp, color, onClick, loading = false }) => {
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
          height: '100%',
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
              {loading ? (
                <CircularProgress size={24} color={color} />
              ) : (
                <Typography variant="h4" component="div" fontWeight="bold">
                  {typeof value === 'number' && value.toString().includes('.') 
                    ? formatCurrency(value) 
                    : typeof value === 'number' ? value.toLocaleString() : value}
                </Typography>
              )}
              <Typography variant="subtitle2" color="textSecondary">
                {title}
              </Typography>
            </Box>
          </Box>
          {trend && (
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
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Transaction Statistics Component
export const TransactionStatistics = ({ data, loading = false, onRefresh }) => {
  const theme = useTheme();
  
  // Prepare data for transaction type pie chart
  const transactionTypeData = [
    { name: 'Deposits', value: data?.totalDeposits || 0, color: theme.palette.success.main },
    { name: 'Withdrawals', value: data?.totalWithdrawals || 0, color: theme.palette.secondary.main }
  ];
  
  // Prepare data for transaction status pie chart
  const transactionStatusData = [
    { name: 'Pending', value: data?.pendingTransactions || 0, color: theme.palette.warning.main },
    { name: 'Completed', value: data?.completedTransactions || 0, color: theme.palette.success.main },
    { name: 'Failed', value: data?.failedTransactions || 0, color: theme.palette.error.main }
  ];
  
  // Monthly transaction data from API
  const monthlyTransactionData = data?.monthlyData || [];
  
  return (
    <Grid container spacing={3}>
      {/* Transaction Stats Cards */}
      <Grid item xs={12} md={6} lg={3}>
        <FinancialStatsCard
          title="Total Transactions"
          value={data?.totalTransactions || 0}
          icon={<BarChart2 />}
          trend={data?.transactionGrowth ? `${data.transactionGrowth}%` : null}
          trendUp={data?.transactionGrowth ? data.transactionGrowth > 0 : true}
          color="primary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <FinancialStatsCard
          title="Total Deposits"
          value={data?.totalDepositAmount || 0}
          icon={<DollarSign />}
          trend={data?.depositGrowth ? `${data.depositGrowth}%` : null}
          trendUp={data?.depositGrowth ? data.depositGrowth > 0 : true}
          color="success"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <FinancialStatsCard
          title="Total Withdrawals"
          value={data?.totalWithdrawalAmount || 0}
          icon={<CreditCard />}
          trend={data?.withdrawalGrowth ? `${data.withdrawalGrowth}%` : null}
          trendUp={data?.withdrawalGrowth ? data.withdrawalGrowth > 0 : true}
          color="secondary"
          loading={loading}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <FinancialStatsCard
          title="Pending Transactions"
          value={data?.pendingTransactions || 0}
          icon={<Clock />}
          trend={data?.pendingGrowth ? `${data.pendingGrowth}%` : null}
          trendUp={false}
          color="warning"
          loading={loading}
          onClick={() => window.location.href = '/virtualcourse/dashboard/finance/withdrawals'}
        />
      </Grid>
      
      {/* Transaction Type Distribution */}
      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" fontWeight="medium">
                Transaction Type Distribution
              </Typography>
              {onRefresh && (
                <Tooltip title="Refresh data">
                  <Button 
                    size="small" 
                    onClick={onRefresh} 
                    startIcon={<RefreshCw size={16} />}
                    disabled={loading}
                  >
                    Refresh
                  </Button>
                </Tooltip>
              )}
            </Box>
            <Divider sx={{ my: 1.5 }} />
            
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                <CircularProgress />
              </Box>
            ) : (
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
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
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
            
            <Box display="flex" justifyContent="center" mt={2}>
            <Button 
              component={Link} 
              to="/dashboard/finance/transactions" 
              endIcon={<ArrowUpRight size={16} />}
              color="primary"
              variant="text"
            >
              View All Transactions
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
    
    {/* Transaction Status Distribution */}
    <Grid item xs={12} md={6}>
      <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight="medium">
              Transaction Status Distribution
            </Typography>
            <Tooltip title="View detailed statistics">
              <Button 
                component={Link} 
                to="/dashboard/finance/statistics" 
                size="small"
                startIcon={<PieChartIcon size={16} />}
              >
                Details
              </Button>
            </Tooltip>
          </Box>
          <Divider sx={{ my: 1.5 }} />
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
              <CircularProgress />
            </Box>
          ) : (
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
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
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
          
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Box display="flex" alignItems="center">
              <AlertCircle size={16} color={theme.palette.warning.main} style={{ marginRight: 8 }} />
              <Typography variant="body2">
                {data?.pendingTransactions || 0} pending transactions need attention
              </Typography>
            </Box>
            <Button 
              component={Link} 
              to="/dashboard/finance/withdrawals" 
              size="small"
              variant="outlined"
              color="warning"
            >
              Review
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
    
    {/* Monthly Transaction Trends */}
    <Grid item xs={12}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Monthly Transaction Trends
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={350}>
              <CircularProgress />
            </Box>
          ) : (
            <Box height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTransactionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke={theme.palette.success.main} />
                  <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} />
                  <RechartsTooltip formatter={(value) => [formatCurrency(value), '']} />
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
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);
// Prepare data for wallet status pie chart
const walletStatusData = [
  { name: 'Active', value: data?.activeWallets || 0, color: theme.palette.success.main },
  { name: 'Suspended', value: data?.suspendedWallets || 0, color: theme.palette.warning.main },
  { name: 'Closed', value: data?.closedWallets || 0, color: theme.palette.error.main }
];

// Filter out zero values
const filteredWalletStatusData = walletStatusData.filter(item => item.value > 0);

// Top instructor wallets data from API
const topInstructorWallets = data?.topInstructorWallets || [];

return (
  <Grid container spacing={3}>
    {/* Wallet Stats Cards */}
    <Grid item xs={12} md={6} lg={3}>
      <FinancialStatsCard
        title="Total Wallets"
        value={data?.totalWallets || 0}
        icon={<Wallet />}
        trend={data?.walletGrowth ? `${data.walletGrowth}%` : null}
        trendUp={data?.walletGrowth ? data.walletGrowth > 0 : true}
        color="primary"
        loading={loading}
      />
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <FinancialStatsCard
        title="Active Wallets"
        value={data?.activeWallets || 0}
        icon={<CheckCircle />}
        trend={data?.activeWalletGrowth ? `${data.activeWalletGrowth}%` : null}
        trendUp={data?.activeWalletGrowth ? data.activeWalletGrowth > 0 : true}
        color="success"
        loading={loading}
      />
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <FinancialStatsCard
        title="Total Balance"
        value={data?.totalBalance || 0}
        icon={<DollarSign />}
        trend={data?.balanceGrowth ? `${data.balanceGrowth}%` : null}
        trendUp={data?.balanceGrowth ? data.balanceGrowth > 0 : true}
        color="info"
        loading={loading}
      />
    </Grid>
    <Grid item xs={12} md={6} lg={3}>
      <FinancialStatsCard
        title="Average Balance"
        value={data?.averageBalance || 0}
        icon={<BarChart2 />}
        trend={data?.avgBalanceGrowth ? `${data.avgBalanceGrowth}%` : null}
        trendUp={data?.avgBalanceGrowth ? data.avgBalanceGrowth > 0 : true}
        color="warning"
        loading={loading}
        onClick={() => window.location.href = '/dashboard/finance/wallets'}
      />
    </Grid>
    
    {/* Wallet Status Distribution */}
    <Grid item xs={12} md={6}>
      <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight="medium">
              Wallet Status Distribution
            </Typography>
            {onRefresh && (
              <Tooltip title="Refresh data">
                <Button 
                  size="small" 
                  onClick={onRefresh} 
                  startIcon={<RefreshCw size={16} />}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Tooltip>
            )}
          </Box>
          <Divider sx={{ my: 1.5 }} />
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
              <CircularProgress />
            </Box>
          ) : (
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredWalletStatusData.length > 0 ? filteredWalletStatusData : [{ name: 'No Data', value: 1, color: theme.palette.grey[300] }]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {(filteredWalletStatusData.length > 0 ? filteredWalletStatusData : [{ name: 'No Data', value: 1, color: theme.palette.grey[300] }]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [value, 'Wallets']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          )}
          
          <Box display="flex" justifyContent="center" mt={2}>
            <Button 
              component={Link} 
              to="/dashboard/finance/wallets" 
              endIcon={<ArrowUpRight size={16} />}
              color="primary"
              variant="text"
            >
              Manage Wallets
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
    
    {/* Top Instructor Wallets */}
    <Grid item xs={12} md={6}>
      <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight="medium">
              Top Instructor Wallets
            </Typography>
            <Tooltip title="View all wallets">
              <Button 
                component={Link} 
                to="/dashboard/finance/wallets" 
                size="small"
                startIcon={<Wallet size={16} />}
              >
                View All
              </Button>
            </Tooltip>
          </Box>
          <Divider sx={{ my: 1.5 }} />
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
              <CircularProgress />
            </Box>
          ) : (
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topInstructorWallets}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <RechartsTooltip formatter={(value, name) => [formatCurrency(value), name]} />
                  <Bar dataKey="balance" name="Balance" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
          
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Box display="flex" alignItems="center">
              <DollarSign size={16} color={theme.palette.success.main} style={{ marginRight: 8 }} />
              <Typography variant="body2">
                Total instructor earnings: {formatCurrency(data?.totalInstructorEarnings || 0)}
              </Typography>
            </Box>
            <Button 
              component={Link} 
              to="/dashboard/finance/wallets" 
              size="small"
              variant="outlined"
              color="primary"
            >
              Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
    
    {/* Balance Distribution */}
    <Grid item xs={12}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Wallet Balance Distribution
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={350}>
              <CircularProgress />
              </Box>
              ) : (
                <Box height={350}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data?.balanceDistribution || []}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => [value, 'Wallets']} />
                      <Bar dataKey="count" name="Number of Wallets" fill={theme.palette.info.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
              
              <Box display="flex" justifyContent="center" mt={2}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha(theme.palette.info.main, 0.1), 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <InfoIcon size={20} color={theme.palette.info.main} style={{ marginRight: 8 }} />
                  <Typography variant="body2">
                    Most instructor wallets ({data?.mostCommonBalanceRange || 'N/A'}) have balances between {data?.mostCommonBalanceRangeFormatted || 'N/A'}
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };
  
  // Helper InfoIcon component
  const InfoIcon = ({ size, color, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  );
  
  // Combined Financial Dashboard Component
  const FinanceDashboard = () => {
    const [transactionStats, setTransactionStats] = useState(null);
    const [walletStats, setWalletStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    
    useEffect(() => {
      // Fetch real data from API when component mounts
      fetchFinancialData();
    }, []);
    
    const fetchFinancialData = async () => {
      console.log('Starting to fetch financial data...');
  setLoading(true);
  setError(null);
  
  try {
    console.log('Fetching transaction statistics...');
    const transactionData = await FinancialService.getTransactionStatistics();
    console.log('Transaction data received:', transactionData);
    setTransactionStats(transactionData);
    
    console.log('Fetching wallet statistics...');
    const walletData = await FinancialService.getWalletStatistics();
    console.log('Wallet data received:', walletData);
    setWalletStats(walletData);
    
    console.log('All financial data fetched successfully');
  } catch (error) {
    console.error('Error fetching financial data:', error);
    // Detailed error logging
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    setError('Failed to load financial data. Please try again later.');
    setSnackbarOpen(true);
        
        // Set fallback data if API fails
        setTransactionStats({
          totalTransactions: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          totalDepositAmount: 0,
          totalWithdrawalAmount: 0,
          pendingTransactions: 0,
          completedTransactions: 0,
          failedTransactions: 0,
          transactionGrowth: 0,
          depositGrowth: 0,
          withdrawalGrowth: 0,
          pendingGrowth: 0,
          monthlyData: []
        });
        
        setWalletStats({
          totalWallets: 0,
          activeWallets: 0,
          suspendedWallets: 0,
          closedWallets: 0,
          totalBalance: 0,
          averageBalance: 0,
          walletGrowth: 0,
          activeWalletGrowth: 0,
          balanceGrowth: 0,
          avgBalanceGrowth: 0,
          totalInstructorEarnings: 0,
          topInstructorWallets: [],
          balanceDistribution: [],
          mostCommonBalanceRange: 'N/A',
          mostCommonBalanceRangeFormatted: 'N/A'
        });
      } finally {
        setLoading(false);
      }
    };
    
    const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
    };
    
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Financial Dashboard
        </Typography>
        
        {/* Error Snackbar */}
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        {/* Refresh Button */}
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<RefreshCw size={16} />}
            onClick={fetchFinancialData}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </Box>
        
        <Box mb={4}>
          <Typography variant="h5" gutterBottom fontWeight="medium">
            Transaction Statistics
          </Typography>
          <TransactionStatistics 
            data={transactionStats} 
            loading={loading} 
            onRefresh={fetchFinancialData} 
          />
        </Box>
        
        <Box mb={4}>
          <Typography variant="h5" gutterBottom fontWeight="medium">
            Wallet Statistics
          </Typography>
          <WalletStatistics 
            data={walletStats} 
            loading={loading} 
            onRefresh={fetchFinancialData} 
          />
        </Box>
      </Box>
    );
  };
  
  export default FinanceDashboard;