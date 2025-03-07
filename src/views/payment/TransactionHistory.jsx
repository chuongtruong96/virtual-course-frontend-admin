import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';

const TransactionHistory = ({ studentId }) => {
  const {
    transactions,
    isLoading,
    isError,
    error,
    fetchTransactionDetails
  } = useTransactionHistory(studentId);
  
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleViewDetails = async (transactionId) => {
    setIsDetailsLoading(true);
    setDetailsError(null);
    try {
      const details = await fetchTransactionDetails(transactionId);
      setSelectedTransaction(details);
      setDetailsDialogOpen(true);
    } catch (err) {
      setDetailsError(err.message || 'Failed to load transaction details');
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDetailsDialogOpen(false);
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
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error?.message || 'Failed to load transaction history'}
      </Alert>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={4}>
            <FileText size={48} color="#ccc" />
            <Typography variant="h6" sx={{ mt: 2 }}>
              No Transactions Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You haven't made any purchases yet.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Transaction History
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} hover>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>
                  {transaction.paymentDate 
                    ? format(new Date(transaction.paymentDate), 'MMM dd, yyyy')
                    : 'N/A'
                  }
                </TableCell>
                <TableCell>
                  {transaction.courseName || transaction.courseTitle || 'Multiple Courses'}
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium">
                    {transaction.amount?.toLocaleString() || '0'} VND
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<CreditCard size={14} />}
                    label={transaction.paymentMethod || 'Online Payment'} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={transaction.status || 'Unknown'} 
                    size="small"
                    color={getStatusColor(transaction.status)}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewDetails(transaction.id)}
                      disabled={isDetailsLoading}
                    >
                      <Eye size={18} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Transaction Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Transaction Details
        </DialogTitle>
        <DialogContent dividers>
          {isDetailsLoading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress />
            </Box>
          ) : detailsError ? (
            <Alert severity="error">{detailsError}</Alert>
          ) : selectedTransaction ? (
            <Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle2">Transaction ID:</Typography>
                <Typography variant="body2">{selectedTransaction.id}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle2">Date:</Typography>
                <Typography variant="body2" display="flex" alignItems="center">
                  <Calendar size={16} style={{ marginRight: 4 }} />
                  {selectedTransaction.paymentDate 
                    ? format(new Date(selectedTransaction.paymentDate), 'MMM dd, yyyy HH:mm:ss')
                    : 'N/A'
                  }
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle2">Amount:</Typography>
                <Typography variant="body2" fontWeight="bold" display="flex" alignItems="center">
                  <DollarSign size={16} style={{ marginRight: 4 }} />
                  {selectedTransaction.amount?.toLocaleString() || '0'} VND
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle2">Payment Method:</Typography>
                <Chip 
                  icon={<CreditCard size={14} />}
                  label={selectedTransaction.paymentMethod || 'Online Payment'} 
                  size="small" 
                  variant="outlined"
                />
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle2">Status:</Typography>
                <Chip 
                  label={selectedTransaction.status || 'Unknown'} 
                  size="small"
                  color={getStatusColor(selectedTransaction.status)}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Course Details:
              </Typography>
              
              {selectedTransaction.courses ? (
                selectedTransaction.courses.map((course, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2, mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {course.titleCourse || course.title}
                    </Typography>
                    {course.price && (
                      <Typography variant="body2" color="text.secondary">
                        Price: {course.price.toLocaleString()} VND
                      </Typography>
                    )}
                  </Paper>
                ))
              ) : (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {selectedTransaction.courseName || selectedTransaction.courseTitle || 'Course purchase'}
                  </Typography>
                  {selectedTransaction.coursePrice && (
                    <Typography variant="body2" color="text.secondary">
                      Price: {selectedTransaction.coursePrice.toLocaleString()} VND
                    </Typography>
                  )}
                </Paper>
              )}
              
              {selectedTransaction.notes && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Notes:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2">
                      {selectedTransaction.notes}
                    </Typography>
                  </Paper>
                </>
              )}
            </Box>
          ) : (
            <Typography>No transaction details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {selectedTransaction && (
            <Button 
              startIcon={<Download />}
              onClick={() => window.print()}
            >
              Download Receipt
            </Button>
          )}
          <Button onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

TransactionHistory.propTypes = {
  studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default TransactionHistory;