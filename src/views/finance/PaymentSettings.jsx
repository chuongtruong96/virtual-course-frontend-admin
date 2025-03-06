import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { Save } from '@mui/icons-material';

const PaymentSettings = () => {
  const [settings, setSettings] = useState({
    paypalClientId: 'AYSq3RDGsmBLJE-otTkBtM-jBRd1TCQwFf9RGfwddNXWz0uFU9ztymylOhRS',
    paypalClientSecret: '****************************************',
    paypalSandboxMode: true,
    withdrawalMinAmount: 50,
    withdrawalProcessingFee: 2.5,
    withdrawalProcessingTime: 3,
    automaticApproval: false,
    notifyAdminOnWithdrawal: true,
    notifyInstructorOnProcessed: true
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setSettings({
      ...settings,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the settings to your backend
    console.log('Saving settings:', settings);
    setSaved(true);
  };

  const handleCloseSnackbar = () => {
    setSaved(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Payment Settings
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          PayPal Integration
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PayPal Client ID"
                name="paypalClientId"
                value={settings.paypalClientId}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PayPal Client Secret"
                name="paypalClientSecret"
                value={settings.paypalClientSecret}
                onChange={handleChange}
                margin="normal"
                type="password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.paypalSandboxMode}
                    onChange={handleChange}
                    name="paypalSandboxMode"
                    color="primary"
                  />
                }
                label="Use PayPal Sandbox Mode (for testing)"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Withdrawal Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Minimum Withdrawal Amount ($)"
                name="withdrawalMinAmount"
                value={settings.withdrawalMinAmount}
                onChange={handleChange}
                margin="normal"
                type="number"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Processing Fee (%)"
                name="withdrawalProcessingFee"
                value={settings.withdrawalProcessingFee}
                onChange={handleChange}
                margin="normal"
                type="number"
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Processing Time (days)"
                name="withdrawalProcessingTime"
                value={settings.withdrawalProcessingTime}
                onChange={handleChange}
                margin="normal"
                type="number"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.automaticApproval}
                    onChange={handleChange}
                    name="automaticApproval"
                    color="primary"
                  />
                }
                label="Enable Automatic Approval for Withdrawals (not recommended)"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Notification Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifyAdminOnWithdrawal}
                    onChange={handleChange}
                    name="notifyAdminOnWithdrawal"
                    color="primary"
                  />
                }
                label="Notify Administrators on New Withdrawal Requests"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifyInstructorOnProcessed}
                    onChange={handleChange}
                    name="notifyInstructorOnProcessed"
                    color="primary"
                  />
                }
                label="Notify Instructors When Withdrawals Are Processed"
              />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Save />}
            >
              Save Settings
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={saved}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Payment settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentSettings;