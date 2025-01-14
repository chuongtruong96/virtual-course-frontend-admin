// src/views/course/CourseDetail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { NotificationContext } from '../../contexts/NotificationContext';
import CourseService from '../../services/courseService';

const CourseDetail = ({ forcedCourseId }) => {
  // Lấy ID từ param
  const routeParams = useParams();
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  // Nếu forcedCourseId tồn tại => ưu tiên
  const finalCourseId = forcedCourseId || routeParams.id;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCourseDetails = async () => {
      try {
        // Giả sử CourseService chỉ có fetchCourseById
        const data = await CourseService.fetchCourseById({ id: finalCourseId, signal: null });
        setCourse(data);
      } catch (err) {
        console.error('Error fetching course details:', err);
        addNotification('Failed to load course details.', 'danger');
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };

    if (finalCourseId) {
      getCourseDetails();
    } else {
      setError('No courseId provided.');
      setLoading(false);
    }
  }, [finalCourseId, addNotification]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status" aria-label="Loading Course Details">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!course) {
    return <Alert variant="warning">Course not found.</Alert>;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Course Details</Card.Title>
      </Card.Header>
      <Card.Body>
        <p><strong>Title:</strong> {course.titleCourse}</p>
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Status:</strong> <Badge bg={course.status === 'ACTIVE' ? 'success' : 'danger'}>{course.status}</Badge></p>
        <p><strong>Instructor:</strong> 
          {' '}{course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'N/A'}
        </p>
        {/* Thêm fields khác nếu cần */}
      </Card.Body>
      <Card.Footer>
        <Button
          variant="primary"
          onClick={() => navigate(`/dashboard/course/edit-course/${course.id}`)}
          aria-label="Edit Course"
        >
          Edit Course
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default CourseDetail;
