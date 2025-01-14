// src/views/wallet/ListWallet.jsx

import React, { useState, useEffect, useContext, useMemo } from 'react';
import { fetchWallets, deleteWallet } from '../../services/walletService';
import { Table, Spinner, Alert, Button, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../contexts/NotificationContext';
// import '../../../styles/ListWallet.css'; // Import custom styles if any
import WalletCardSkeleton from '../../components/WalletCardSkeleton';
import PaginationComponent from '../../components/Pagination';
import ThemeToggle from '../../components/ThemeToggle'; // Import ThemeToggle if implemented

const ListWallet = () => {
  const { addNotification } = useContext(NotificationContext);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const navigate = useNavigate();

  // Pagination States
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  // Calculate current page wallets using useMemo for performance optimization
  const currentPageWallets = useMemo(() => {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    return wallets.slice(start, end);
  }, [wallets, page]);

  useEffect(() => {
    const getWallets = async () => {
      try {
        const data = await fetchWallets();
        setWallets(data);
      } catch (err) {
        console.error("Error fetching wallets:", err);
        addNotification('Failed to load wallets.', 'danger');
        setError('Failed to load wallets.');
      } finally {
        setLoading(false);
      }
    };

    getWallets();
  }, [addNotification]);

  const handleDelete = (wallet) => {
    setSelectedWallet(wallet);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteWallet(selectedWallet.id);
      setWallets(wallets.filter(w => w.id !== selectedWallet.id));
      addNotification('Wallet deleted successfully.', 'success');
      setShowDeleteModal(false);
      setSelectedWallet(null);
    } catch (err) {
      console.error("Error deleting wallet:", err);
      addNotification('Failed to delete wallet.', 'danger');
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedWallet(null);
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  return (
    <>
      {loading ? (
        // Display loading skeletons while data is being fetched
        Array.from({ length: 5 }).map((_, index) => (
          <WalletCardSkeleton key={index} />
        ))
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Wallet List</h3>
            <div>
              <ThemeToggle />
              <Button
                variant="success"
                onClick={() => navigate('/dashboard/wallet/add')}
                aria-label="Add Wallet"
              >
                Add Wallet
              </Button>
            </div>
          </div>
          
          {currentPageWallets.length > 0 ? (
            <>
              <Table striped bordered hover responsive aria-label="Wallet List Table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Balance ($)</th>
                    <th>Status</th>
                    <th>Max Limit ($)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageWallets.map(wallet => (
                    <tr key={wallet.id}>
                      <td>{wallet.id}</td>
                      <td>{wallet.balance.toFixed(2)}</td>
                      <td>
                        <Badge
                          bg={wallet.statusWallet === 'ACTIVE' ? 'success' : 'danger'}
                          aria-label={`Wallet status: ${wallet.statusWallet}`}
                        >
                          {wallet.statusWallet}
                        </Badge>
                      </td>
                      <td>{wallet.maxLimit !== null ? wallet.maxLimit.toFixed(2) : 'N/A'}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => navigate(`/dashboard/wallet/detail/${wallet.id}`)}
                          aria-label={`View Details of Wallet ${wallet.id}`}
                        >
                          Detail
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(wallet)}
                          aria-label={`Delete Wallet ${wallet.id}`}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination Component */}
              <div className="d-flex justify-content-center">
                <PaginationComponent
                  pageCount={Math.ceil(wallets.length / itemsPerPage)}
                  onPageChange={handlePageChange}
                  currentPage={page}
                />
              </div>
            </>
          ) : (
            <Alert variant="info" aria-live="polite">No wallets found.</Alert>
          )}

          {/* Delete Confirmation Modal */}
          <Modal
            show={showDeleteModal}
            onHide={handleCloseDeleteModal}
            aria-labelledby="delete-wallet-modal"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="delete-wallet-modal">Delete Wallet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete Wallet ID <strong>{selectedWallet?.id}</strong>?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleCloseDeleteModal}
                aria-label="Cancel Delete Wallet"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                aria-label="Confirm Delete Wallet"
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default ListWallet;
