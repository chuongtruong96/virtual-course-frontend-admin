// src/views/review/ListReview.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ReviewService from '../../services/reviewService';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { NotificationContext } from '../../contexts/NotificationContext';
// import '../../../styles/ListReview.css'; // Import custom styles if any

const ListReview = () => {
  const { courseId } = useParams(); 
  const { addNotification } = useContext(NotificationContext);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await ReviewService.fetchReviewsByCourse(courseId);
        setReviews(data);
      } catch (error) {
        console.error('Failed to load reviews:', error);
        addNotification('Failed to load reviews. Please try again.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [courseId, addNotification]);

  // Handle Delete Review
  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await ReviewService.deleteReview(reviewId);
        setReviews(reviews.filter(review => review.id !== reviewId));
        addNotification('Review deleted successfully!', 'success');
      } catch (error) {
        console.error('Failed to delete review:', error);
        addNotification('Failed to delete review. Please try again.', 'danger');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" aria-label="Loading Reviews">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="list-review-container">
      <h2>Reviews for Course {courseId}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive aria-label="Review List Table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Student</th>
            <th>Instructor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? reviews.map((review) => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.rating}</td>
              <td>{review.comment}</td>
              <td>{review.studentName}</td>
              <td>{review.instructorName}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(review.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="text-center">
                No reviews found for this course.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ListReview;
