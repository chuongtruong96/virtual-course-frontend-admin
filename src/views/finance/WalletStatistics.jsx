// src/components/finance/WalletStatistics.jsx
import React from 'react';
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
  CheckCircle,
  Wallet,
  RefreshCw,
  BarChart2,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { FinancialStatsCard } from './FinanceDashboard';

// Helper InfoIcon component
const InfoIcon = ({ size, color, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const WalletStatistics = ({ data, loading = false, onRefresh }) => {
  const theme = useTheme();
  
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
        
        export default WalletStatistics;