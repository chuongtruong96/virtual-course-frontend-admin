// src/views/bankAccount/EditBankAccount.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import useBankAccounts from '../../hooks/useBankAccounts';

const EditBankAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editBankAccount, bankAccounts, isLoading, isError, error } = useBankAccounts();

  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    status: '',
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const account = bankAccounts?.find((acc) => acc.id === parseInt(id, 10));
    if (account) {
      setFormData({
        bankName: account.bankName || '',
        accountNumber: account.accountNumber || '',
        accountHolderName: account.accountHolderName || '',
        status: account.status || 'ACTIVE',
      });
    }
  }, [bankAccounts, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.bankName || !formData.accountNumber || !formData.accountHolderName) {
      setFormError('All fields are required.');
      return;
    }

    editBankAccount(
      { id, data: formData },
      {
        onSuccess: () => navigate('/dashboard/bank-account/list'),
        onError: (err) => setFormError(err?.message || 'Failed to update bank account.'),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (isError) {
    return <Alert variant="danger">{error || 'Failed to load bank accounts.'}</Alert>;
  }

  return (
    <Card>
      <Card.Header>Edit Bank Account</Card.Header>
      <Card.Body>
        {formError && <Alert variant="danger">{formError}</Alert>}
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
          <Form.Group controlId="status" className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate('/dashboard/bank-account/list')}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditBankAccount;
