import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

/**
 * @prop {object} course => { titleCourse, description, categoryId, level, basePrice, duration, status }
 * @prop {Array}  categories => [{id, name},...]
 * @prop {Function} onSubmit(data)
 * @prop {Function} onCancel()
 */
const CourseForm = ({ course, categories, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: course,
  });

  const [submissionError, setSubmissionError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const internalSubmit = async (formData) => {
    setSubmitting(true);
    setSubmissionError(null);
    try {
      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId, 10) || null,
        basePrice: parseFloat(formData.basePrice) || 0,
        duration: parseInt(formData.duration, 10) || 1,
      };
      await onSubmit(payload);
      // If "add" flow => reset form
      if (!course?.id) {
        reset();
      }
    } catch (error) {
      console.error('Error submitting course form:', error);
      setSubmissionError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(internalSubmit)} aria-label="Course Form">
      {submissionError && <Alert variant="danger">{submissionError}</Alert>}

      <Form.Group controlId="titleCourse" className="mb-3">
        <Form.Label>Course Title <span style={{ color: 'red' }}>*</span></Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter course title"
          {...register('titleCourse', { required: true })}
          isInvalid={!!errors.titleCourse}
        />
        <Form.Control.Feedback type="invalid">
          Course title is required.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="description" className="mb-3">
        <Form.Label>Description <span style={{ color: 'red' }}>*</span></Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter course description"
          {...register('description', { required: true })}
          isInvalid={!!errors.description}
        />
        <Form.Control.Feedback type="invalid">
          Description is required.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="categoryId" className="mb-3">
        <Form.Label>Category <span style={{ color: 'red' }}>*</span></Form.Label>
        <Form.Control
          as="select"
          {...register('categoryId', { required: true })}
          isInvalid={!!errors.categoryId}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          Category is required.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="level" className="mb-3">
        <Form.Label>Level <span style={{ color: 'red' }}>*</span></Form.Label>
        <Form.Control
          as="select"
          {...register('level', { required: true })}
          isInvalid={!!errors.level}
        >
          <option value="BEGINNER">BEGINNER</option>
          <option value="INTERMEDIATE">INTERMEDIATE</option>
          <option value="ADVANCED">ADVANCED</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          Level is required.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="basePrice" className="mb-3">
        <Form.Label>Base Price ($) <span style={{ color: 'red' }}>*</span></Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter base price"
          {...register('basePrice', { required: true, min: 0 })}
          isInvalid={!!errors.basePrice}
        />
        <Form.Control.Feedback type="invalid">
          Valid base price is required.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="duration" className="mb-3">
        <Form.Label>Duration (hrs) <span style={{ color: 'red' }}>*</span></Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter duration in hours"
          {...register('duration', { required: true, min: 1 })}
          isInvalid={!!errors.duration}
        />
        <Form.Control.Feedback type="invalid">
          Valid duration is required.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="status" className="mb-3">
        <Form.Label>Status <span style={{ color: 'red' }}>*</span></Form.Label>
        <Form.Control
          as="select"
          {...register('status', { required: true })}
          isInvalid={!!errors.status}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          Status is required.
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-end mt-4">
        <Button
          variant="secondary"
          onClick={onCancel}
          className="me-2"
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={submitting}
        >
          {submitting ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </Form>
  );
};

CourseForm.propTypes = {
  course: PropTypes.object,        // {titleCourse, ...}
  categories: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CourseForm;
