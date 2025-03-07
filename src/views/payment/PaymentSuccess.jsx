import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { CheckCircle, ArrowLeft, Download, Calendar, CreditCard } from 'lucide-react';
import { usePayment } from '../../hooks/usePayment';
import { format } from 'date-fns';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { executePaypalPayment, isProcessing, error } = usePayment();
  
  // Get transaction data from location state (for direct navigation)
  // or process PayPal parameters from URL
  const transaction = location.state?.transaction;
  const paymentId = searchParams.get('paymentId');
  const payerId = searchParams.get('PayerID');
  
  // For VNPay
  const vnpTxnRef = searchParams.get('vnp_TxnRef');
  const vnpTransactionStatus = searchParams.get('vnp_TransactionStatus');
  
  useEffect(() => {
    // If we have PayPal parameters but no transaction data, execute the payment
    if (paymentId && payerId && !transaction && !isProcessing) {
      executePaypalPayment(paymentId, payerId);
    }
  }, [paymentId, payerId, transaction, executePaypalPayment, isProcessing]);

  if (isProcessing) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Finalizing your payment...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowLeft />}
          onClick={() => navigate('/courses')}
        >
          Return to Courses
        </Button>
      </Box>
    );
  }

  // For VNPay success
  if (vnpTxnRef && vnpTransactionStatus === '00') {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle color="success" size={60} />
            <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Your VNPay payment has been processed successfully.
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ textAlign: 'left', mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Transaction Reference:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {vnpTxnRef}
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" mt={4}>
              <Button
                variant="outlined"
                startIcon={<ArrowLeft />}
                onClick={() => navigate('/courses')}
              >
                Browse Courses
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/student/my-courses')}
              >
                Go to My Courses
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // For PayPal or direct navigation with transaction data
  if (!transaction) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          No transaction details found. Your payment might still be processing.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowLeft />}
          onClick={() => navigate('/courses')}
        >
          Return to Courses
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircle color="green" size={60} />
          <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Your payment has been processed successfully.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ textAlign: 'left' }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle2">Transaction ID:</Typography>
              <Typography variant="body2">{transaction.id || transaction.transactionId}</Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle2">Amount:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {transaction.amount?.toLocaleString() || '0'} VND
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle2">Payment Method:</Typography>
              <Chip 
                icon={<CreditCard size={16} />} 
                label={transaction.paymentMethod || 'Online Payment'} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            </Box>
            
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle2">Date:</Typography>
              <Typography variant="body2">
                {transaction.paymentDate ? format(new Date(transaction.paymentDate), 'MMM dd, yyyy HH:mm') : 'N/A'}
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle2">Status:</Typography>
              <Chip 
                label={transaction.status || 'Completed'} 
                size="small" 
                color="success" 
              />
            </Box>
          </Box>
          
          <Box mt={3} p={2} bgcolor="background.paper" borderRadius={1}>
            <Typography variant="subtitle2" gutterBottom>
              Course{transaction.courses?.length > 1 ? 's' : ''}:
            </Typography>
            {transaction.courses ? (
              transaction.courses.map((course, index) => (
                <Typography key={index} variant="body2" gutterBottom>
                  {course.titleCourse || course.title}
                </Typography>
              ))
            ) : (
              <Typography variant="body2">
                {transaction.courseName || transaction.courseTitle || 'Course purchase'}
              </Typography>
            )}
          </Box>
          
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => window.print()}
            >
              Download Receipt
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/student/my-courses')}
            >
              Go to My Courses
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentSuccess;