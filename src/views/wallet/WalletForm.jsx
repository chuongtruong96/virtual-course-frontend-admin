// src/views/wallet/WalletForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { addWallet, editWallet, fetchWalletDetails } from '../../services/walletService';
import { NotificationContext } from '../../contexts/NotificationContext';
// import '../../../styles/WalletForm.css'; // Import custom styles if any

const WalletForm = () => {
  const { walletId } = useParams(); // If editing
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const isEdit = !!walletId;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      balance: 0,
      statusWallet: 'ACTIVE',
      maxLimit: '',
      // Add other fields if necessary
    },
  });

  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const getWalletDetails = async () => {
        setLoading(true);
        try {
          const data = await fetchWalletDetails(walletId);
          setValue('balance', data.balance);
          setValue('statusWallet', data.statusWallet);
          setValue('maxLimit', data.maxLimit || '');
          // Set other fields if necessary
        } catch (err) {
          console.error("Error fetching wallet details:", err);
          addNotification('Failed to load wallet details.', 'danger');
          setSubmissionError('Failed to load wallet details.');
        } finally {
          setLoading(false);
        }
      };

      getWalletDetails();
    }
  }, [isEdit, walletId, setValue, addNotification]);

  const onSubmit = async (data) => {
    setLoading(true);
    setSubmissionError(null);

    // Validation
    if (data.balance < 0) {
      setSubmissionError('Balance cannot be negative.');
      setLoading(false);
      return;
    }

    if (data.maxLimit && data.maxLimit < 0) {
      setSubmissionError('Max limit cannot be negative.');
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await editWallet(walletId, data);
        addNotification('Wallet updated successfully!', 'success');
      } else {
        await addWallet(data);
        addNotification('Wallet added successfully!', 'success');
      }
      navigate('/dashboard/wallet/list');
    } catch (err) {
      console.error("Error saving wallet:", err);
      setSubmissionError('Failed to save wallet.');
      addNotification('Failed to save wallet.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Navigate back
  };

  return (
    <div className="wallet-form-container">
      <h3>{isEdit ? 'Edit Wallet' : 'Add Wallet'}</h3>
      {submissionError && <Alert variant="danger" aria-live="assertive">{submissionError}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit Wallet Form' : 'Add Wallet Form'}>
        {/* Balance */}
        <Form.Group controlId="formBalance" className="mb-3">
          <Form.Label>Balance <span style={{ color: 'red' }}>*</span></Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            {...register('balance', { required: true, min: 0 })}
            isInvalid={!!errors.balance}
            placeholder="Enter balance"
            aria-required="true"
            aria-invalid={!!errors.balance}
          />
          <Form.Control.Feedback type="invalid">
            {errors.balance?.type === 'required' && 'Balance is required.'}
            {errors.balance?.type === 'min' && 'Balance cannot be negative.'}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Status */}
        <Form.Group controlId="formStatusWallet" className="mb-3">
          <Form.Label>Status <span style={{ color: 'red' }}>*</span></Form.Label>
          <Form.Select
            {...register('statusWallet', { required: true })}
            isInvalid={!!errors.statusWallet}
            aria-required="true"
            aria-invalid={!!errors.statusWallet}
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Status is required.
          </Form.Control.Feedback>
        </Form.Group>

        {/* Max Limit */}
        <Form.Group controlId="formMaxLimit" className="mb-3">
          <Form.Label>Max Limit</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            {...register('maxLimit', { min: 0 })}
            isInvalid={!!errors.maxLimit}
            placeholder="Enter max limit (optional)"
            aria-invalid={!!errors.maxLimit}
          />
          <Form.Control.Feedback type="invalid">
            Max limit cannot be negative.
          </Form.Control.Feedback>
        </Form.Group>

        {/* Additional Fields */}
        {/* Add other form fields here if necessary */}

        {/* Submit and Cancel Buttons */}
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleCancel} disabled={loading} aria-label="Cancel">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading} aria-label={isEdit ? 'Update Wallet' : 'Add Wallet'}>
            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : isEdit ? 'Update Wallet' : 'Add Wallet'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default WalletForm;
