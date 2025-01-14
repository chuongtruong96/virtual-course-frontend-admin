// src/components/InstructorTransactions.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TransactionService from '../../../services/transactionService';
import { Table, Spinner, Alert } from 'react-bootstrap';

const InstructorTransactions = () => {
  const { instructorId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Giả sử bạn có endpoint để lấy lịch sử giao dịch của Wallet
        const transactionsData = await TransactionService.fetchTransactionsByInstructorId(instructorId);
        setTransactions(transactionsData);
      } catch (err) {
        setError(err.message || 'Error fetching transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [instructorId]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (transactions.length === 0) {
    return <Alert variant="info">No transactions found.</Alert>;
  }

  return (
    <div>
      <h3>Transaction History</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Processed At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.transactionType}</td>
              <td>${tx.amount}</td>
              <td>{tx.statusTransaction}</td>
              <td>{new Date(tx.processedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default InstructorTransactions;
