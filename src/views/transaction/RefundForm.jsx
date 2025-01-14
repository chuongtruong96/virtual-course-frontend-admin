// src/views/transaction/RefundForm.jsx

import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { refundPayment } from '../../services/transactionService';
import { NotificationContext } from '../../contexts/NotificationContext';

const RefundForm = ({ show, handleClose, setTransactions }) => {
  const { addNotification } = useContext(NotificationContext);
  const [paymentId, setPaymentId] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleRefund = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!paymentId || !amount) {
      setError('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    try {
      const newTransaction = await refundPayment(paymentId, parseFloat(amount));
      addNotification('Refund successful!', 'success');
      setTransactions(prev => [newTransaction, ...prev]);
      handleClose();
      setPaymentId('');
      setAmount('');
    } catch (err) {
      console.error("Error processing refund:", err);
      addNotification('Failed to process refund. Please try again.', 'danger');
      setError('Failed to process refund. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (!submitting) {
      setError(null);
      handleClose();
      setPaymentId('');
      setAmount('');
    }
  };

  return (
    <Modal show={show} onHide={handleModalClose}>
      <Modal.Header closeButton={!submitting}>
        <Modal.Title>Refund Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleRefund}>
          <Form.Group controlId="formPaymentId" className="mb-3">
            <Form.Label>Payment ID</Form.Label>
            <Form.Control
              type="number"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              required
              placeholder="Enter payment ID"
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
          <Button variant="danger" type="submit" disabled={submitting} className="ms-2">
            {submitting ? <Spinner as="span" animation="border" size="sm" /> : 'Refund'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RefundForm;
