import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Table, Badge, Spinner, Alert, Pagination, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthContext';
import StudentTransactionService from '../../services/StudentTransactionService';
import AdminTransactionService from '../../services/AdminTransactionService';
import { formatCurrency, formatDate } from '../../utils/format';
import { FaSearch, FaCalendarAlt, FaFileDownload, FaEye, FaFilter, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MainCard from '../payment/MainCard';

const StudentTransactionList = () => {
    // Get auth context
    const { auth } = useContext(AuthContext);
    const currentUser = auth?.user;
    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');
    
    // State for transactions and loading
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    
    // Pagination state
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0
    });
    
    // Filter and sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: ''
    });
    const [sortConfig, setSortConfig] = useState({
        key: 'paymentDate',
        direction: 'desc'
    });
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

    // Fetch transactions when page changes or filters are applied
    useEffect(() => {
        fetchTransactions();
    }, [pagination.currentPage, selectedStudentId]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            
            let response;
            
            // If admin, can fetch for any student or all students
            if (isAdmin) {
                if (selectedStudentId) {
                    response = await AdminTransactionService.getStudentTransactionHistory(selectedStudentId);
                } else {
                    response = await AdminTransactionService.getAllTransactions(
                        pagination.currentPage,
                        10,
                        null,
                        statusFilter !== 'all' ? statusFilter : null
                    );
                }
            } else if (currentUser?.id) {
                // If student, fetch only their transactions
                response = await StudentTransactionService.getTransactionHistory(
                    currentUser.id,
                    pagination.currentPage
                );
            } else {
                setError('User ID not found. Please ensure you are logged in.');
                setLoading(false);
                return;
            }
            
            // Process the response based on its structure
            if (response && response.content) {
                // Paginated response
                setTransactions(response.content);
                setPagination({
                    currentPage: response.number || 0,
                    totalPages: response.totalPages || 0,
                    totalElements: response.totalElements || 0
                });
            } else if (Array.isArray(response)) {
                // Array response
                setTransactions(response);
                setPagination({
                    currentPage: 0,
                    totalPages: 1,
                    totalElements: response.length
                });
            }
            
            setError(null);
        } catch (err) {
            console.error('Error fetching transaction history:', err);
            setError('Failed to load transaction history. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setPagination(prev => ({
            ...prev,
            currentPage: pageNumber
        }));
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchTransactions();
    };

    // Handle date filter change
    const handleDateFilterChange = (e) => {
        const { name, value } = e.target;
        setDateFilter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Apply filters
    const applyFilters = () => {
        setPagination(prev => ({
            ...prev,
            currentPage: 0
        }));
        fetchTransactions();
    };

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setDateFilter({
            startDate: '',
            endDate: ''
        });
        setStatusFilter('all');
        setPaymentMethodFilter('all');
        setSelectedStudentId('');
        setPagination(prev => ({
            ...prev,
            currentPage: 0
        }));
        fetchTransactions();
    };

    // Handle sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        
        // Sort the transactions
        const sortedTransactions = [...transactions].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        
        setTransactions(sortedTransactions);
    };

    // Get sort icon
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <FaSort />;
        }
        return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    // Helper function to extract value from Java enum object or string
    const getEnumValue = (enumObj) => {
        if (!enumObj) return '';
        if (typeof enumObj === 'string') return enumObj;
        return enumObj.name || enumObj.toString();
    };

    // Helper function to render transaction status badge
    const renderStatusBadge = (status) => {
        if (!status) return <Badge bg="secondary">Unknown</Badge>;
        
        // Extract the status string if it's an object
        const statusStr = getEnumValue(status);
        
        let variant;
        switch (statusStr.toLowerCase()) {
            case 'completed':
            case 'success':
                variant = 'success';
                break;
            case 'pending':
                variant = 'warning';
                break;
            case 'failed':
                variant = 'danger';
                break;
            case 'refunded':
            case 'cancelled':
                variant = 'info';
                break;
            default:
                variant = 'secondary';
        }
        return <Badge bg={variant}>{statusStr}</Badge>;
    };

    // Render pagination controls
    const renderPagination = () => {
        if (pagination.totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        const startPage = Math.max(0, Math.min(
            pagination.currentPage - Math.floor(maxVisiblePages / 2),
            pagination.totalPages - maxVisiblePages
        ));
        const endPage = Math.min(startPage + maxVisiblePages - 1, pagination.totalPages - 1);

        // Previous button
        pages.push(
            <Pagination.Prev 
                key="prev" 
                disabled={pagination.currentPage === 0}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
            />
        );

        // First page
        if (startPage > 0) {
            pages.push(
                <Pagination.Item key={0} onClick={() => handlePageChange(0)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 1) {
                pages.push(<Pagination.Ellipsis key="ellipsis1" />);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Pagination.Item 
                    key={i} 
                    active={i === pagination.currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i + 1}
                </Pagination.Item>
            );
        }

        // Last page
        if (endPage < pagination.totalPages - 1) {
            if (endPage < pagination.totalPages - 2) {
                pages.push(<Pagination.Ellipsis key="ellipsis2" />);
            }
            pages.push(
                <Pagination.Item 
                    key={pagination.totalPages - 1} 
                    onClick={() => handlePageChange(pagination.totalPages - 1)}
                >
                    {pagination.totalPages}
                </Pagination.Item>
            );
        }

        // Next button
        pages.push(
            <Pagination.Next 
                key="next" 
                disabled={pagination.currentPage === pagination.totalPages - 1}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
            />
        );

        return <Pagination>{pages}</Pagination>;
    };

    // Format payment date properly
    const formatPaymentDate = (paymentDate) => {
        if (!paymentDate) return 'N/A';
        
        // Handle Java Timestamp object
        if (typeof paymentDate === 'object' && paymentDate.time) {
            return formatDate(new Date(paymentDate.time));
        }
        
        return formatDate(paymentDate);
    };

    // Calculate summary statistics
    const calculateSummary = () => {
        const totalAmount = transactions.reduce((sum, transaction) => sum + (parseFloat(transaction.amount) || 0), 0);
        const totalCourses = transactions.reduce((sum, transaction) => sum + (transaction.courses?.length || 0), 0);
        
        return {
            totalAmount,
            totalTransactions: transactions.length,
            totalCourses,
            averageAmount: transactions.length > 0 ? totalAmount / transactions.length : 0
        };
    };

    const summary = calculateSummary();

    if (loading) {
        return (
            <MainCard title={isAdmin ? "Student Transactions" : "Your Transaction History"}>
                <div className="d-flex justify-content-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            </MainCard>
        );
    }

    if (error) {
        return (
            <MainCard title={isAdmin ? "Student Transactions" : "Your Transaction History"}>
                <Alert variant="danger">{error}</Alert>
            </MainCard>
        );
    }

    return (
        <MainCard 
            title={isAdmin ? "Student Transactions" : "Your Transaction History"}
            secondary={
                <div className="d-flex gap-2">
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-export">
                            <FaFileDownload className="me-1" /> Export
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => console.log('Export to CSV')}>CSV</Dropdown.Item>
                            <Dropdown.Item onClick={() => console.log('Export to PDF')}>PDF</Dropdown.Item>
                            <Dropdown.Item onClick={() => console.log('Export to Excel')}>Excel</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            }
        >
            {/* Filters */}
            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        {isAdmin && (
                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Student ID (Optional)</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Student ID to filter"
                                            value={selectedStudentId}
                                            onChange={(e) => setSelectedStudentId(e.target.value)}
                                        />
                                        <Button variant="outline-secondary" onClick={() => setSelectedStudentId('')}>
                                            Clear
                                        </Button>
                                    </InputGroup>
                                    <Form.Text className="text-muted">
                                        Leave empty to view all transactions
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        )}
                        <Col md={6} lg={3} className="mb-3">
                            <Form.Group>
                                <Form.Label>Search</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text><FaSearch /></InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search transactions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3} className="mb-3">
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="FAILED">Failed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="REFUNDED">Refunded</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3} className="mb-3">
                            <Form.Group>
                                <Form.Label>Payment Method</Form.Label>
                                <Form.Select
                                    value={paymentMethodFilter}
                                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                                >
                                    <option value="all">All Methods</option>
                                    <option value="PAYPAL">PayPal</option>
                                    <option value="CREDIT_CARD">Credit Card</option>
                                    <option value="BANK_TRANSFER">Bank Transfer</option>
                                    <option value="VNPAY">VNPay</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3} className="mb-3">
                            <Form.Group>
                                <Form.Label>Start Date</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={dateFilter.startDate}
                                        onChange={handleDateFilterChange}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={6} lg={3} className="mb-3">
                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                                        <Form.Control
                                            type="date"
                                            name="endDate"
                                            value={dateFilter.endDate}
                                            onChange={handleDateFilterChange}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={12} className="d-flex justify-content-end mb-3">
                                <div className="d-flex gap-2">
                                    <Button variant="primary" onClick={applyFilters}>
                                        <FaFilter className="me-1" /> Apply Filters
                                    </Button>
                                    <Button variant="outline-secondary" onClick={resetFilters}>
                                        Reset
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
    
                {/* Summary Cards */}
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="text-center h-100 border-left-primary">
                            <Card.Body>
                                <h6 className="mb-3 text-muted">Total Spent</h6>
                                <h3 className="text-primary">{formatCurrency(summary.totalAmount)}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center h-100 border-left-success">
                            <Card.Body>
                                <h6 className="mb-3 text-muted">Total Transactions</h6>
                                <h3 className="text-success">{summary.totalTransactions}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center h-100 border-left-info">
                            <Card.Body>
                                <h6 className="mb-3 text-muted">Courses Purchased</h6>
                                <h3 className="text-info">{summary.totalCourses}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center h-100 border-left-warning">
                            <Card.Body>
                                <h6 className="mb-3 text-muted">Average Transaction</h6>
                                <h3 className="text-warning">{formatCurrency(summary.averageAmount)}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
    
                {/* Transactions Table */}
                <Card>
                    <Card.Body>
                        {transactions.length > 0 ? (
                            <div className="table-responsive">
                                <Table hover>
                                    <thead>
                                        <tr>
                                            <th onClick={() => requestSort('id')} className="cursor-pointer">
                                                ID {getSortIcon('id')}
                                            </th>
                                            <th onClick={() => requestSort('paymentDate')} className="cursor-pointer">
                                                Date {getSortIcon('paymentDate')}
                                            </th>
                                            <th onClick={() => requestSort('amount')} className="cursor-pointer">
                                                Amount {getSortIcon('amount')}
                                            </th>
                                            <th onClick={() => requestSort('paymentMethod')} className="cursor-pointer">
                                                Payment Method {getSortIcon('paymentMethod')}
                                            </th>
                                            <th onClick={() => requestSort('status')} className="cursor-pointer">
                                                Status {getSortIcon('status')}
                                            </th>
                                            <th>Courses</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction) => (
                                            <tr key={transaction.id}>
                                                <td>#{transaction.id}</td>
                                                <td>{formatPaymentDate(transaction.paymentDate)}</td>
                                                <td>{formatCurrency(transaction.amount)}</td>
                                                <td>{getEnumValue(transaction.paymentMethod)}</td>
                                                <td>{renderStatusBadge(transaction.status)}</td>
                                                <td>
                                                    {transaction.courses && transaction.courses.length > 0 ? (
                                                        <div>
                                                            {transaction.courses.map((course, index) => (
                                                                <div key={course.id || index} className="mb-1">
                                                                    <Link to={`/dashboard/course/detail/${course.id}`}>
                                                                        {course.titleCourse || course.title || 'Unnamed Course'}
                                                                    </Link>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">No courses</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Button 
                                                            variant="outline-primary" 
                                                            size="sm"
                                                            as={Link}
                                                            to={`/dashboard/finance/transactions/${transaction.id}`}
                                                            title="View Details"
                                                        >
                                                            <FaEye />
                                                        </Button>
                                                        <Button 
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            title="Download Receipt"
                                                            onClick={() => {
                                                                StudentTransactionService.downloadTransactionReceipt(transaction.id)
                                                                    .then(blob => {
                                                                        const url = window.URL.createObjectURL(blob);
                                                                        const a = document.createElement('a');
                                                                        a.href = url;
                                                                        a.download = `receipt-${transaction.id}.pdf`;
                                                                        document.body.appendChild(a);
                                                                        a.click();
                                                                        window.URL.revokeObjectURL(url);
                                                                    })
                                                                    .catch(err => {
                                                                        console.error('Error downloading receipt:', err);
                                                                        alert('Failed to download receipt. Please try again later.');
                                                                    });
                                                            }}
                                                        >
                                                            <FaFileDownload />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <p className="mb-0">No transactions found.</p>
                                <p className="text-muted">
                                    {isAdmin 
                                        ? "No transactions match your filter criteria." 
                                        : "Purchase a course to see your transaction history."}
                                </p>
                            </div>
                        )}
                        
                        {/* Pagination */}
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <div>
                                Showing {transactions.length} of {pagination.totalElements} transactions
                            </div>
                            <div>
                                {renderPagination()}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </MainCard>
        );
    };
    
    export default StudentTransactionList;