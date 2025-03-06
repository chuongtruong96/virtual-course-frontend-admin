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
  TextField
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Pending,
  AttachMoney,
  MoneyOff
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import api from '../../utils/api';
import ENDPOINTS from '../../config/endpoints';
import { formatCurrency, formatDate } from '../../utils/formatters';

const TransactionDetail = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.DETAIL(transactionId));
        setTransaction(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching transaction details');
        console.error('Error fetching transaction details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) {
      fetchTransactionDetails();
    }
  }, [transactionId]);

  const handleApproveClick = () => {
    setOpenApproveDialog(true);
  };

  const handleRejectClick = () => {
    setOpenRejectDialog(true);
  };

  const handleApproveConfirm = async () => {
    try {
      setLoading(true);
      const response = await api.put(ENDPOINTS.ADMIN.TRANSACTIONS.APPROVE_WITHDRAWAL(transactionId));
      setTransaction(response.data);
      setOpenApproveDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error approving withdrawal');
      console.error('Error approving withdrawal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    try {
      setLoading(true);
      const response = await api.put(
        ENDPOINTS.ADMIN.TRANSACTIONS.REJECT_WITHDRAWAL(transactionId),
        { reason: rejectReason }
      );
      setTransaction(response.data);
      setOpenRejectDialog(false);
      setRejectReason('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error rejecting withdrawal');
      console.error('Error rejecting withdrawal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialogs = () => {
    setOpenApproveDialog(false);
    setOpenRejectDialog(false);
    setRejectReason('');
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'PENDING':
        return <Chip icon={<Pending />} label="Pending" color="warning" />;
      case 'COMPLETED':
      case 'SUCCESS':
        return <Chip icon={<CheckCircle />} label={status} color="success" />;
      case 'FAILED':
      case 'REJECTED':
        return <Chip icon={<Cancel />} label={status} color="error" />;
      default:
        return <Chip label={status} />;
    }
  };

  const getTransactionTypeIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
      case 'CREDIT':
        return <AttachMoney color="success" />;
      case 'WITHDRAWAL':
      case 'DEBIT':
        return <MoneyOff color="error" />;
      default:
        return null;
    }
  };

  if (loading && !transaction) {
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

  if (!transaction) {
    return (
      <Box p={3}>
        <Typography>Transaction not found</Typography>
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
          Back to Transactions
        </Button>
        <Typography variant="h4">Transaction Details</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Transaction Information
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              {getTransactionTypeIcon(transaction.transactionType)}
              <Typography variant="h5" ml={1}>
                {transaction.title}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="textSecondary">Transaction ID</Typography>
                <Typography variant="body1">{transaction.id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Amount</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatCurrency(transaction.amount)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Type</Typography>
                <Typography variant="body1">{transaction.transactionType}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Status</Typography>
                {getStatusChip(transaction.statusTransaction)}
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Payment Method</Typography>
                <Typography variant="body1">{transaction.paymentMethod}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary">Wallet Balance</Typography>
                <Typography variant="body1">{formatCurrency(transaction.walletBalance)}</Typography>
              </Grid>
              {transaction.paypalPayoutId && (
                <Grid item xs={12}>
                  <Typography color="textSecondary">PayPal Payout ID</Typography>
                  <Typography variant="body1">{transaction.paypalPayoutId}</Typography>
                </Grid>
              )}
              {transaction.processedAt && (
                <Grid item xs={12}>
                  <Typography color="textSecondary">Processed At</Typography>
                  <Typography variant="body1">{formatDate(transaction.processedAt)}</Typography>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Wallet Information
            </Typography>
            {transaction.wallet && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Wallet ID</Typography>
                  <Typography variant="body1">{transaction.wallet.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Instructor ID</Typography>
                  <Typography variant="body1">{transaction.wallet.instructorId}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Wallet Status</Typography>
                  <Typography variant="body1">{transaction.wallet.statusWallet}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Current Balance</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(transaction.wallet.balance)}
                  </Typography>
                </Grid>
              </Grid>
            )}

            {transaction.transactionType === 'WITHDRAWAL' && transaction.statusTransaction === 'PENDING' && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Actions
                </Typography>
                <Box display="flex" gap={2} mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleApproveClick}
                    startIcon={<CheckCircle />}
                  >
                    Approve Withdrawal
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleRejectClick}
                    startIcon={<Cancel />}
                  >
                    Reject Withdrawal
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Approve Dialog */}
      <Dialog open={openApproveDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Approve Withdrawal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this withdrawal request for {formatCurrency(transaction?.amount)}?
            This action will transfer funds to the instructor's account.
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
            Are you sure you want to reject this withdrawal request for {formatCurrency(transaction?.amount)}?
            Please provide a reason for the rejection.
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

export default TransactionDetail;