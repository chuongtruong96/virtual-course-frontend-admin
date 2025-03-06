import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaSave, FaTrash, FaUserCircle, FaBook } from 'react-icons/fa';
import ReviewService from '../../services/ReviewService';
import { NotificationContext } from '../../contexts/NotificationContext';
import { useContext } from 'react';

const ReviewDetail = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  const { addNotification } = useContext(NotificationContext);
  
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(isEditMode);
  
  // Form states
  const [editedReview, setEditedReview] = useState({
    rating: 0,
    comment: '',
  });
  
  // Fetch review details
  const fetchReviewDetails = async () => {
    setLoading(true);
    try {
      const data = await ReviewService.fetchReviewById(reviewId);
      setReview(data);
      setEditedReview({
        rating: data.rating,
        comment: data.comment || '',
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching review details:', err);
      setError('Failed to load review details. Please try again.');
      setLoading(false);
      addNotification('Failed to load review details. Please try again.', 'danger');
    }
  };
  
  useEffect(() => {
    fetchReviewDetails();
  }, [reviewId]);
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value, 10) : value
    }));
  };
  
  const handleSaveEdit = async () => {
    try {
      await ReviewService.moderateReview(reviewId, editedReview);
      addNotification('Review updated successfully!', 'success');
      setIsEditing(false);
      fetchReviewDetails(); // Refresh data
    } catch (error) {
      console.error('Failed to update review:', error);
      addNotification('Failed to update review. Please try again.', 'danger');
    }
  };
  
  const handleDeleteReview = async () => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        await ReviewService.deleteReview({ reviewId });
        addNotification('Review deleted successfully!', 'success');
        navigate('/dashboard/reviews'); // Navigate back to review list
      } catch (error) {
        console.error('Failed to delete review:', error);
        addNotification('Failed to delete review. Please try again.', 'danger');
      }
    }
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
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="review-detail">
      <Card className="mb-4">
        <Card.Header as="h5">
          <div className="d-flex justify-content-between align-items-center">
            <span>Review Details</span>
            <Button variant="primary" onClick={() => navigate('/dashboard/reviews')}>
              <FaArrowLeft className="me-2" /> Back to Reviews
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" aria-label="Loading Review">
              <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Loading review details...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : review ? (
            <>
              {/* Review Information */}
              <Row className="mb-4">
                <Col md={6}>
                  <h5 className="mb-3">Review Information</h5>
                  <div className="mb-2">
                    <strong>ID:</strong> {review.id}
                  </div>
                  <div className="mb-2">
                    <strong>Date:</strong> {formatDate(review.createdAt)}
                  </div>
                  {review.updatedAt && (
                    <div className="mb-2">
                      <strong>Last Updated:</strong> {formatDate(review.updatedAt)}
                    </div>
                  )}
                  <div className="mb-2">
                    <strong>Rating:</strong> {renderRatingStars(review.rating)}
                  </div>
                </Col>
                <Col md={6}>
                  <h5 className="mb-3">Related Information</h5>
                  <div className="mb-2">
                    <FaUserCircle className="me-2" />
                    <strong>Student:</strong> {review.studentName || review.studentId} 
                    {/* <Button 
                      variant="link" 
                      size="sm" 
                      onClick={() => navigate(`/dashboard/student/detail/${review.studentId}`)}
                    >
                      View Student
                    </Button> */}
                  </div>
                  <div className="mb-2">
                    <FaBook className="me-2" />
                    <strong>Course:</strong> {review.courseTitle || review.courseId}
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={() => navigate(`/dashboard/course/detail/${review.courseId}`)}
                    >
                      View Course
                    </Button>
                  </div>
                  {review.instructorId && (
                    <div className="mb-2">
                      <FaUserCircle className="me-2" />
                      <strong>Instructor:</strong> {review.instructorName || review.instructorId}
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={() => navigate(`/dashboard/instructor/detail/${review.instructorId}`)}
                      >
                        View Instructor
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
              
              <hr />
              
              {/* Review Content */}
              <div className="mb-4">
                <h5>Review Content</h5>
                {isEditing ? (
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Rating</Form.Label>
                      <Form.Select
                        name="rating"
                        value={editedReview.rating}
                        onChange={handleEditChange}
                      >
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="comment"
                        value={editedReview.comment}
                        onChange={handleEditChange}
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="secondary" 
                        className="me-2" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleSaveEdit}>
                        <FaSave className="me-2" /> Save Changes
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <div className="p-3 bg-light rounded">
                    <div className="mb-2">
                      <strong>Rating: </strong>
                      {renderRatingStars(review.rating)}
                    </div>
                    <div>
                      <strong>Comment: </strong>
                      {review.comment ? (
                        <p className="mt-2">{review.comment}</p>
                      ) : (
                        <p className="text-muted mt-2">No comment provided.</p>
                      )}
                    </div>
                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="primary" 
                        className="me-2" 
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Review
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={handleDeleteReview}
                      >
                        <FaTrash className="me-2" /> Delete Review
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Alert variant="warning">Review not found.</Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReviewDetail;