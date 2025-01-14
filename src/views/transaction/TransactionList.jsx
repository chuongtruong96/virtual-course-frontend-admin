// src/views/transaction/TransactionList.jsx

import React, { useState, useEffect, useContext } from 'react';
import { fetchTransactions } from '../../services/transactionService';
import { Table, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import { NotificationContext } from '../../contexts/NotificationContext';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';
import RefundForm from './RefundForm';

const TransactionList = () => {
  const { addNotification } = useContext(NotificationContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        addNotification('Failed to load transactions.', 'danger');
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };

    getTransactions();
  }, [addNotification]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h3>Transaction Management</h3>
      <div className="mb-3">
        <Button variant="success" className="me-2" onClick={() => setShowDepositModal(true)}>
          Deposit
        </Button>
        <Button variant="warning" className="me-2" onClick={() => setShowWithdrawModal(true)}>
          Withdraw
        </Button>
        <Button variant="danger" onClick={() => setShowRefundModal(true)}>
          Refund
        </Button>
      </div>
      {transactions.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Processed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.transactionType}</td>
                <td>{tx.amount}</td>
                <td>{tx.statusTransaction}</td>
                <td>{new Date(tx.processedAt).toLocaleString()}</td>
                <td>
                  {/* Thêm các hành động nếu cần */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No transactions found.</Alert>
      )}

      {/* Deposit Modal */}
      <DepositForm show={showDepositModal} handleClose={() => setShowDepositModal(false)} setTransactions={setTransactions} />

      {/* Withdraw Modal */}
      <WithdrawForm show={showWithdrawModal} handleClose={() => setShowWithdrawModal(false)} setTransactions={setTransactions} />

      {/* Refund Modal */}
      <RefundForm show={showRefundModal} handleClose={() => setShowRefundModal(false)} setTransactions={setTransactions} />
    </>
  );
};

export default TransactionList;
