import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Tooltip,
  Paper,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  UserCheck, 
  UserX, 
  Search, 
  AlertTriangle,
  ArrowUpDown,
  User,
  Mail,
  Shield,
  Filter
} from 'lucide-react';
import useAccounts from '../../hooks/useAccounts';

const AccountList = () => {
  // State management
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });
  const [confirmDialog, setConfirmDialog] = useState({ 
    open: false, 
    accountId: null, 
    action: null,
    title: '',
    message: ''
  });

  // Fetch data using the accounts hook
  const { accounts, isLoading, isError, error, updateStatus } = useAccounts(statusFilter);

  // Filter and sort accounts
  const filteredAndSortedAccounts = useMemo(() => {
    return (accounts || [])
      .filter(account => {
        const matchesSearch = 
          account.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          account.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [accounts, searchQuery, sortConfig]);

  // Pagination
  const paginatedAccounts = filteredAndSortedAccounts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handlers
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleStatusChange = async (accountId, newStatus) => {
    setConfirmDialog({
      open: true,
      accountId,
      action: newStatus,
      title: `Confirm Account ${newStatus === 'ACTIVE' ? 'Activation' : 'Deactivation'}`,
      message: `Are you sure you want to ${newStatus === 'ACTIVE' ? 'activate' : 'deactivate'} this account?`
    });
  };

  const handleConfirmAction = async () => {
    try {
      await updateStatus({
        accountId: confirmDialog.accountId,
        status: confirmDialog.action
      });
      setConfirmDialog({ open: false, accountId: null, action: null, title: '', message: '' });
    } catch (error) {
      console.error('Error updating account status:', error);
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'INACTIVE': return 'error';
      case 'BANNED': return 'error';
      case 'SUSPENDED': return 'error';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const getRoleChipColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'INSTRUCTOR': return 'primary';
      case 'STUDENT': return 'info';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            Account Management
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              size="small"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <Filter size={20} />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="BANNED">Banned</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTriangle size={20} style={{ marginRight: 8 }} />
            {error.message || 'Error loading accounts'}
          </Alert>
        )}

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort('username')} style={{ cursor: 'pointer' }}>
                  <Box display="flex" alignItems="center">
                    <User size={16} style={{ marginRight: 8 }} />
                    Username
                    <ArrowUpDown size={16} style={{ marginLeft: 4 }} />
                  </Box>
                </TableCell>
                <TableCell onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                  <Box display="flex" alignItems="center">
                    <Mail size={16} style={{ marginRight: 8 }} />
                    Email
                    <ArrowUpDown size={16} style={{ marginLeft: 4 }} />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Shield size={16} style={{ marginRight: 8 }} />
                    Roles
                  </Box>
                </TableCell>
                <TableCell onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                  <Box display="flex" alignItems="center">
                    Status
                    <ArrowUpDown size={16} style={{ marginLeft: 4 }} />
                  </Box>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAccounts.map((account) => (
                <TableRow key={account.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <User size={20} style={{ marginRight: 8 }} />
                      {account.username}
                    </Box>
                  </TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {account.roles?.map((role) => (
                        <Chip
                          key={role}
                          label={role}
                          size="small"
                          color={getRoleChipColor(role)}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={account.status}
                      color={getStatusChipColor(account.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Activate Account">
                        <span>
                          <IconButton
                            color="success"
                            onClick={() => handleStatusChange(account.id, 'ACTIVE')}
                            disabled={account.status === 'ACTIVE'}
                            size="small"
                          >
                            <UserCheck size={20} />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Deactivate Account">
                        <span>
                          <IconButton
                            color="error"
                            onClick={() => handleStatusChange(account.id, 'INACTIVE')}
                            disabled={account.status === 'INACTIVE'}
                            size="small"
                          >
                            <UserX size={20} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredAndSortedAccounts.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false })}>
          <DialogTitle>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            <Typography>{confirmDialog.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog({ open: false })} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} color={confirmDialog.action === 'ACTIVE' ? 'success' : 'error'} variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AccountList;