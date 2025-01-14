// src/views/wallet/TransactionHistory.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import TransactionService from '../../services/transactionService';
import { Table, Spinner, Alert, Typography, Box, Badge } from '@mui/material';
import { NotificationContext } from '../../contexts/NotificationContext';
// import '../../../styles/TransactionHistory.css'; // Custom styles if any

const TransactionHistory = () => {
  const { walletId } = useParams();
  const { addNotification } = useContext(NotificationContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await TransactionService.fetchTransactionHistory(walletId);
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setError('Failed to load transactions.');
        addNotification('Failed to load transactions. Please try again.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [walletId, addNotification]);

  if (loading) {
    return (
      <Box textAlign="center" mt={4} aria-live="polite">
        <Spinner aria-label="Loading Transactions" />
        <Typography mt={2}>Loading transactions...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="danger" aria-live="assertive">{error}</Alert>;
  }

  return (
    <div className="transaction-history-container">
      <Typography variant="h5" mb={2} aria-live="polite">Transaction History for Wallet {walletId}</Typography>
      {transactions.length > 0 ? (
        <Table striped bordered hover responsive aria-label="Transaction History Table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount ($)</th>
              <th>Type</th>
              <th>Status</th>
              <th>Processed At</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.amount.toFixed(2)}</td>
                <td>{transaction.type}</td>
                <td>
                  <Badge
                    badgeContent={transaction.status}
                    color={
                      transaction.status === 'COMPLETED' ? 'success' :
                      transaction.status === 'PENDING' ? 'warning' : 'default'
                    }
                    aria-label={`Transaction status: ${transaction.status}`}
                  />
                </td>
                <td>{new Date(transaction.processedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert severity="info" aria-live="polite">No transactions found for this wallet.</Alert>
      )}
    </div>
  );
};

export default TransactionHistory;
