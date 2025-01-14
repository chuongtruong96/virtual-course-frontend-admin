// src/views/bankAccount/BankAccountDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import useBankAccounts from '../../hooks/useBankAccounts';

const BankAccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bankAccounts, isLoading, isError, error } = useBankAccounts();

  const [bankAccount, setBankAccount] = useState(null);

  useEffect(() => {
    const account = bankAccounts?.find((acc) => acc.id === parseInt(id, 10));
    if (account) {
      setBankAccount(account);
    }
  }, [bankAccounts, id]);

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

  if (!bankAccount) {
    return <Alert variant="warning">Bank account not found.</Alert>;
  }

  return (
    <Card>
      <Card.Header>Bank Account Details</Card.Header>
      <Card.Body>
        <p>
          <strong>Bank Name:</strong> {bankAccount.bankName}
        </p>
        <p>
          <strong>Account Number:</strong> {bankAccount.accountNumber}
        </p>
        <p>
          <strong>Account Holder Name:</strong> {bankAccount.accountHolderName}
        </p>
        <p>
          <strong>Status:</strong>{' '}
          <Badge bg={bankAccount.status === 'ACTIVE' ? 'success' : 'secondary'}>
            {bankAccount.status}
          </Badge>
        </p>
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate('/dashboard/bank-account/list')}>
            Back to List
          </Button>
          <Button
            variant="info"
            onClick={() => navigate(`/dashboard/bank-account/edit/${bankAccount.id}`)}
          >
            Edit
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BankAccountDetail;
