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
  Button
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
  
  // Sample monthly transaction data (in a real app, this would come from the API)
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
    <Grid container spacing={3}>
      {/* Transaction Stats Cards */}
      <Grid item xs={12} md={6} lg={3}>
        <FinancialStatsCard
          title="Total Transactions"
          value={data?.totalTransactions || 0}
          icon={<BarChart2 />}
          trend={data?.transactionGrowth ? `${data.transactionGrowth}%` : "5.2%"}
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
          trend={data?.depositGrowth ? `${data.depositGrowth}%` : "8.7%"}
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
          trend={data?.withdrawalGrowth ? `${data.withdrawalGrowth}%` : "6.3%"}
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
          trend={data?.pendingGrowth ? `${data.pendingGrowth}%` : "3.1%"}
          trendUp={false}
          color="warning"
          loading={loading}
          onClick={() => window.location.href = '/dashboard/finance/withdrawal-requests'}
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
                to="/dashboard/finance/withdrawal-requests" 
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
};

// Wallet Statistics Component
// Wallet Statistics Component
export const WalletStatistics = ({ data, loading = false, onRefresh }) => {
  const theme = useTheme();
  
  // Prepare data for wallet status pie chart
  const walletStatusData = [
    { name: 'Active', value: data?.activeWallets || 0, color: theme.palette.success.main },
    { name: 'Suspended', value: data?.suspendedWallets || 0, color: theme.palette.warning.main },
    { name: 'Closed', value: data?.closedWallets || 0, color: theme.palette.error.main }
  ];
  
  // Filter out zero values
  const filteredWalletStatusData = walletStatusData.filter(item => item.value > 0);
  
  // Sample instructor wallet data (in a real app, this would come from the API)
  const topInstructorWallets = [
    { name: 'John Doe', balance: 12500, courses: 8 },
    { name: 'Jane Smith', balance: 9800, courses: 6 },
    { name: 'Robert Johnson', balance: 8400, courses: 5 },
    { name: 'Emily Williams', balance: 7200, courses: 4 },
    { name: 'Michael Brown', balance: 6500, courses: 3 }
  ];
  
  return (
    <Grid container spacing={3}>
      {/* Wallet Stats Cards */}
      <Grid item xs={12} md={6} lg={3}>
        <FinancialStatsCard
          title="Total Wallets"
          value={data?.totalWallets || 0}
          icon={<Wallet />}
          trend={data?.walletGrowth ? `${data.walletGrowth}%` : "4.8%"}
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
          trend={data?.activeWalletGrowth ? `${data.activeWalletGrowth}%` : "7.2%"}
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
          trend={data?.balanceGrowth ? `${data.balanceGrowth}%` : "9.5%"}
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
          trend={data?.avgBalanceGrowth ? `${data.avgBalanceGrowth}%` : "5.7%"}
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
                  Total instructor earnings: {formatCurrency(data?.totalInstructorEarnings || 45000)}
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
                    data={[
                      { range: '$0-$500', count: data?.balanceRanges?.[0] || 12 },
                      { range: '$501-$1000', count: data?.balanceRanges?.[1] || 18 },
                      { range: '$1001-$2500', count: data?.balanceRanges?.[2] || 25 },
                      { range: '$2501-$5000', count: data?.balanceRanges?.[3] || 15 },
                      { range: '$5001-$10000', count: data?.balanceRanges?.[4] || 8 },
                      { range: '$10001+', count: data?.balanceRanges?.[5] || 4 }
                    ]}
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
                  Most instructor wallets ({data?.mostCommonBalanceRange || '$1001-$2500'}) have balances between $1,001 and $2,500
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
const FinancialDashboard = () => {
  const [transactionStats, setTransactionStats] = useState(null);
  const [walletStats, setWalletStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    fetchFinancialData();
  }, []);
  
  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data - in a real app, this would come from your API
      setTransactionStats({
        totalTransactions: 1248,
        totalDeposits: 782,
        totalWithdrawals: 466,
        totalDepositAmount: 125800.50,
        totalWithdrawalAmount: 87650.25,
        pendingTransactions: 32,
        completedTransactions: 1156,
        failedTransactions: 60,
        transactionGrowth: 7.8,
        depositGrowth: 12.5,
        withdrawalGrowth: 5.2,
        pendingGrowth: -2.3
      });
      
      setWalletStats({
        totalWallets: 325,
        activeWallets: 298,
        suspendedWallets: 18,
        closedWallets: 9,
        totalBalance: 287500.75,
        averageBalance: 964.77,
        walletGrowth: 5.6,
        activeWalletGrowth: 8.2,
        balanceGrowth: 11.3,
        avgBalanceGrowth: 6.8,
        totalInstructorEarnings: 156800.25,
        balanceRanges: [42, 78, 105, 65, 25, 10],
        mostCommonBalanceRange: '$1001-$2500'
      });
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Financial Dashboard
      </Typography>
      
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

export default FinancialDashboard;