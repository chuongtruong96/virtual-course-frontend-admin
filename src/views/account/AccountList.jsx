import React, { useState, useContext, useMemo } from 'react';
import { Row, Col, Card, Table, Button, Spinner, Alert, Form, InputGroup, DropdownButton, Dropdown, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAccounts from '../../hooks/useAccounts';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSort, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import '../../styles/table.css';
import { NotificationContext } from '../../contexts/NotificationContext';
import AddAccountModal from './AddAccountModal';

const AccountList = () => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const {
    accounts,
    isLoading,
    isError,
    error,
    enableAccount,
    disableAccount,
    deleteAccount,
    enableAccountStatus,
    disableAccountStatus,
    deleteAccountStatus
  } = useAccounts();

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [visibleColumns, setVisibleColumns] = useState({
    username: true,
    email: true,
    type: true,
    status: true,
    version: true,
    role: true,
    actions: true
  });

  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });
  };

  const filteredSortedAccounts = useMemo(() => {
    let filtered = accounts || [];
    if (statusFilter) {
      filtered = filtered.filter((acct) => acct.status === statusFilter);
    }
    if (accountFilter) {
      const lower = accountFilter.toLowerCase();
      filtered = filtered.filter((acct) => acct.username?.toLowerCase().includes(lower) || acct.email?.toLowerCase().includes(lower));
    }
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [accounts, statusFilter, accountFilter, sortConfig]);

  const totalPages = Math.ceil(filteredSortedAccounts.length / itemsPerPage);
  const currentPageAccounts = filteredSortedAccounts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleEnableAccount = (id) => enableAccount(id);
  const handleDisableAccount = (id) => disableAccount(id);
  const handleDeleteAccount = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      deleteAccount(id);
    }
  };

  const handleColumnVisibility = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return <FaSort />;
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const handleShowAddAccountModal = () => setShowAddAccountModal(true);
  const handleCloseAddAccountModal = () => setShowAddAccountModal(false);

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" aria-label="Loading Accounts">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading accounts...</p>
      </div>
    );
  }

  if (isError) {
    return <Alert variant="danger">{error?.message || 'Failed to load accounts. Please try again later.'}</Alert>;
  }

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title as="h5">Account List</Card.Title>
            <Button variant="success" onClick={handleShowAddAccountModal}>
              <FaPlus /> Add Account
            </Button>
          </Card.Header>
          <Card.Body>
            <div className="filters mb-3 d-flex flex-wrap gap-3">
              <Form.Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </Form.Select>
              <InputGroup style={{ maxWidth: '300px' }}>
                <Form.Control
                  placeholder="Search by Username or Email"
                  value={accountFilter}
                  onChange={(e) => {
                    setAccountFilter(e.target.value);
                    setPage(1);
                  }}
                />
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup>
            </div>

            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  {visibleColumns.username && <th>Username</th>}
                  {visibleColumns.email && <th>Email</th>}
                  {visibleColumns.type && <th>Type</th>}
                  {visibleColumns.status && <th>Status</th>}
                  {visibleColumns.version && <th>Version</th>}
                  {visibleColumns.role && <th>Roles</th>}
                  {visibleColumns.actions && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentPageAccounts.length > 0 ? (
                  currentPageAccounts.map((acct) => (
                    <tr key={acct.id}>
                      {visibleColumns.username && <td>{acct.username}</td>}
                      {visibleColumns.email && <td>{acct.email}</td>}
                      {visibleColumns.type && <td>{acct.type || 'N/A'}</td>}
                      {visibleColumns.status && (
                        <td>
                          <Badge bg={acct.status === 'ACTIVE' ? 'success' : 'danger'}>{acct.status}</Badge>
                        </td>
                      )}
                      {visibleColumns.version && <td>{acct.version || 'N/A'}</td>}
                      {visibleColumns.role && <td>{acct.roles && Array.isArray(acct.roles) ? acct.roles.join(', ') : 'N/A'}</td>}
                      {visibleColumns.actions && (
                        <td>
                          <Button variant="info" size="sm" className="me-2" onClick={() => navigate(`/dashboard/account/edit/${acct.id}`)}>
                            <FaEdit /> Edit
                          </Button>
                          <Button
                            variant={acct?.status === 'ACTIVE' ? 'secondary' : 'success'}
                            size="sm"
                            onClick={() => (acct?.status === 'ACTIVE' ? handleDisableAccount(acct?.id) : handleEnableAccount(acct?.id))}
                            disabled={!acct?.id || !acct?.status}
                          >
                            {acct?.status === 'ACTIVE' ? (
                              <>
                                <FaToggleOff /> Disable
                              </>
                            ) : (
                              <>
                                <FaToggleOn /> Enable
                              </>
                            )}
                          </Button>

                          <Button variant="danger" size="sm" onClick={() => handleDeleteAccount(acct.id)}>
                            <FaTrash /> Delete
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={Object.values(visibleColumns).filter(Boolean).length} className="text-center">
                      No accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                Previous
              </Button>
              <span>
                Page {page} of {totalPages}
              </span>
              <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <AddAccountModal show={showAddAccountModal} handleClose={handleCloseAddAccountModal} />
    </Row>
  );
};

export default AccountList;
