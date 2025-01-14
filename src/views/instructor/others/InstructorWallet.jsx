// src/components/InstructorWallet.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import WalletService from '../../../services/walletService';
import { Card, Spinner, Alert } from 'react-bootstrap';

const InstructorWallet = () => {
  const { instructorId } = useParams();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        // Giả sử bạn có endpoint để lấy Wallet của Instructor
        const walletData = await WalletService.fetchWalletByInstructorId(instructorId);
        setWallet(walletData);
      } catch (err) {
        setError(err.message || 'Error fetching wallet');
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [instructorId]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!wallet) {
    return <Alert variant="warning">Wallet not found.</Alert>;
  }

  return (
    <Card>
      <Card.Header>Wallet Details</Card.Header>
      <Card.Body>
        <p><strong>Balance:</strong> ${wallet.balance}</p>
        <p><strong>Status:</strong> {wallet.statusWallet}</p>
        <p><strong>Max Limit:</strong> ${wallet.maxLimit || 'N/A'}</p>
        <p><strong>Last Updated:</strong> {new Date(wallet.lastUpdated).toLocaleString()}</p>
        {/* Bạn có thể thêm các chức năng như nạp/rút tiền ở đây */}
      </Card.Body>
    </Card>
  );
};

export default InstructorWallet;
