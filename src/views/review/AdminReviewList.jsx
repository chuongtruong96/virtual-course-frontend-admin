import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Card, Form, Row, Col, Spinner, Pagination, Badge, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { FaTrash, FaEdit, FaEye, FaFilter, FaChartBar, FaUser, FaChalkboardTeacher, FaBook, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAdminReviews from '../../hooks/useAdminReviews';
import { NotificationContext } from '../../contexts/NotificationContext';

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
    instructorId: '',
  });
  
  // State for applied filters
  const [appliedFilters, setAppliedFilters] = useState({
    courseId: '',
    rating: '',
    studentId: '',
    instructorId: '',
  });

  // State for modals
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  
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
    instructorId: appliedFilters.instructorId || undefined,
    rating: appliedFilters.rating || undefined,
    page: currentPage,
    size: pageSize,
  });

  // Fetch reviews when pagination or filters change
  useEffect(() => {
    refetch();
  }, [currentPage, pageSize, appliedFilters, refetch]);
  
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
      instructorId: '',
    });
    setCurrentPage(0);
    setAppliedFilters({
      courseId: '',
      rating: '',
      studentId: '',
      instructorId: '',
    });
  };
  
  const handleDelete = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteReview({ reviewId: reviewToDelete });
      addNotification('Review deleted successfully.', 'success');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete review:', error);
      addNotification('Failed to delete review. Please try again.', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleViewDetails = async (reviewId) => {
    // Find the review in the current list
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      setSelectedReview(review);
      setShowDetailsModal(true);
    } else {
      // If not found in current list, you might want to fetch it
      try {
        // This would require an additional API endpoint to fetch a single review
        // const reviewDetails = await fetchReviewDetails(reviewId);
        // setSelectedReview(reviewDetails);
        // setShowDetailsModal(true);
        navigate(`/dashboard/reviews/${reviewId}`);
      } catch (error) {
        addNotification('Failed to load review details.', 'danger');
      }
    }
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim() || !selectedReview) return;
    
    setIsSubmitting(true);
    try {
      // This would require an API endpoint to submit a response
      // await submitReviewResponse(selectedReview.id, responseText);
      addNotification('Response submitted successfully.', 'success');
      setShowResponseModal(false);
      setResponseText('');
      refetch(); // Refresh the list
    } catch (error) {
      console.error('Failed to submit response:', error);
      addNotification('Failed to submit response. Please try again.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'danger';
      case 'Responded':
        return 'info';
      default:
        return 'secondary';
    }
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
    
    return items;
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

  // Get course title with fallback
  const getCourseTitle = (review) => {
    return review.courseTitle || `Course #${review.courseId}`;
  };

  // Get student name with ID
  const getStudentInfo = (review) => {
    const studentName = review.studentName || 'Anonymous Student';
    return (
      <div className="d-flex align-items-center">
        <FaUser className="me-1 text-primary" />
        <span>{studentName}</span>
        {review.studentId && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Student ID: {review.studentId}</Tooltip>}
          >
            <Badge bg="info" className="ms-2">ID: {review.studentId}</Badge>
          </OverlayTrigger>
        )}
      </div>
    );
  };

  // Get instructor name with ID
  const getInstructorInfo = (review) => {
    const instructorName = review.instructorName || 'Unknown Instructor';
    return (
      <div className="d-flex align-items-center">
        <FaChalkboardTeacher className="me-1 text-success" />
        <span>{instructorName}</span>
        {review.instructorId && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Instructor ID: {review.instructorId}</Tooltip>}
          >
            <Badge bg="success" className="ms-2">ID: {review.instructorId}</Badge>
          </OverlayTrigger>
        )}
      </div>
    );
  };
  
  return (
    <div className="admin-review-list">
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaStar className="me-2" /> Review Management
            </h5>
            <div>
              <Button 
                variant="light" 
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
                  <Form.Label><FaBook className="me-1" /> Course ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="courseId"
                    value={filters.courseId}
                    onChange={handleFilterChange}
                    placeholder="Filter by Course ID"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label><FaStar className="me-1" /> Rating</Form.Label>
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
              <Col md={2}>
                <Form.Group>
                  <Form.Label><FaUser className="me-1" /> Student ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="studentId"
                    value={filters.studentId}
                    onChange={handleFilterChange}
                    placeholder="Filter by Student ID"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label><FaChalkboardTeacher className="me-1" /> Instructor ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="instructorId"
                    value={filters.instructorId}
                    onChange={handleFilterChange}
                    placeholder="Filter by Instructor ID"
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
              <Spinner animation="border" role="status" variant="primary" aria-label="Loading Reviews">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error.message || 'Failed to load reviews'}</div>
          ) : (
            <>
              <div className="mb-3 p-2 bg-light rounded">
                <strong>Total Reviews: </strong> 
                <Badge bg="primary" className="ms-1">{totalElements || 0}</Badge>
              </div>
              
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="bg-light">
                    <tr>
                      <th>ID</th>
                      <th>Course</th>
                      <th>Student</th>
                      <th>Instructor</th>
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
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Course ID: {review.courseId}</Tooltip>}
                            >
                              <div>
                                <FaBook className="me-1 text-secondary" />
                                <span title={getCourseTitle(review)}>
                                  {getCourseTitle(review).length > 20
                                    ? `${getCourseTitle(review).substring(0, 20)}...`
                                    : getCourseTitle(review)}
                                </span>
                              </div>
                            </OverlayTrigger>
                          </td>
                          <td>{getStudentInfo(review)}</td>
                          <td>{getInstructorInfo(review)}</td>
                          <td>{renderRatingStars(review.rating)}</td>
                          <td>
  {review.comment ? (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>{review.comment}</Tooltip>}
    >
      <span>
        {review.comment.length > 40
          ? `${review.comment.substring(0, 40)}...`
          : review.comment}
      </span>
    </OverlayTrigger>
  ) : (
    <span className="text-muted">No comment</span>
  )}
</td>
                            <td>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>{new Date(review.createdAt).toLocaleString()}</Tooltip>}
                              >
                                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                              </OverlayTrigger>
                            </td>
                            <td>
                              <div className="d-flex">
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
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-4">
                            <div className="text-muted">
                              <FaStar className="me-2" size={20} />
                              No reviews found matching your criteria
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <span className="me-2">Show</span>
                    <Form.Select 
                      size="sm" 
                      style={{ width: 'auto', display: 'inline-block' }}
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(0); // Reset to first page when changing page size
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </Form.Select>
                    <span className="ms-2">entries</span>
                  </div>
                  
                  {totalPages > 0 && (
                    <Pagination>
                      <Pagination.First 
                        onClick={() => handlePageChange(0)} 
                        disabled={currentPage === 0}
                      />
                      <Pagination.Prev 
                        onClick={() => handlePageChange(Math.max(0, currentPage - 1))} 
                        disabled={currentPage === 0}
                      />
                      
                      {renderPagination()}
                      
                      <Pagination.Next 
                        onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))} 
                        disabled={currentPage === totalPages - 1}
                      />
                      <Pagination.Last 
                        onClick={() => handlePageChange(totalPages - 1)} 
                        disabled={currentPage === totalPages - 1}
                      />
                    </Pagination>
                  )}
                </div>
              </>
            )}
          </Card.Body>
        </Card>

        {/* View Details Modal */}
        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Review Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReview ? (
              <div>
                <div className="mb-3 d-flex align-items-center">
                  <div className="me-3">
                    <img 
                      src={selectedReview.userAvatar || '/assets/images/default-avatar.png'} 
                      alt={selectedReview.studentName || 'User'} 
                      className="rounded-circle"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <h5 className="mb-0">{selectedReview.studentName || 'Anonymous User'}</h5>
                    <div className="text-muted small">
                      <span>Posted on: {new Date(selectedReview.createdAt).toLocaleDateString()}</span>
                      {selectedReview.updatedAt && selectedReview.updatedAt !== selectedReview.createdAt && (
                        <span> • Updated on: {new Date(selectedReview.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < selectedReview.rating ? "text-warning" : "text-muted"}
                        />
                      ))}
                      <span className="ms-2 fw-bold">{selectedReview.rating}/5</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold">Course</h6>
                  <div className="d-flex align-items-center">
                    <img 
                      src={selectedReview.courseThumbnail || '/assets/images/default-course.png'} 
                      alt={getCourseTitle(selectedReview)} 
                      className="rounded me-2"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <div>
                      <div>{getCourseTitle(selectedReview)}</div>
                      <div className="text-muted small">Instructor: {selectedReview.instructorName || 'Unknown Instructor'}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold">Review Title</h6>
                  <p>{selectedReview.title || 'No title'}</p>
                </div>

                <div className="mb-3">
                  <h6 className="fw-bold">Review Content</h6>
                  <p>{selectedReview.comment || 'No content'}</p>
                </div>

                {(selectedReview.pros || selectedReview.cons) && (
                  <div className="row mb-3">
                    {selectedReview.pros && (
                      <div className="col-md-6">
                        <h6 className="fw-bold">Pros</h6>
                        <ul className="text-success">
                          {selectedReview.pros.split('\n').map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedReview.cons && (
                      <div className="col-md-6">
                        <h6 className="fw-bold">Cons</h6>
                        <ul className="text-danger">
                          {selectedReview.cons.split('\n').map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {selectedReview.status && (
                  <div className="mb-3">
                    <h6 className="fw-bold">Status</h6>
                    <Badge bg={getStatusBadgeColor(selectedReview.status)}>
                      {selectedReview.status}
                    </Badge>
                  </div>
                )}

                {selectedReview.adminResponse && (
                  <div className="mb-3 p-3 bg-light rounded">
                    <h6 className="fw-bold">Admin Response</h6>
                    <p>{selectedReview.adminResponse}</p>
                    <div className="text-muted small">
                      Responded on: {selectedReview.responseDate ? new Date(selectedReview.responseDate).toLocaleDateString() : 'Unknown date'}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Spinner animation="border" />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                setShowDetailsModal(false);
                navigate(`/dashboard/reviews/${selectedReview.id}?edit=true`);
              }}
            >
              Edit Review
            </Button>
            {selectedReview && (!selectedReview.status || selectedReview.status !== 'Responded') && (
              <Button 
                variant="success" 
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowResponseModal(true);
                }}
              >
                Respond to Review
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* Response Modal */}
        <Modal show={showResponseModal} onHide={() => setShowResponseModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Respond to Review</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReview ? (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Review from {selectedReview.studentName || 'Anonymous User'}</Form.Label>
                  <div className="p-3 bg-light rounded mb-3">
                    <div className="mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < selectedReview.rating ? "text-warning" : "text-muted"}
                        />
                      ))}
                      <span className="ms-2 fw-bold">{selectedReview.rating}/5</span>
                    </div>
                    <p className="fw-bold mb-1">{selectedReview.title || 'No title'}</p>
                    <p className="mb-0">{selectedReview.comment || 'No content'}</p>
                  </div>
                  <Form.Label>Your Response</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response here..."
                  />
                </Form.Group>
              </Form>
            ) : (
              <div className="text-center py-4">
                <Spinner animation="border" />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowResponseModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="success" 
              onClick={handleSubmitResponse}
              disabled={!responseText.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Submitting...
                </>
              ) : (
                'Submit Response'
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this review? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
  
  export default AdminReviewList;