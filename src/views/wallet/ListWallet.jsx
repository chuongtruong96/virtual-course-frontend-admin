import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Table, Spinner, Alert, Button, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../contexts/NotificationContext';
import WalletService from '../../services/walletService';
import WalletCardSkeleton from '../../components/WalletCardSkeleton';
import PaginationComponent from '../../components/Pagination';
import ThemeToggle from '../../components/ThemeToggle';

const ListWallet = () => {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const {
    data: wallets = [],
    isLoading,
    isError
  } = useQuery(['wallets'], WalletService.fetchWallets, {
    onError: () => {
      addNotification('Failed to load wallets.', 'danger');
    }
  });

  // Delete wallet mutation
  const deleteWalletMutation = useMutation(WalletService.deleteWallet, {
    onSuccess: (_data, variables) => {
      // variables is the ID we passed into deleteWallet
      refetchWallets();
      addNotification(`Wallet ${variables} deleted successfully.`, 'success');
      setShowDeleteModal(false);
      setSelectedWallet(null);
    },
    onError: () => {
      addNotification('Failed to delete wallet.', 'danger');
    }
  });

  // For refetching after delete
  const { refetch: refetchWallets } = useQuery(['wallets'], WalletService.fetchWallets, {
    enabled: false // We only call this manually
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const currentPageWallets = useMemo(() => {
    const start = page * itemsPerPage;
    return wallets.slice(start, start + itemsPerPage);
  }, [wallets, page]);

  const handleDelete = (wallet) => {
    setSelectedWallet(wallet);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedWallet) {
      deleteWalletMutation.mutate(selectedWallet.id);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedWallet(null);
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <WalletCardSkeleton key={index} />
        ))}
      </>
    );
  }

  if (isError) {
    return <Alert variant="danger">Error loading wallets.</Alert>;
  }

  return (
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

          <div className="d-flex justify-content-center">
            <PaginationComponent
              pageCount={Math.ceil(wallets.length / itemsPerPage)}
              onPageChange={handlePageChange}
              currentPage={page}
            />
          </div>
        </>
      ) : (
        <Alert variant="info">No wallets found.</Alert>
      )}

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
  );
};

export default ListWallet;