import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  TextField, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  CircularProgress
} from '@mui/material';
import { 
  AttachMoney, 
  MoneyOff, 
  Pending, 
  CheckCircle, 
  Cancel, 
  TrendingUp 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useTransactions from '../../hooks/useTransactions';
import TransactionStatisticsChart from './TransactionStatisticsChart';
import { formatCurrency, formatDate } from '../../utils/formatters';

const TransactionDashboard = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const { 
    transactions, 
    statistics, 
    isLoading, 
    error, 
    totalPages,
    fetchTransactions, 
    fetchTransactionStatistics,
    approveWithdrawal,
    rejectWithdrawal
  } = useTransactions({ page, size, type: typeFilter, status: statusFilter });

  useEffect(() => {
    fetchTransactions({ page, size, type: typeFilter, status: statusFilter });
}, [fetchTransactions, page, size, typeFilter, statusFilter]);

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleApproveClick = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenApproveDialog(true);
  };

  const handleRejectClick = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenRejectDialog(true);
  };

  const handleApproveConfirm = async () => {
    try {
      await approveWithdrawal(selectedTransaction.id);
      setOpenApproveDialog(false);
      fetchTransactions();
      fetchTransactionStatistics();
    } catch (error) {
      console.error('Error approving withdrawal:', error);
    }
  };

  const handleRejectConfirm = async () => {
    try {
      await rejectWithdrawal(selectedTransaction.id, rejectReason);
      setOpenRejectDialog(false);
      setRejectReason('');
      fetchTransactions();
      fetchTransactionStatistics();
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
    }
  };

  const handleCloseDialogs = () => {
    setOpenApproveDialog(false);
    setOpenRejectDialog(false);
    setRejectReason('');
  };

  if (isLoading && !transactions.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error loading transactions: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Transaction Management
      </Typography>

      {/* Statistics Cards */}
      {statistics && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.primary.light }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Transactions
                    </Typography>
                    <Typography variant="h5">{statistics.totalTransactions}</Typography>
                  </Box>
                  <TrendingUp fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.success.light }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Deposits
                    </Typography>
                    <Typography variant="h5">{formatCurrency(statistics.totalDepositAmount)}</Typography>
                  </Box>
                  <AttachMoney fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.warning.light }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Withdrawals
                    </Typography>
                    <Typography variant="h5">{formatCurrency(statistics.totalWithdrawalAmount)}</Typography>
                  </Box>
                  <MoneyOff fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: theme.palette.info.light }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Pending Transactions
                    </Typography>
                    <Typography variant="h5">{statistics.pendingTransactions}</Typography>
                  </Box>
                  <Pending fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Chart */}
      {statistics && (
        <Box mb={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Transaction Statistics</Typography>
            <TransactionStatisticsChart data={statistics} />
          </Paper>
        </Box>
      )}

      {/* Filters */}
      <Box mb={3} display="flex" gap={2}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Transaction Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={handleTypeFilterChange}
            label="Transaction Type"
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="DEPOSIT">Deposit</MenuItem>
            <MenuItem value="WITHDRAWAL">Withdrawal</MenuItem>
            <MenuItem value="CREDIT">Credit</MenuItem>
            <MenuItem value="DEBIT">Debit</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="SUCCESS">Success</MenuItem>
            <MenuItem value="FAILED">Failed</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Wallet Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.transactionType}</TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell>
                    {transaction.statusTransaction === 'PENDING' && (
                      <Box display="flex" alignItems="center" color="warning.main">
                        <Pending fontSize="small" sx={{ mr: 1 }} />
                        Pending
                      </Box>
                    )}
                    {(transaction.statusTransaction === 'COMPLETED' || transaction.statusTransaction === 'SUCCESS') && (
                      <Box display="flex" alignItems="center" color="success.main">
                        <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                        {transaction.statusTransaction}
                      </Box>
                    )}
                    {(transaction.statusTransaction === 'FAILED' || transaction.statusTransaction === 'REJECTED') && (
                      <Box display="flex" alignItems="center" color="error.main">
                        <Cancel fontSize="small" sx={{ mr: 1 }} />
                        {transaction.statusTransaction}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(transaction.processedAt || transaction.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(transaction.walletBalance)}</TableCell>
                  <TableCell>
                    {transaction.transactionType === 'WITHDRAWAL' && transaction.statusTransaction === 'PENDING' && (
                      <>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="success" 
                          sx={{ mr: 1 }}
                          onClick={() => handleApproveClick(transaction)}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="error"
                          onClick={() => handleRejectClick(transaction)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 0 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination 
            count={totalPages} 
            page={page + 1} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}

      {/* Approve Dialog */}
      <Dialog open={openApproveDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Approve Withdrawal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this withdrawal request for {selectedTransaction && formatCurrency(selectedTransaction.amount)}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleApproveConfirm} color="success" variant="contained">
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Reject Withdrawal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reject this withdrawal request for {selectedTransaction && formatCurrency(selectedTransaction.amount)}?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for rejection"
            fullWidth
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleRejectConfirm} color="error" variant="contained">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionDashboard;