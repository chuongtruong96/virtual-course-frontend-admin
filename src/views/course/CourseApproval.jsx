// src/views/course/CourseApproval.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { NotificationContext } from '../../contexts/NotificationContext';
import CourseService from '../../services/courseService';
import './CourseApproval.css';

const CourseApproval = () => {
  const { addNotification } = useContext(NotificationContext);

  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [submittingReject, setSubmittingReject] = useState(false);

  // Fetch pending courses
  useEffect(() => {
    const fetchPendingCourses = async () => {
      try {
        const list = await CourseService.fetchPendingCourses({ signal: null });
        setPendingCourses(list);
      } catch (err) {
        console.error('Error fetching pending courses:', err);
        setErrorMessage('Failed to load pending courses');
      } finally {
        setLoading(false);
      }
    };
    fetchPendingCourses();
  }, []);

  const handleApprove = async (courseId) => {
    try {
      await CourseService.approveCourse(courseId);
      // filter ra
      setPendingCourses((prev) => prev.filter((c) => c.id !== courseId));
      addNotification(`Course #${courseId} approved!`, 'success');
    } catch (err) {
      console.error('Error approving course:', err);
      addNotification('Failed to approve course.', 'danger');
    }
  };

  const handleRejectClick = (course) => {
    setSelectedCourse(course);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      addNotification('Please provide a reject reason.', 'warning');
      return;
    }
    setSubmittingReject(true);
    try {
      await CourseService.rejectCourse(selectedCourse.id, rejectReason);
      // filter ra
      setPendingCourses((prev) => prev.filter((c) => c.id !== selectedCourse.id));
      addNotification(`Course #${selectedCourse.id} rejected.`, 'success');
      setShowRejectModal(false);
    } catch (err) {
      console.error('Error rejecting course:', err);
      addNotification('Failed to reject course.', 'danger');
    } finally {
      setSubmittingReject(false);
    }
  };

  const handleCloseRejectModal = () => {
    if (!submittingReject) {
      setShowRejectModal(false);
      setSelectedCourse(null);
    }
  };

  if (loading) {
    return (
      <div className="course-approval-loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading courses...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="course-approval-container">
      <h2>Pending Course Approval</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {pendingCourses.length > 0 ? (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Instructor</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.titleCourse}</td>
                <td>{course.instructorFirstName} {course.instructorLastName}</td>
                <td>{course.categoryName}</td>
                <td>{course.status}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleApprove(course.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRejectClick(course)}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No pending courses found.</Alert>
      )}

      {/* Modal Reject */}
      <Modal show={showRejectModal} onHide={handleCloseRejectModal}>
        <Modal.Header closeButton={!submittingReject}>
          <Modal.Title>Reject Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You are rejecting course <strong>#{selectedCourse?.id}</strong>.
          </p>
          <Form.Group controlId="rejectReason">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter the reject reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseRejectModal}
            disabled={submittingReject}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmReject}
            disabled={submittingReject}
          >
            {submittingReject ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              'Reject'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseApproval;
