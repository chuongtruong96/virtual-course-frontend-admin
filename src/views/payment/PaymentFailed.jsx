import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert
} from '@mui/material';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get error message from location state
  const errorMessage = location.state?.error || 'Your payment could not be processed.';

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <XCircle color="red" size={60} />
          <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
            Payment Failed
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            We couldn't process your payment.
          </Typography>
          
          <Alert severity="error" sx={{ mt: 3, mb: 3, textAlign: 'left' }}>
            {errorMessage}
          </Alert>
          
          <Typography variant="body2" sx={{ mb: 4 }}>
            Please try again or contact support if the problem persists.
          </Typography>
          
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              startIcon={<ArrowLeft />}
              onClick={() => navigate('/courses')}
            >
              Return to Courses
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshCw />}
              onClick={() => navigate(-1)}
            >
              Try Again
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentFailed;