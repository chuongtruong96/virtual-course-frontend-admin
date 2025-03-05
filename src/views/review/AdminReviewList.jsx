import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, Row, Col, Spinner, Pagination } from 'react-bootstrap';
import { FaTrash, FaEdit, FaEye, FaFilter, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAdminReviews from '../../hooks/useAdminReviews';
import { NotificationContext } from '../../contexts/NotificationContext';
import { useContext } from 'react';

const AdminReviewList = () => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // State for filters
  const [filters, setFilters] = useState({
    courseId: '',
    rating: '',
    studentId: '',
  });
  
  // State for applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    courseId: '',
    rating: '',
    studentId: '',
  });
  
  // Use the custom hook
  const {
    reviews,
    totalPages,
    totalElements,
    isLoading,
    error,
    deleteReview,
    refetch
  } = useAdminReviews({
    courseId: appliedFilters.courseId || undefined,
    studentId: appliedFilters.studentId || undefined,
    rating: appliedFilters.rating || undefined,
    page: currentPage,
    size: pageSize,
  });
  // Fetch reviews when pagination or filters change
  useEffect(() => {
    refetch();
  }, [currentPage, pageSize, appliedFilters]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyFilters = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page when applying filters
    setAppliedFilters({...filters});
  };
  
  const resetFilters = () => {
    setFilters({
      courseId: '',
      rating: '',
      studentId: '',
    });
    setCurrentPage(0);
    setAppliedFilters({
      courseId: '',
      rating: '',
      studentId: '',
    });
  };
  
  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview({ reviewId });
      } catch (error) {
        console.error('Failed to delete review:', error);
        addNotification('Failed to delete review. Please try again.', 'danger');
      }
    }
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleViewDetails = (reviewId) => {
    navigate(`/dashboard/reviews/${reviewId}`);
  };
  
  // Render pagination controls
  const renderPagination = () => {
    const items = [];
    
    // Determine range of pages to show
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    // Ensure we always show 5 pages if available
    if (endPage - startPage < 4) {
      if (startPage === 0) {
        endPage = Math.min(4, totalPages - 1);
      } else if (endPage === totalPages - 1) {
        startPage = Math.max(0, totalPages - 5);
      }
    }
    
    // First page
    if (startPage > 0) {
      items.push(
        <Pagination.Item
          key="first"
          onClick={() => handlePageChange(0)}
        >
          1
        </Pagination.Item>
      );
      
      if (startPage > 1) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }
    
    // Page numbers
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number + 1}
        </Pagination.Item>
      );
    }
    
    // Last page
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
      
      items.push(
        <Pagination.Item
          key="last"
          onClick={() => handlePageChange(totalPages - 1)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    return (
      <Pagination>
        <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0} />
        <Pagination.Prev onClick={() => handlePageChange(Math.max(0, currentPage - 1))} disabled={currentPage === 0} />
        {items}
        <Pagination.Next onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage === totalPages - 1} />
        <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage === totalPages - 1} />
      </Pagination>
    );
  };
  
  // Render rating as stars
  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-warning" : "text-muted"}>★</span>
      );
    }
    return stars;
  };
  
  return (
    <div className="admin-review-list">
      <Card className="mb-4">
        <Card.Header as="h5">
          <div className="d-flex justify-content-between align-items-center">
            <span>Review Management</span>
            <div>
              <Button 
                variant="info" 
                className="me-2" 
                onClick={() => navigate('/dashboard/reviews/statistics')}
              >
                <FaChartBar className="me-1" /> View Statistics
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={applyFilters}>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Course ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="courseId"
                    value={filters.courseId}
                    onChange={handleFilterChange}
                    placeholder="Filter by Course ID"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    name="rating"
                    value={filters.rating}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Ratings</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Student ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="studentId"
                    value={filters.studentId}
                    onChange={handleFilterChange}
                    placeholder="Filter by Student ID"
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button type="submit" variant="primary" className="me-2">
                  <FaFilter className="me-1" /> Apply Filters
                </Button>
                <Button variant="secondary" onClick={resetFilters}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
          
          {isLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" aria-label="Loading Reviews">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error.message || 'Failed to load reviews'}</div>
          ) : (
            <>
              <div className="mb-3">
                <strong>Total Reviews: </strong> {totalElements || 0}
              </div>
              
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course</th>
                    <th>Student</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                      <tr key={review.id}>
                        <td>{review.id}</td>
                        <td>
                          {review.courseTitle ? (
                            <span title={review.courseTitle}>
                              {review.courseTitle.length > 20
                                ? `${review.courseTitle.substring(0, 20)}...`
                                : review.courseTitle}
                            </span>
                          ) : (
                            review.courseId
                          )}
                        </td>
                        <td>
                          {review.studentName ? review.studentName : review.studentId}
                        </td>
                        <td>{renderRatingStars(review.rating)}</td>
                        <td>
                          {review.comment ? (
                            <span title={review.comment}>
                              {review.comment.length > 50
                                ? `${review.comment.substring(0, 50)}...`
                                : review.comment}
                            </span>
                          ) : (
                            <span className="text-muted">No comment</span>
                          )}
                        </td>
                        <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            className="me-1"
                            onClick={() => handleViewDetails(review.id)}
                            title="View Details"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="me-1"
                            onClick={() => navigate(`/dashboard/reviews/${review.id}?edit=true`)}
                            title="Edit Review"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(review.id)}
                            title="Delete Review"
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No reviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <Form.Select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(0);
                    }}
                    style={{ width: '100px' }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </Form.Select>
                </div>
                {renderPagination()}
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminReviewList;