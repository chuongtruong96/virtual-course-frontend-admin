// src/views/account/AccountList.jsx

import React, { useState, useEffect } from 'react';
import { fetchAccounts, deleteAccount, enableAccount, disableAccount } from '../../services/accountService';
import { Row, Col, Card, Table, Button, Spinner, Alert, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AddAccountModal from './AddAccountModal'; // Import component modal AddAccount
import '../../styles/table.css'; // Import your custom CSS

const AccountList = () => {
    const [accountData, setAccountData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [notification, setNotification] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [accountFilter, setAccountFilter] = useState('');
    const [visibleColumns, setVisibleColumns] = useState({
        username: true,
        email: true,
        type: true,
        status: true,
        version: true,
        role: true,
        actions: true,
    });

    const itemsPerPage = 10;
    const navigate = useNavigate();

    // State để điều khiển modal
    const [showAddAccountModal, setShowAddAccountModal] = useState(false);

    // Fetch accounts on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAccounts();
                setAccountData(data);
            } catch (error) {
                setNotification({
                    message: 'Failed to load accounts. Please try again later.',
                    type: 'danger',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle enable account
    const handleEnableAccount = async (id) => {
        try {
            await enableAccount(id);
            setAccountData((prevData) =>
                prevData.map((account) =>
                    account.id === id ? { ...account, status: 'ACTIVE' } : account
                )
            );
            setNotification({
                message: 'Account enabled successfully!',
                type: 'success',
            });
        } catch (error) {
            setNotification({
                message: 'Failed to enable account. Please try again.',
                type: 'danger',
            });
        }
    };

    // Handle disable account
    const handleDisableAccount = async (id) => {
        try {
            await disableAccount(id);
            setAccountData((prevData) =>
                prevData.map((account) =>
                    account.id === id ? { ...account, status: 'INACTIVE' } : account
                )
            );
            setNotification({
                message: 'Account disabled successfully!',
                type: 'success',
            });
        } catch (error) {
            setNotification({
                message: 'Failed to disable account. Please try again.',
                type: 'danger',
            });
        }
    };

    // Handle delete account
    const handleDeleteAccount = async (id) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            try {
                await deleteAccount(id);
                setAccountData((prevData) => prevData.filter((account) => account.id !== id));
                setNotification({
                    message: 'Account deleted successfully!',
                    type: 'success',
                });
            } catch (error) {
                setNotification({
                    message: 'Failed to delete account. Please try again.',
                    type: 'danger',
                });
            }
        }
    };

    // Filter accounts based on filters
    const filteredAccounts = accountData.filter((account) => {
        const matchesStatus = statusFilter ? account.status === statusFilter : true;
        const matchesName = accountFilter
            ? `${account.username} ${account.email}`.toLowerCase().includes(accountFilter.toLowerCase())
            : true;
        return matchesStatus && matchesName;
    });

    // Handle sorting functionality
    const handleSort = (column, order) => {
        const sortedAccounts = [...filteredAccounts].sort((a, b) => {
            if (column === 'username' || column === 'email') {
                return order === 'asc'
                    ? a[column].localeCompare(b[column])
                    : b[column].localeCompare(a[column]);
            }
            return 0;
        });
        setAccountData(sortedAccounts);
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const startIndex = (page - 1) * itemsPerPage;
    const currentPageAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

    // Handle column visibility toggle
    const handleColumnVisibility = (column) => {
        setVisibleColumns((prevState) => ({
            ...prevState,
            [column]: !prevState[column],
        }));
    };

    // Handle mở modal AddAccount
    const handleShowAddAccountModal = () => setShowAddAccountModal(true);
    const handleCloseAddAccountModal = () => setShowAddAccountModal(false);

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" />
                <p>Loading accounts...</p>
            </div>
        );
    }

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <Card.Title as="h5">Account List</Card.Title>
                        {/* Button Add Account */}
                        <Button variant="success" onClick={handleShowAddAccountModal}>
                            Add Account
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        {/* Display notifications */}
                        {notification && <Alert variant={notification.type}>{notification.message}</Alert>}

                        {/* Filters */}
                        <div className="filters mb-3 d-flex gap-3">
                            <select
                                className="form-select"
                                onChange={(e) => setStatusFilter(e.target.value)}
                                value={statusFilter}
                            >
                                <option value="">All Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Username/Email"
                                value={accountFilter}
                                onChange={(e) => setAccountFilter(e.target.value)}
                            />
                        </div>

                        {/* Sorting Controls */}
                        <div className="sorting-controls mb-3 d-flex gap-2">
                            <Button variant="outline-primary" onClick={() => handleSort('username', 'asc')}>
                                Sort Username A-Z
                            </Button>
                            <Button variant="outline-primary" onClick={() => handleSort('username', 'desc')}>
                                Sort Username Z-A
                            </Button>
                            <Button variant="outline-primary" onClick={() => handleSort('email', 'asc')}>
                                Sort Email A-Z
                            </Button>
                            <Button variant="outline-primary" onClick={() => handleSort('email', 'desc')}>
                                Sort Email Z-A
                            </Button>
                        </div>

                        {/* Table */}
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
                                    currentPageAccounts.map((account) => (
                                        <tr key={account.id}>
                                            {visibleColumns.username && <td>{account.username}</td>}
                                            {visibleColumns.email && <td>{account.email}</td>}
                                            {visibleColumns.type && <td>{account.type || "N/A"}</td>}
                                            {visibleColumns.status && (
                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            account.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'
                                                        }`}
                                                    >
                                                        {account.status}
                                                    </span>
                                                </td>
                                            )}
                                            {visibleColumns.version && <td>{account.version}</td>}
                                            {visibleColumns.role && <td>{account.roles}</td>}
                                            {visibleColumns.actions && (
                                                <td>
                                                    {account.status === 'ACTIVE' ? (
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => handleDisableAccount(account.id)}
                                                            size="sm"
                                                            className="me-2"
                                                        >
                                                            Disable
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="success"
                                                            onClick={() => handleEnableAccount(account.id)}
                                                            size="sm"
                                                            className="me-2"
                                                        >
                                                            Enable
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDeleteAccount(account.id)}
                                                        size="sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No accounts found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {/* Pagination Controls */}
                        <div className="pagination-controls d-flex justify-content-between align-items-center">
                            <Button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span>Page {page}</span>
                            <Button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page * itemsPerPage >= filteredAccounts.length}
                            >
                                Next
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            {/* Modal AddAccount */}
            <AddAccountModal show={showAddAccountModal} handleClose={handleCloseAddAccountModal} />
        </Row>
    );
  };
// Utility function to capitalize column names for display
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default AccountList;
