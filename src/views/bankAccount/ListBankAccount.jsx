// src/views/bankAccount/BankAccountList.jsx

import React, { useState, useContext, useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Badge,
  Pagination,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa';
import useBankAccounts from '../../hooks/useBankAccounts';
import { NotificationContext } from '../../contexts/NotificationContext';
import AddBankAccountModal from './AddBankAccountModal';

const ListBankAccount = () => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const {
    bankAccounts,
    isLoading,
    isError,
    error: queryError,
    deleteBankAccount,
    editBankAccount,
  } = useBankAccounts();

  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const itemsPerPage = 10;

  // Filtered and paginated bank accounts
  const filteredAccounts = useMemo(() => {
    if (!bankAccounts) return [];
    return bankAccounts.filter((acc) =>
      acc.bankName.toLowerCase().includes(filter.toLowerCase()) ||
      acc.accountHolderName.toLowerCase().includes(filter.toLowerCase()) ||
      acc.accountNumber.includes(filter)
    );
  }, [bankAccounts, filter]);

  const paginatedAccounts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredAccounts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAccounts, page]);

  // Handlers
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      deleteBankAccount({ id });
    }
  };

  const toggleStatus = (account) => {
    editBankAccount({
      id: account.id,
      data: { ...account, status: account.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' },
    });
  };

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

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
    const errorMessage =
      queryError?.response?.data?.message || queryError?.message || 'Failed to load bank accounts.';
    return <Alert variant="danger">{errorMessage}</Alert>;
  }

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <Card.Title>Bank Accounts</Card.Title>
            <Button onClick={() => setShowAddModal(true)}>Add Bank Account</Button>
          </Card.Header>
          <Card.Body>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search by bank name, account number, or account holder"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Bank Name</th>
                  <th>Account Number</th>
                  <th>Account Holder</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAccounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.bankName}</td>
                    <td>{account.accountNumber}</td>
                    <td>{account.accountHolderName}</td>
                    <td>
                      <Badge bg={account.status === 'ACTIVE' ? 'success' : 'secondary'}>
                        {account.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="info"
                        className="me-2"
                        onClick={() => navigate(`/dashboard/bank-account/edit/${account.id}`)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant={account.status === 'ACTIVE' ? 'warning' : 'success'}
                        className="me-2"
                        onClick={() => toggleStatus(account)}
                      >
                        {account.status === 'ACTIVE' ? <FaToggleOff /> : <FaToggleOn />}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(account.id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination>
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={page === index + 1}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Card.Body>
        </Card>
      </Col>
      <AddBankAccountModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => setShowAddModal(false)}
      />
    </Row>
  );
};

export default ListBankAccount;
