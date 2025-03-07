import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { CreditCard, DollarSign } from 'lucide-react';
import { usePayment } from '../../hooks/usePayment';

const PaymentForm = ({ courseId, courseIds, amount, onCancel, platform }) => {
  const {
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    error,
    initiatePayment,
    initiateMultiplePayment
  } = usePayment();

  const handlePayment = () => {
    if (courseIds && courseIds.length > 0) {
      initiateMultiplePayment(courseIds);
    } else if (courseId) {
      initiatePayment(courseId, platform);
    } else {
      console.error('No course ID or course IDs provided');
    }
  };

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Payment Details
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Total Amount
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom>
            {amount.toLocaleString()} VND
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {courseIds && courseIds.length > 1 
              ? `${courseIds.length} courses` 
              : 'Course payment'}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Select Payment Method
        </Typography>
        
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              mb: 2, 
              border: paymentMethod === 'paypal' ? 2 : 1,
              borderColor: paymentMethod === 'paypal' ? 'primary.main' : 'divider'
            }}
          >
            <FormControlLabel 
              value="paypal" 
              control={<Radio />} 
              label={
                <Box display="flex" alignItems="center">
                  <img 
                    src="/images/payment/paypal-logo.png" 
                    alt="PayPal" 
                    style={{ height: 24, marginRight: 8 }} 
                  />
                  <Typography>PayPal</Typography>
                </Box>
              } 
            />
          </Paper>
          
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              mb: 2, 
              border: paymentMethod === 'vnpay' ? 2 : 1,
              borderColor: paymentMethod === 'vnpay' ? 'primary.main' : 'divider'
            }}
          >
            <FormControlLabel 
              value="vnpay" 
              control={<Radio />} 
              label={
                <Box display="flex" alignItems="center">
                  <img 
                    src="/images/payment/vnpay-logo.png" 
                    alt="VNPay" 
                    style={{ height: 24, marginRight: 8 }} 
                  />
                  <Typography>VNPay</Typography>
                </Box>
              } 
            />
          </Paper>
        </RadioGroup>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button 
            variant="outlined" 
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handlePayment}
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <CreditCard />}
          >
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

PaymentForm.propTypes = {
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  courseIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  amount: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  platform: PropTypes.string
};

export default PaymentForm;