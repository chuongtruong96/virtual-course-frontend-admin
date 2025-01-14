// src/views/wallet/WalletDetail.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWalletById, updateWalletStatus, setMaxLimit } from '../../services/walletService';
import { Card, Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';
import { NotificationContext } from '../../contexts/NotificationContext';
// import '../../../styles/WalletDetail.css'; // Import custom styles if any

const WalletDetail = () => {
  const { walletId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const [showLimitModal, setShowLimitModal] = useState(false);
  const [maxLimit, setMaxLimitValue] = useState('');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getWalletDetails = async () => {
      try {
        const data = await fetchWalletById(walletId);
        setWallet(data);
      } catch (err) {
        console.error("Error fetching wallet details:", err);
        addNotification('Failed to load wallet details.', 'danger');
        setError('Failed to load wallet details.');
      } finally {
        setLoading(false);
      }
    };

    getWalletDetails();
  }, [walletId, addNotification]);

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      addNotification('Please select a status.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const updatedWallet = await updateWalletStatus(walletId, newStatus);
      setWallet(updatedWallet);
      addNotification('Wallet status updated successfully.', 'success');
      setShowStatusModal(false);
      setNewStatus('');
    } catch (err) {
      console.error("Error updating wallet status:", err);
      addNotification('Failed to update wallet status.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetMaxLimit = async () => {
    if (!maxLimit || parseFloat(maxLimit) < 0) {
      addNotification('Please enter a valid max limit.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const updatedWallet = await setMaxLimit(walletId, parseFloat(maxLimit));
      setWallet(updatedWallet);
      addNotification('Wallet max limit set successfully.', 'success');
      setShowLimitModal(false);
      setMaxLimitValue('');
    } catch (err) {
      console.error("Error setting wallet max limit:", err);
      addNotification('Failed to set max limit.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseStatusModal = () => {
    if (!submitting) {
      setShowStatusModal(false);
      setNewStatus('');
    }
  };

  const handleCloseLimitModal = () => {
    if (!submitting) {
      setShowLimitModal(false);
      setMaxLimitValue('');
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5" aria-live="polite">
        <Spinner animation="border" role="status" aria-label="Loading Wallet Details">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading wallet details...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" aria-live="assertive">{error}</Alert>;
  }

  if (!wallet) {
    return <Alert variant="warning" aria-live="polite">Wallet not found.</Alert>;
  }

  return (
    <>
      <h3>Wallet Detail</h3>
      <Card>
        <Card.Header>
          <Card.Title>Wallet ID: {wallet.id}</Card.Title>
        </Card.Header>
        <Card.Body>
          <p><strong>Balance:</strong> ${wallet.balance.toFixed(2)}</p>
          <p><strong>Status:</strong> <Badge bg={wallet.statusWallet === 'ACTIVE' ? 'success' : 'danger'}>{wallet.statusWallet}</Badge></p>
          <p><strong>Max Limit:</strong> {wallet.maxLimit !== null ? `$${wallet.maxLimit.toFixed(2)}` : 'N/A'}</p>
          {/* Add other wallet details here if necessary */}
        </Card.Body>
        <Card.Footer>
          <Button variant="warning" className="me-2" onClick={() => setShowStatusModal(true)} aria-label="Update Wallet Status">
            Update Status
          </Button>
          <Button variant="info" onClick={() => setShowLimitModal(true)} aria-label="Set Wallet Max Limit">
            Set Max Limit
          </Button>
        </Card.Footer>
      </Card>

      {/* Update Status Modal */}
      <Modal show={showStatusModal} onHide={handleCloseStatusModal} aria-labelledby="update-status-modal">
        <Modal.Header closeButton={!submitting}>
          <Modal.Title id="update-status-modal">Update Wallet Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewStatus" className="mb-3">
              <Form.Label>New Status <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                aria-required="true"
                aria-invalid={!newStatus && submitting}
              >
                <option value="">Select Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Form.Select>
              {!newStatus && submitting && (
                <Form.Control.Feedback type="invalid">
                  Status is required.
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStatusModal} disabled={submitting} aria-label="Cancel Update Status">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus} disabled={submitting} aria-label="Confirm Update Status">
            {submitting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Set Max Limit Modal */}
      <Modal show={showLimitModal} onHide={handleCloseLimitModal} aria-labelledby="set-max-limit-modal">
        <Modal.Header closeButton={!submitting}>
          <Modal.Title id="set-max-limit-modal">Set Wallet Max Limit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMaxLimit" className="mb-3">
              <Form.Label>Max Limit ($) <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={maxLimit}
                onChange={(e) => setMaxLimitValue(e.target.value)}
                placeholder="Enter max limit"
                aria-required="true"
                aria-invalid={!maxLimit && submitting}
              />
              {!maxLimit && submitting && (
                <Form.Control.Feedback type="invalid">
                  Max limit is required.
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLimitModal} disabled={submitting} aria-label="Cancel Set Max Limit">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSetMaxLimit} disabled={submitting} aria-label="Confirm Set Max Limit">
            {submitting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Set Max Limit'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WalletDetail;
