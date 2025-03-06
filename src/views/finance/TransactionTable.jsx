import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Hàm helper để hiển thị trạng thái giao dịch
const getStatusChip = (status) => {
  switch (status) {
    case 'COMPLETED':
      return <Chip label="Completed" color="success" />;
    case 'PENDING':
      return <Chip label="Pending" color="warning" />;
    case 'FAILED':
      return <Chip label="Failed" color="error" />;
    case 'REJECTED':
      return <Chip label="Rejected" color="error" />;
    default:
      return <Chip label={status} />;
  }
};

// Hàm helper để hiển thị loại giao dịch
const getTypeChip = (type) => {
  switch (type) {
    case 'DEPOSIT':
      return <Chip label="Deposit" color="info" />;
    case 'WITHDRAWAL':
      return <Chip label="Withdrawal" color="secondary" />;
    default:
      return <Chip label={type} />;
  }
};

const TransactionTable = ({ 
  transactions, 
  totalItems, 
  currentPage, 
  pageSize, 
  onPageChange, 
  onPageSizeChange,
  onViewDetails,
  onApproveWithdrawal,
  onRejectWithdrawal,
  loading,
  filterOptions
}) => {
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const handleViewDetails = (id) => {
    if (onViewDetails) {
      onViewDetails(id);
    } else {
      navigate(`/dashboard/finance/transactions/${id}`);
    }
  };

  const handleApproveWithdrawal = (id) => {
    onApproveWithdrawal(id);
  };

  const handleOpenRejectDialog = (id) => {
    setSelectedTransactionId(id);
    setRejectDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectReason('');
    setSelectedTransactionId(null);
  };

  const handleRejectWithdrawal = () => {
    onRejectWithdrawal({
      id: selectedTransactionId,
      reason: rejectReason
    });
    handleCloseRejectDialog();
  };

  const handleFilterOpen = () => {
    setOpenFilter(true);
  };

  const handleFilterClose = () => {
    setOpenFilter(false);
  };

  const handleFilterApply = () => {
    if (filterOptions && filterOptions.onFilterChange) {
      filterOptions.onFilterChange(filterType, filterStatus);
    }
    handleFilterClose();
  };

  const handleFilterReset = () => {
    setFilterType('');
    setFilterStatus('');
    if (filterOptions && filterOptions.onFilterChange) {
      filterOptions.onFilterChange('', '');
    }
    handleFilterClose();
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div">
          Transactions
        </Typography>
        {filterOptions && (
          <Button 
            startIcon={<FilterListIcon />} 
            onClick={handleFilterOpen}
            variant="outlined"
          >
            Filter
          </Button>
        )}
      </Box>
      
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="transactions table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No transactions found</TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.title}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>{getTypeChip(transaction.transactionType)}</TableCell>
                  <TableCell>{getStatusChip(transaction.statusTransaction)}</TableCell>
                  <TableCell>
                    {transaction.createdAt ? format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleViewDetails(transaction.id)}
                        title="View details"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      
                      {transaction.transactionType === 'WITHDRAWAL' && transaction.statusTransaction === 'PENDING' && (
                        <>
                          <IconButton 
                            size="small" 
                            color="success" 
                            onClick={() => handleApproveWithdrawal(transaction.id)}
                            title="Approve withdrawal"
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleOpenRejectDialog(transaction.id)}
                            title="Reject withdrawal"
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalItems}
        rowsPerPage={pageSize}
        page={currentPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPageSizeChange}
      />

      {/* Filter Dialog */}
      {filterOptions && (
        <Dialog open={openFilter} onClose={handleFilterClose}>
          <DialogTitle>Filter Transactions</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={filterType}
                  label="Transaction Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="DEPOSIT">Deposit</MenuItem>
                  <MenuItem value="WITHDRAWAL">Withdrawal</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="FAILED">Failed</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFilterReset}>Reset</Button>
            <Button onClick={handleFilterClose}>Cancel</Button>
            <Button onClick={handleFilterApply} variant="contained">Apply</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog}>
        <DialogTitle>Reject Withdrawal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting this withdrawal request.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Cancel</Button>
          <Button onClick={handleRejectWithdrawal} color="error" variant="contained">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TransactionTable;