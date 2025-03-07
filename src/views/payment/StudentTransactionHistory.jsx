// src/views/student/StudentTransactionHistory.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import { Home, User, CreditCard } from 'lucide-react';
import TransactionHistory from '../../components/payment/TransactionHistory';

const StudentTransactionHistory = () => {
  const { studentId } = useParams();
  
  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          href="/dashboard/default"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Home size={18} style={{ marginRight: 8 }} />
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/dashboard/student/list-student"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <User size={18} style={{ marginRight: 8 }} />
          Students
        </Link>
        <Typography 
          color="text.primary"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <CreditCard size={18} style={{ marginRight: 8 }} />
          Transaction History
        </Typography>
      </Breadcrumbs>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Student Transaction History
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Viewing all transactions for student ID: {studentId}
        </Typography>
        
        {/* Transaction History Component */}
        <TransactionHistory studentId={studentId} />
      </Paper>
    </Box>
  );
};

export default StudentTransactionHistory;