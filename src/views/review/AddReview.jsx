// src/views/review/AddReview.jsx

import React, { useState, useContext } from 'react';
import ReviewService from '../../services/reviewService';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { NotificationContext } from '../../contexts/NotificationContext';
// import '../../../styles/AddReview.css'; // Import custom styles if any

const AddReview = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Assuming studentId is retrieved from user context or authentication
  const studentId = 2; // Replace with actual logic

  // Using react-hook-form
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const reviewData = {
        rating: parseInt(data.rating, 10),
        comment: data.comment,
        courseId: parseInt(courseId, 10),
        studentId: studentId
      };
      await ReviewService.createReview(reviewData);
      addNotification('Review created successfully!', 'success');
      reset();
      navigate(`/dashboard/course/${courseId}/reviews`);
    } catch (err) {
      console.error("Error creating review:", err);
      setError('Failed to create review. Please try again.');
      addNotification('Failed to create review. Please try again.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-review-form-container">
      <h3>Write a Review for Course {courseId}</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit(onSubmit)} aria-label="Add Review Form">
        <Form.Group controlId="formRating" className="mb-3">
          <Form.Label>Rating (1-5) <span style={{ color: 'red' }}>*</span></Form.Label>
          <Form.Control
            type="number"
            min="1"
            max="5"
            placeholder="Enter rating"
            {...register('rating', { required: true, min: 1, max: 5 })}
            isInvalid={errors.rating}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid rating between 1 and 5.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formComment" className="mb-3">
          <Form.Label>Comment <span style={{ color: 'red' }}>*</span></Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Enter your review"
            {...register('comment', { required: true })}
            isInvalid={errors.comment}
          />
          <Form.Control.Feedback type="invalid">
            Comment is required.
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Submit Review'}
        </Button>
      </Form>
    </div>
  );
};

export default AddReview;
