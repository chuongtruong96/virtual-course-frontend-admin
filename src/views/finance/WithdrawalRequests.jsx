import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Pagination
} from '@mui/material';
import { CheckCircle, Cancel, Pending } from '@mui/icons-material';
import api from '../../utils/api';
import ENDPOINTS from '../../config/endpoints';
import { formatCurrency, formatDate } from '../../utils/formatters';

const WithdrawalRequests = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchWithdrawals();
  }, [page]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      // Fetch only WITHDRAWAL type transactions with PENDING status
      const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.LIST, {
        params: {
          page,
          size: 10,
          type: 'WITHDRAWAL',
          status: 'PENDING'
        }
      });
      
      setWithdrawals(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching withdrawal requests');
      console.error('Error fetching withdrawal requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  const handleApproveClick = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setOpenApproveDialog(true);
  };

  const handleRejectClick = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setOpenRejectDialog(true);
  };

  const handleApproveConfirm = async () => {
    try {
      setLoading(true);
      await api.put(ENDPOINTS.ADMIN.TRANSACTIONS.APPROVE_WITHDRAWAL(selectedWithdrawal.id));
      setOpenApproveDialog(false);
      fetchWithdrawals();
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
      await api.put(
        ENDPOINTS.ADMIN.TRANSACTIONS.REJECT_WITHDRAWAL(selectedWithdrawal.id),
        { reason: rejectReason }
      );
      setOpenRejectDialog(false);
      setRejectReason('');
      fetchWithdrawals();
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

  if (loading && !withdrawals.length) {
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
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Pending Withdrawal Requests
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1">
          This page shows all pending withdrawal requests from instructors. Review and process these requests to approve or reject them.
        </Typography>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Wallet Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {withdrawals.length > 0 ? (
              withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>{withdrawal.id}</TableCell>
                  <TableCell>{withdrawal.walletId}</TableCell>
                  <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                  <TableCell>{withdrawal.paymentMethod}</TableCell>
                  <TableCell>{formatDate(withdrawal.createdAt)}</TableCell>
                  <TableCell>{formatCurrency(withdrawal.walletBalance)}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="success" 
                      sx={{ mr: 1 }}
                      onClick={() => handleApproveClick(withdrawal)}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="error"
                      onClick={() => handleRejectClick(withdrawal)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No pending withdrawal requests
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

      {/* Approve Dialog */}
      <Dialog open={openApproveDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Approve Withdrawal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this withdrawal request for {selectedWithdrawal && formatCurrency(selectedWithdrawal.amount)}?
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
            Are you sure you want to reject this withdrawal request for {selectedWithdrawal && formatCurrency(selectedWithdrawal.amount)}?
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

export default WithdrawalRequests;