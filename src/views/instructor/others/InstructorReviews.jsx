// src/components/InstructorReviews.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReviewService from '../../../services/reviewService';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const InstructorReviews = () => {
  const { instructorId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Giả sử bạn có endpoint để lấy đánh giá của Instructor
        const reviewsData = await ReviewService.fetchReviewsByInstructorId(instructorId);
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message || 'Error fetching reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [instructorId]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (reviews.length === 0) {
    return <Alert variant="info">No reviews found.</Alert>;
  }

  return (
    <div>
      <h3>Reviews</h3>
      {reviews.map(review => (
        <Card key={review.id} className="mb-3">
          <Card.Body>
            <Card.Title>
              <FaStar color="gold" /> {review.rating} / 5
            </Card.Title>
            <Card.Text>{review.comment}</Card.Text>
            <Card.Footer>
              <small className="text-muted">By {review.reviewerName} on {new Date(review.createdAt).toLocaleDateString()}</small>
            </Card.Footer>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default InstructorReviews;
