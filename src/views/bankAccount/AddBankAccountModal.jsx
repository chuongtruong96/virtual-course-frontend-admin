// src/views/bankAccount/AddBankAccountModal.jsx

import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import useBankAccounts from '../../hooks/useBankAccounts';

const AddBankAccountModal = ({ show, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
  });
  const [error, setError] = useState(null);

  const { addBankAccount } = useBankAccounts();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.bankName || !formData.accountNumber || !formData.accountHolderName) {
      setError('All fields are required.');
      return;
    }

    addBankAccount(
      { data: formData },
      {
        onSuccess: () => {
          onSuccess();
          setFormData({ bankName: '', accountNumber: '', accountHolderName: '' });
        },
        onError: (err) => setError(err.message || 'Failed to add bank account.'),
      }
    );
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Bank Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="bankName" className="mb-3">
            <Form.Label>Bank Name</Form.Label>
            <Form.Control
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="accountNumber" className="mb-3">
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="accountHolderName" className="mb-3">
            <Form.Label>Account Holder Name</Form.Label>
            <Form.Control
              type="text"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="ms-2">
              Add Account
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBankAccountModal;
