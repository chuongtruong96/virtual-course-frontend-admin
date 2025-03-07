import React, { useState, useEffect, useContext } from 'react'; // Add useContext here
import { Card, Row, Col, Table, Badge, Spinner, Alert, Pagination, Form, InputGroup } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthContext'; // Use named import with curly braces
import StudentTransactionService from '../../services/StudentTransactionService';
import AdminTransactionService from '../../services/AdminTransactionService'; // Import admin service

import { formatCurrency, formatDate } from '../../utils/format';
import { FaSearch, FaCalendarAlt, FaFileDownload, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StudentTransaction = () => {
    // Use useContext to access the AuthContext
    const { auth } = useContext(AuthContext); // Destructure auth from the context
    const currentUser = auth?.user;
    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

     
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [transactions, setTransactions] = useState([]);
     const [pagination, setPagination] = useState({
         currentPage: 0,
         totalPages: 0,
         totalElements: 0
     });
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedStudentId, setSelectedStudentId] = useState(''); // For admin to select a student

  useEffect(() => {
    fetchTransactions();
}, [pagination.currentPage, selectedStudentId]);

const fetchTransactions = async () => {
    try {
        setLoading(true);
        
        let response;
        
        // If admin, fetch all transactions or transactions for a specific student if selected
        if (isAdmin) {
            if (selectedStudentId) {
                // Fetch transactions for a specific student
                response = await AdminTransactionService.getStudentTransactionHistory(
                    selectedStudentId,
                    pagination.currentPage
                );
            } else {
                // Fetch all transactions (admin view)
                response = await AdminTransactionService.getAllTransactions(
                    pagination.currentPage
                );
            }
        } else if (currentUser?.id) {
            // If not admin but has user ID, fetch only their transactions
            response = await StudentTransactionService.getTransactionHistory(
                currentUser.id,
                pagination.currentPage
            );
        } else {
            setError('User ID not found. Please ensure you are logged in.');
            setLoading(false);
            return;
        }
        
        if (response && response.content) {
            setTransactions(response.content);
            setPagination({
                currentPage: response.number || 0,
                totalPages: response.totalPages || 0,
                totalElements: response.totalElements || 0
            });
        } else if (Array.isArray(response)) {
            // Handle case where API returns array instead of paginated response
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

// Add a student selector for admin users
const renderStudentSelector = () => {
    if (!isAdmin) return null;
    
    return (
        <Form.Group className="mb-3">
            <Form.Label>Select Student (Optional)</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter Student ID"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
            />
            <Form.Text className="text-muted">
                Leave empty to view all transactions
            </Form.Text>
        </Form.Group>
    );
};

  const handlePageChange = (pageNumber) => {
    setPagination(prev => ({
      ...prev,
      currentPage: pageNumber
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    // This would typically call the API with search parameters
    console.log('Searching for:', searchTerm);
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyDateFilter = () => {
    // Implement date filter functionality
    // This would typically call the API with date range parameters
    console.log('Filtering by date range:', dateFilter);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDateFilter({
      startDate: '',
      endDate: ''
    });
    // Reset to first page and fetch transactions
    setPagination(prev => ({
      ...prev,
      currentPage: 0
    }));
  };

  // Helper function to render transaction status badge
  const renderStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;
    
    let variant;
    switch (status.toLowerCase()) {
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
        variant = 'info';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{status}</Badge>;
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="transaction-history">
      <h2 className="mb-4">Transaction History</h2>
      
      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6} lg={4} className="mb-3">
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <InputGroup.Text><FaSearch /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">Search</button>
                </InputGroup>
              </Form>
            </Col>
            <Col md={6} lg={8} className="mb-3">
                  <Row>
                    <Col md={6}>
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
                    <Col md={6}>
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
                  </Row>
                </Col>
                <Col md={12} lg={12} className="d-flex align-items-end justify-content-end">
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-primary" onClick={applyDateFilter}>
                      Apply Filters
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={resetFilters}>
                      Reset
                    </button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          {/* Transaction Summary */}
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center h-100 border-left-primary">
                <Card.Body>
                  <h6 className="mb-3 text-muted">Total Spent</h6>
                  <h3 className="text-primary">{formatCurrency(transactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0))}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center h-100 border-left-success">
                <Card.Body>
                  <h6 className="mb-3 text-muted">Total Transactions</h6>
                  <h3 className="text-success">{transactions.length}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center h-100 border-left-info">
                <Card.Body>
                  <h6 className="mb-3 text-muted">Courses Purchased</h6>
                  <h3 className="text-info">{transactions.reduce((sum, transaction) => sum + (transaction.courses?.length || 0), 0)}</h3>
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
                        <th>ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Courses</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>#{transaction.id}</td>
                          <td>{formatDate(transaction.paymentDate)}</td>
                          <td>{formatCurrency(transaction.amount)}</td>
                          <td>{transaction.paymentMethod}</td>
                          <td>{renderStatusBadge(transaction.status)}</td>
                          <td>
                            {transaction.courses && transaction.courses.length > 0 ? (
                              <div>
                                {transaction.courses.map((course, index) => (
                                  <div key={course.id || index} className="mb-1">
                                    <Link to={`/student/courses/${course.id}`}>
                                      {course.titleCourse || 'Unnamed Course'}
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
                              <Link 
                                to={`/student/transactions/${transaction.id}`} 
                                className="btn btn-sm btn-outline-primary"
                                title="View Details"
                              >
                                <FaEye />
                              </Link>
                              <button 
                                className="btn btn-sm btn-outline-secondary"
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
                              </button>
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
                  <p className="text-muted">Purchase a course to see your transaction history.</p>
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
        </div>
      );
};

export default StudentTransaction;