import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Pending,
  Edit,
  AccountBalanceWallet
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import api from '../../utils/api';
import ENDPOINTS from '../../config/endpoints';
import { formatCurrency, formatDate } from '../../utils/formatters';

const WalletDetail = () => {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openBalanceDialog, setOpenBalanceDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(ENDPOINTS.ADMIN.WALLETS.DETAIL(walletId));
        setWallet(response.data);
        setNewStatus(response.data.statusWallet);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching wallet details');
        console.error('Error fetching wallet details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (walletId) {
      fetchWalletDetails();
    }
  }, [walletId]);

  useEffect(() => {
    const fetchWalletTransactions = async () => {
      if (!wallet) return;
      
      try {
        setLoading(true);
        const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.LIST, {
          params: {
            page,
            size: 10,
            walletId: wallet.id
          }
        });
        
        setTransactions(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error('Error fetching wallet transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletTransactions();
  }, [wallet, page]);

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const handleStatusClick = () => {
    setOpenStatusDialog(true);
  };

  const handleBalanceClick = () => {
    setBalanceAmount('');
    setOpenBalanceDialog(true);
  };

  const handleStatusConfirm = async () => {
    try {
      setLoading(true);
      const response = await api.put(ENDPOINTS.ADMIN.WALLETS.UPDATE_STATUS(wallet.id), {
        status: newStatus
      });
      setWallet(response.data);
      setOpenStatusDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating wallet status');
      console.error('Error updating wallet status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBalanceConfirm = async () => {
    try {
      if (!balanceAmount || isNaN(parseFloat(balanceAmount))) {
        return;
      }
      
      setLoading(true);
      const response = await api.put(ENDPOINTS.ADMIN.WALLETS.UPDATE_BALANCE(wallet.instructorId), {
        amount: parseFloat(balanceAmount)
      });
      setWallet(response.data);
      setOpenBalanceDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating wallet balance');
      console.error('Error updating wallet balance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialogs = () => {
    setOpenStatusDialog(false);
    setOpenBalanceDialog(false);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip icon={<CheckCircle />} label="Active" color="success" />;
      case 'SUSPENDED':
        return <Chip icon={<Pending />} label="Suspended" color="warning" />;
      case 'CLOSED':
        return <Chip icon={<Cancel />} label="Closed" color="error" />;
      default:
        return <Chip label={status} />;
    }
  };

  if (loading && !wallet) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error: {error}</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!wallet) {
    return (
      <Box p={3}>
        <Typography>Wallet not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          Back to Wallets
        </Button>
        <Typography variant="h4">Wallet Details</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Wallet Information
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <AccountBalanceWallet fontSize="large" color="primary" />
              <Typography variant="h5" ml={1}>
                Wallet #{wallet.id}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="textSecondary">Wallet ID</Typography>
                <Typography variant="body1">{wallet.id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Instructor ID</Typography>
                <Typography variant="body1">{wallet.instructorId}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Balance</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {formatCurrency(wallet.balance)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Status</Typography>
                {getStatusChip(wallet.statusWallet)}
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Minimum Limit</Typography>
                <Typography variant="body1">{formatCurrency(wallet.minLimit)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Last Updated</Typography>
                <Typography variant="body1">{formatDate(wallet.lastUpdated)}</Typography>
              </Grid>
            </Grid>

            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              <Box display="flex" gap={2} mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStatusClick}
                  startIcon={<Edit />}
                >
                  Update Status
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBalanceClick}
                  startIcon={<Edit />}
                >
                  Update Balance
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Instructor Information
            </Typography>
            {wallet.instructor && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Name</Typography>
                  <Typography variant="body1">
                    {wallet.instructor.firstName} {wallet.instructor.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Email</Typography>
                  <Typography variant="body1">{wallet.instructor.account?.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Phone</Typography>
                  <Typography variant="body1">{wallet.instructor.phone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Status</Typography>
                  <Typography variant="body1">{wallet.instructor.status}</Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Transaction History
        </Typography>
        
        <TableContainer>
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
                        <Chip icon={<Pending />} label="Pending" color="warning" size="small" />
                      )}
                      {(transaction.statusTransaction === 'COMPLETED' || transaction.statusTransaction === 'SUCCESS') && (
                        <Chip icon={<CheckCircle />} label={transaction.statusTransaction} color="success" size="small" />
                      )}
                      {(transaction.statusTransaction === 'FAILED' || transaction.statusTransaction === 'REJECTED') && (
                        <Chip icon={<Cancel />} label={transaction.statusTransaction} color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(transaction.processedAt || transaction.createdAt)}</TableCell>
                    <TableCell>{formatCurrency(transaction.walletBalance)}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/dashboard/finance/transactions/${transaction.id}`)}
                      >
                        View
                      </Button>
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
      </Paper>

      {/* Update Status Dialog */}
      <Dialog open={openStatusDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Update Wallet Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the status for wallet ID: {wallet.id}
          </DialogContentText>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="SUSPENDED">Suspended</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleStatusConfirm} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Balance Dialog */}
      <Dialog open={openBalanceDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Update Wallet Balance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add or subtract funds from wallet ID: {wallet.id}
            <br />
            Current balance: {formatCurrency(wallet.balance)}
            <br />
            <strong>Note:</strong> Use positive values to add funds, negative values to subtract.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={balanceAmount}
            onChange={(e) => setBalanceAmount(e.target.value)}
            InputProps={{
              startAdornment: <Box component="span" mr={1}>$</Box>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleBalanceConfirm} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WalletDetail;