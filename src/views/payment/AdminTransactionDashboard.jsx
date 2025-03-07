import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Pagination,
  Divider
} from '@mui/material';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Search,
  Download,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  BarChart2,
  PieChart
} from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import AdminTransactionService from '../../services/AdminTransactionService';
import { Link } from 'react-router-dom';

const AdminTransactionDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Get transaction statistics
  const { 
    data: statistics, 
    isLoading: isStatsLoading, 
    isError: isStatsError,
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['transaction-statistics'],
    queryFn: () => AdminTransactionService.getTransactionStatistics()
  });
  
  // Map tab value to transaction type
  useEffect(() => {
    // When tab changes, update the typeFilter
    switch(tabValue) {
      case 0: // All Transactions
        setTypeFilter('all');
        break;
      case 1: // Deposits
        setTypeFilter('DEPOSIT');
        break;
      case 2: // Withdrawals
        setTypeFilter('WITHDRAWAL');
        break;
      case 3: // Refunds
        setTypeFilter('REFUND');
        break;
      default:
        setTypeFilter('all');
    }
    // Reset to first page when changing tabs
    setPage(1);
  }, [tabValue]);
  
  // Get transactions list
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
    error: transactionsError,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ['admin-transactions', page, rowsPerPage, typeFilter, statusFilter],
    queryFn: () => AdminTransactionService.getAllTransactions(
      page - 1, 
      rowsPerPage, 
      typeFilter === 'all' ? null : typeFilter,
      statusFilter === 'all' ? null : statusFilter
    )
  });
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };
  
  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    // Also update the tab to match the selected type
    switch(event.target.value) {
      case 'all':
        setTabValue(0);
        break;
      case 'DEPOSIT':
        setTabValue(1);
        break;
      case 'WITHDRAWAL':
        setTabValue(2);
        break;
      case 'REFUND':
        setTabValue(3);
        break;
      default:
        setTabValue(0);
    }
    setPage(1);
  };
  
  const handleRefresh = () => {
    refetchStats();
    refetchTransactions();
  };
  
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'SUCCESS':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
      case 'CANCELLED':
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '0 VND';
    return `${value.toLocaleString()} VND`;
  };
  
  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  
  // Filter transactions based on search term
  const filteredTransactions = transactionsData?.content?.filter(transaction => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.id.toString().includes(searchLower) ||
      (transaction.studentName && transaction.studentName.toLowerCase().includes(searchLower)) ||
      (transaction.courseName && transaction.courseName.toLowerCase().includes(searchLower)) ||
      (transaction.paymentMethod && transaction.paymentMethod.toLowerCase().includes(searchLower))
    );
  }) || [];
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Transaction Management
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {isStatsLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      formatCurrency(statistics?.totalRevenue || 0)
                    )}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: 'success.light', 
                    p: 1.5, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <DollarSign size={24} color="green" />
                </Box>
              </Box>
              <Typography variant="caption" color="success.main" display="flex" alignItems="center">
                <TrendingUp size={14} style={{ marginRight: 4 }} />
                {isStatsLoading ? '...' : `${statistics?.revenueGrowth || 0}%`} from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Transactions
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {isStatsLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      statistics?.totalTransactions || 0
                    )}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    p: 1.5, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CreditCard size={24} color="primary" />
                </Box>
              </Box>
              <Typography variant="caption" color="primary.main" display="flex" alignItems="center">
                <Calendar size={14} style={{ marginRight: 4 }} />
                {isStatsLoading ? '...' : statistics?.transactionsThisMonth || 0} this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Average Order Value
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {isStatsLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      formatCurrency(statistics?.averageOrderValue || 0)
                    )}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: 'info.light', 
                    p: 1.5, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <BarChart2 size={24} color="info" />
                </Box>
              </Box>
              <Typography variant="caption" color="info.main" display="flex" alignItems="center">
                <TrendingUp size={14} style={{ marginRight: 4 }} />
                {isStatsLoading ? '...' : `${statistics?.aovGrowth || 0}%`} increase
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Success Rate
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {isStatsLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      `${statistics?.successRate || 0}%`
                    )}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    bgcolor: 'warning.light', 
                    p: 1.5, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PieChart size={24} color="warning" />
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {isStatsLoading ? '...' : statistics?.failedTransactions || 0} failed transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All Transactions" />
          <Tab label="Deposits" />
          <Tab label="Withdrawals" />
          <Tab label="Refunds" />
        </Tabs>
      </Paper>
      
      {/* Filters and Search */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" gap={2}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={handleTypeFilterChange}
              label="Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="DEPOSIT">Deposit</MenuItem>
              <MenuItem value="WITHDRAWAL">Withdrawal</MenuItem>
              <MenuItem value="REFUND">Refund</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box display="flex" gap={2}>
          <TextField
            placeholder="Search transactions..."
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={18} />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
          >
            Export
          </Button>
        </Box>
      </Box>
      
      {/* Transactions Table */}
      {isTransactionsLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : isTransactionsError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {transactionsError?.message || 'Failed to load transactions'}
        </Alert>
      ) : filteredTransactions.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No transactions found matching your criteria
        </Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Course/Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>#{transaction.id}</TableCell>
                    <TableCell>
                      {formatDate(transaction.createdAt || transaction.processedAt)}
                    </TableCell>
                    <TableCell>{transaction.studentName || 'N/A'}</TableCell>
                    <TableCell>{transaction.courseName || transaction.description || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>{transaction.paymentMethod || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.type || 'N/A'} 
                        size="small"
                        color={
                          transaction.type === 'DEPOSIT' ? 'success' :
                          transaction.type === 'WITHDRAWAL' ? 'warning' :
                          transaction.type === 'REFUND' ? 'error' : 'default'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.status || 'N/A'} 
                        size="small"
                        color={getStatusColor(transaction.status)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" justifyContent="flex-end">
                        <IconButton 
                          component={Link} 
                          to={`/dashboard/finance/transactions/${transaction.id}`}
                          size="small"
                        >
                          <Eye size={18} />
                        </IconButton>
                        
                        {transaction.type === 'WITHDRAWAL' && transaction.status === 'PENDING' && (
                          <>
                            <IconButton 
                              size="small"
                              color="success"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to approve this withdrawal?')) {
                                  AdminTransactionService.approveWithdrawal(transaction.id)
                                    .then(() => {
                                      refetchTransactions();
                                      refetchStats();
                                    });
                                }
                              }}
                            >
                              <CheckCircle size={18} />
                            </IconButton>
                            <IconButton 
                              size="small"
                              color="error"
                              onClick={() => {
                                const reason = prompt('Please provide a reason for rejection:');
                                if (reason) {
                                  AdminTransactionService.rejectWithdrawal(transaction.id, reason)
                                    .then(() => {
                                      refetchTransactions();
                                      refetchStats();
                                    });
                                }
                              }}
                            >
                              <XCircle size={18} />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                label="Rows per page"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            
            <Pagination
              count={transactionsData?.totalPages || 1}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
      
      <Divider sx={{ my: 4 }} />
      
      {/* Analytics Links */}
      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="outlined"
          startIcon={<BarChart2 size={18} />}
          component={Link}
          to="/dashboard/finance/transactions/statistics"
        >
          View Detailed Analytics
        </Button>
        <Button
          variant="outlined"
          startIcon={<Download size={18} />}
          onClick={() => {
            alert('Report generation feature coming soon!');
          }}
        >
          Generate Reports
        </Button>
      </Box>
    </Box>
  );
};

export default AdminTransactionDashboard;