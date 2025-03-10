import React, { useState, useMemo, useContext, useEffect } from 'react';
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
  DialogContentText,
  DialogActions,
  TablePagination,
  Alert,
  CircularProgress,
  Grid
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
  Filter,
  UserCog,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import useAccounts from '../../hooks/useAccounts';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
const AccountList = () => {
  const navigate = useNavigate();
  
  // State management
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    accountId: null,
    action: null,
    title: '',
    message: '',
    reason: ''
  });
  const authContext = useContext(AuthContext);
  const auth = authContext || { user: {} };
  const isAdmin = auth?.user?.roles?.includes('ROLE_ADMIN');  // Fetch data using the accounts hook
  const { accounts, isLoading, isError, error, updateStatus, refetch } = useAccounts(statusFilter);

  // Filter and sort accounts
  const filteredAndSortedAccounts = useMemo(() => {
    return (accounts || [])
      .filter(account => {
        // Filter by search query
        const matchesSearch =
          account.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          account.email?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Filter by role if a specific role is selected
        const matchesRole = 
          roleFilter === 'all' || 
          (account.roles && account.roles.some(role => 
            role.includes(roleFilter) || 
            (roleFilter === 'ROLE_ADMIN' && role === 'ADMIN') ||
            (roleFilter === 'ROLE_STUDENT' && role === 'STUDENT') ||
            (roleFilter === 'ROLE_INSTRUCTOR' && role === 'INSTRUCTOR')
          ));
        
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        // Handle sorting for nested properties
        let aValue, bValue;
        
        if (sortConfig.key === 'roles') {
          // Sort by the first role in the array
          aValue = a.roles && a.roles.length > 0 ? a.roles[0] : '';
          bValue = b.roles && b.roles.length > 0 ? b.roles[0] : '';
        } else {
          aValue = a[sortConfig.key] || '';
          bValue = b[sortConfig.key] || '';
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [accounts, searchQuery, sortConfig, roleFilter]);

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
      message: `Are you sure you want to ${newStatus === 'ACTIVE' ? 'activate' : 'deactivate'} this account?`,
      reason: ''
    });
  };

  const handleConfirmAction = async () => {
    try {
      await updateStatus({
        accountId: confirmDialog.accountId,
        status: confirmDialog.action,
        reason: confirmDialog.reason || 'Admin action'
      });
      setConfirmDialog({ open: false, accountId: null, action: null, title: '', message: '', reason: '' });
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
    if (role.includes('ADMIN') || role === 'ADMIN') return 'error';
    if (role.includes('INSTRUCTOR') || role === 'INSTRUCTOR') return 'primary';
    if (role.includes('STUDENT') || role === 'STUDENT') return 'info';
    return 'default';
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
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
            
            <Button 
              variant="outlined" 
              startIcon={<RefreshCw size={20} />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by username or email..."
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
          </Grid>
          <Grid item xs={12} md={3.5}>
            <FormControl size="small" fullWidth>
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
          </Grid>
          <Grid item xs={12} md={3.5}>
            <FormControl size="small" fullWidth>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <Shield size={20} />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                <MenuItem value="ROLE_INSTRUCTOR">Instructor</MenuItem>
                <MenuItem value="ROLE_STUDENT">Student</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

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
                    {sortConfig.key === 'username' && (
                      <ArrowUpDown size={16} style={{ marginLeft: 4 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                  <Box display="flex" alignItems="center">
                    <Mail size={16} style={{ marginRight: 8 }} />
                    Email
                    {sortConfig.key === 'email' && (
                      <ArrowUpDown size={16} style={{ marginLeft: 4 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell onClick={() => handleSort('roles')} style={{ cursor: 'pointer' }}>
                  <Box display="flex" alignItems="center">
                    <Shield size={16} style={{ marginRight: 8 }} />
                    Roles
                    {sortConfig.key === 'roles' && (
                      <ArrowUpDown size={16} style={{ marginLeft: 4 }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                  <Box display="flex" alignItems="center">
                    Status
                    {sortConfig.key === 'status' && (
                      <ArrowUpDown size={16} style={{ marginLeft: 4 }} />
                    )}
                  </Box>
                </TableCell>
                {/* <TableCell>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAccounts.length > 0 ? (
                paginatedAccounts.map((account) => (
                  <TableRow key={account.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <User size={20} style={{ marginRight: 8 }} />
                        {account.username}
                      </Box>
                    </TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
  <Box display="flex" gap={1} flexWrap="wrap">
    {account.roles?.map((role) => (
      <Chip
        key={role}
        label={role.replace('ROLE_', '')}
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
      {isAdmin && (
        <>
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
        </>
      )}
    </Box>
  </TableCell>
</TableRow>
))
) : (
<TableRow>
  <TableCell colSpan={5} align="center">
    <Typography variant="body1" py={3}>
      No accounts found matching your criteria
    </Typography>
  </TableCell>
</TableRow>
)}
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
  rowsPerPageOptions={[5, 10, 25, 50]}
  labelRowsPerPage="Rows per page:"
/>

{/* Confirmation Dialog */}
<Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}>
  <DialogTitle>{confirmDialog.title}</DialogTitle>
  <DialogContent>
    <DialogContentText>{confirmDialog.message}</DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      id="reason"
      label="Reason (optional)"
      type="text"
      fullWidth
      variant="outlined"
      value={confirmDialog.reason}
      onChange={(e) => setConfirmDialog({ ...confirmDialog, reason: e.target.value })}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })} color="inherit">
      Cancel
    </Button>
    <Button 
      onClick={handleConfirmAction} 
      color={confirmDialog.action === 'ACTIVE' ? 'success' : 'error'} 
      variant="contained"
    >
      Confirm
    </Button>
  </DialogActions>
</Dialog>
</CardContent>
</Card>
);
};

export default AccountList;