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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  AccountBalanceWallet,
  CheckCircle,
  Block,
  Close,
  TrendingUp,
  Edit
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useWallets from '../../hooks/useWallets';
import WalletStatisticsChart from './WalletStatisticsChart';
import { formatCurrency, formatDate } from '../../utils/formatters';

const WalletDashboard = () => {
  const theme = useTheme();
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [openBalanceDialog, setOpenBalanceDialog] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  
  const {
    wallets,
    isLoading,
    error,
    fetchWallets,
    updateWalletStatus,
    updateWalletBalance,
    getWalletStatistics
  } = useWallets();

  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchWallets({ status: statusFilter });
    
    const fetchStats = async () => {
      try {
        const stats = await getWalletStatistics();
        setStatistics(stats);
      } catch (error) {
        console.error('Error fetching wallet statistics:', error);
      }
    };
    
    fetchStats();
  }, [fetchWallets, getWalletStatistics, statusFilter]);

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleStatusClick = (wallet) => {
    setSelectedWallet(wallet);
    setNewStatus(wallet.statusWallet);
    setOpenStatusDialog(true);
  };

  const handleBalanceClick = (wallet) => {
    setSelectedWallet(wallet);
    setBalanceAmount('');
    setOpenBalanceDialog(true);
  };

  const handleStatusConfirm = async () => {
    try {
      updateWalletStatus(selectedWallet.id, newStatus);
      setOpenStatusDialog(false);
      fetchWallets({ status: statusFilter });
      const stats = await getWalletStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error updating wallet status:', error);
    }
  };

  const handleBalanceConfirm = async () => {
    try {
      if (!balanceAmount || isNaN(parseFloat(balanceAmount))) {
        return;
      }
      
      await updateWalletBalance(selectedWallet.instructorId, parseFloat(balanceAmount));
      setOpenBalanceDialog(false);
      fetchWallets({ status: statusFilter });
      const stats = await getWalletStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error updating wallet balance:', error);
    }
  };

  const handleCloseDialogs = () => {
    setOpenStatusDialog(false);
    setOpenBalanceDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return theme.palette.success.main;
      case 'SUSPENDED':
        return theme.palette.warning.main;
      case 'CLOSED':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  if (isLoading && !wallets.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error loading wallets: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Wallet Management
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
                      Total Wallets
                    </Typography>
                    <Typography variant="h5">{statistics.totalWallets}</Typography>
                  </Box>
                  <AccountBalanceWallet fontSize="large" />
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
                      Active Wallets
                    </Typography>
                    <Typography variant="h5">{statistics.activeWallets}</Typography>
                  </Box>
                  <CheckCircle fontSize="large" />
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
                      Total Balance
                    </Typography>
                    <Typography variant="h5">{formatCurrency(statistics.totalBalance)}</Typography>
                  </Box>
                  <TrendingUp fontSize="large" />
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
                      Average Balance
                    </Typography>
                    <Typography variant="h5">{formatCurrency(statistics.averageBalance)}</Typography>
                  </Box>
                  <AccountBalanceWallet fontSize="large" />
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
            <Typography variant="h6" gutterBottom>Wallet Statistics</Typography>
            <WalletStatisticsChart data={statistics} />
          </Paper>
        </Box>
      )}

      {/* Filters */}
      <Box mb={3}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Wallet Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Wallet Status"
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="SUSPENDED">Suspended</MenuItem>
            <MenuItem value="CLOSED">Closed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Wallets Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Min Limit</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wallets.length > 0 ? (
              wallets.map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell>{wallet.id}</TableCell>
                  <TableCell>{wallet.instructorId}</TableCell>
                  <TableCell>{formatCurrency(wallet.balance)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={wallet.statusWallet} 
                      sx={{ 
                        bgcolor: getStatusColor(wallet.statusWallet) + '20',
                        color: getStatusColor(wallet.statusWallet),
                        fontWeight: 'bold'
                      }} 
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(wallet.minLimit)}</TableCell>
                  <TableCell>{formatDate(wallet.lastUpdated)}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="primary" 
                      sx={{ mr: 1 }}
                      onClick={() => handleStatusClick(wallet)}
                      startIcon={<Edit />}
                    >
                      Status
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="secondary"
                      onClick={() => handleBalanceClick(wallet)}
                      startIcon={<Edit />}
                    >
                      Balance
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No wallets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Status Dialog */}
      <Dialog open={openStatusDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Update Wallet Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the status for wallet ID: {selectedWallet?.id}
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
            Add or subtract funds from wallet ID: {selectedWallet?.id}
            <br />
            Current balance: {selectedWallet && formatCurrency(selectedWallet.balance)}
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

export default WalletDashboard;