// src/views/transaction/DepositForm.jsx

import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { depositToWallet } from '../../services/transactionService';
import { NotificationContext } from '../../contexts/NotificationContext';

const DepositForm = ({ show, handleClose, setTransactions }) => {
  const { addNotification } = useContext(NotificationContext);
  const [walletId, setWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!walletId || !amount) {
      setError('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    try {
      const newTransaction = await depositToWallet(walletId, parseFloat(amount));
      addNotification('Deposit successful!', 'success');
      setTransactions(prev => [newTransaction, ...prev]);
      handleClose();
      setWalletId('');
      setAmount('');
    } catch (err) {
      console.error("Error depositing to wallet:", err);
      addNotification('Failed to deposit. Please try again.', 'danger');
      setError('Failed to deposit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (!submitting) {
      setError(null);
      handleClose();
      setWalletId('');
      setAmount('');
    }
  };

  return (
    <Modal show={show} onHide={handleModalClose}>
      <Modal.Header closeButton={!submitting}>
        <Modal.Title>Deposit to Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleDeposit}>
          <Form.Group controlId="formWalletId" className="mb-3">
            <Form.Label>Wallet ID</Form.Label>
            <Form.Control
              type="number"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              required
              placeholder="Enter wallet ID"
            />
          </Form.Group>
          <Form.Group controlId="formAmount" className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="Enter amount"
            />
          </Form.Group>
          <Button variant="secondary" onClick={handleModalClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={submitting} className="ms-2">
            {submitting ? <Spinner as="span" animation="border" size="sm" /> : 'Deposit'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DepositForm;
