// src/views/course/PendingCourses.jsx
import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Spinner, Badge, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useCourseApproval from '../../hooks/useCourseApproval';
import useCourses from '../../hooks/useCourses';

const PendingCourses = () => {
  const navigate = useNavigate();
  const { pendingCourses, isLoading, isError, error } = useCourses('pending');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { 
    approvalHistory,
    approveCourse, 
    rejectCourse,
    isApproving,
    isRejecting
  } = useCourseApproval(selectedCourse?.id);

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalChecklist, setApprovalChecklist] = useState({
    contentComplete: false,
    pricingAppropriate: false,
    technicalRequirements: false,
    instructorVerified: false
  });

  const renderInstructorName = (instructor) => {
    if (!instructor) return 'N/A';
    return `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || 'N/A';
  };

  const renderCategory = (category) => {
    if (!category) return 'N/A';
    return category.name || 'N/A';
  };

  const formatSubmissionDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // src/views/course/PendingCourses.jsx
// src/views/course/PendingCourses.jsx
const handleApprove = () => {
  if (!selectedCourse?.id) {
    console.error('No course selected for approval');
    return;
  }

  if (!Object.values(approvalChecklist).every(Boolean)) {
    alert('Please complete all checklist items before approving');
    return;
  }

  try {
    // Convert ID to number and validate
    const courseId = Number(selectedCourse.id);
    if (isNaN(courseId)) {
      throw new Error('Invalid course ID');
    }

    // Log approval attempt
    console.log('Attempting to approve course:', {
      courseId,
      notes
    });

    approveCourse({ 
      courseId,
      notes: notes || ''
    });
    
    setShowApproveModal(false);
    setSelectedCourse(null);
    setNotes('');
    setApprovalChecklist({
      contentComplete: false,
      pricingAppropriate: false,
      technicalRequirements: false,
      instructorVerified: false
    });
  } catch (error) {
    console.error('Error during course approval:', error);
    alert(error.message || 'Failed to approve course');
  }
};


  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      rejectCourse({
        courseId: selectedCourse.id,
        reason: rejectionReason
      });
      setShowRejectModal(false);
      setSelectedCourse(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting course:', error);
    }
  };

  const handleChecklistChange = (field) => {
    setApprovalChecklist(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="danger">
        <h5>Error loading courses</h5>
        <p>{error?.message || 'An unknown error occurred'}</p>
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>Pending Courses</Card.Title>
        </Card.Header>
        <Card.Body>
          {!pendingCourses || pendingCourses.length === 0 ? (
            <Alert variant="info">
              <p className="mb-0">No pending courses found</p>
            </Alert>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Submitted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingCourses.map(course => (
                  <tr key={course.id}>
                    <td>{course.titleCourse || 'N/A'}</td>
                    <td>{renderInstructorName(course.instructor)}</td>
                    <td>{renderCategory(course.category)}</td>
                    <td>
                      <Badge bg="info">{course.level || 'N/A'}</Badge>
                    </td>
                    <td>{course.duration ? `${course.duration} hrs` : 'N/A'}</td>
                    <td>{course.price ? `$${course.price}` : 'N/A'}</td>
                    <td>{formatSubmissionDate(course.createdAt)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowApproveModal(true);
                          }}
                          disabled={isApproving}
                        >
                          {isApproving ? 'Approving...' : 'Approve'}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowRejectModal(true);
                          }}
                          disabled={isRejecting}
                        >
                          {isRejecting ? 'Rejecting...' : 'Reject'}
                        </Button>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowHistoryModal(true);
                          }}
                        >
                          History
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Approve Modal */}
      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Approve Course: {selectedCourse?.titleCourse}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h6 className="mb-3">Course Details:</h6>
            <p><strong>Instructor:</strong> {selectedCourse && renderInstructorName(selectedCourse.instructor)}</p>
            <p><strong>Category:</strong> {selectedCourse && renderCategory(selectedCourse.category)}</p>
            <p><strong>Level:</strong> {selectedCourse?.level}</p>
            <p><strong>Duration:</strong> {selectedCourse?.duration} hours</p>
            <p><strong>Price:</strong> ${selectedCourse?.price}</p>
          </div>

          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Approval Checklist</Form.Label>
              <div className="border rounded p-3">
                <Form.Check 
                  type="checkbox"
                  id="content-complete"
                  label="Course content is complete and well-structured"
                  checked={approvalChecklist.contentComplete}
                  onChange={() => handleChecklistChange('contentComplete')}
                  className="mb-2"
                />
                <Form.Check 
                  type="checkbox"
                  id="pricing-appropriate"
                  label="Pricing is appropriate for the content"
                  checked={approvalChecklist.pricingAppropriate}
                  onChange={() => handleChecklistChange('pricingAppropriate')}
                  className="mb-2"
                />
                <Form.Check 
                  type="checkbox"
                  id="technical-requirements"
                  label="Technical requirements are met"
                  checked={approvalChecklist.technicalRequirements}
                  onChange={() => handleChecklistChange('technicalRequirements')}
                  className="mb-2"
                />
                <Form.Check 
                  type="checkbox"
                  id="instructor-verified"
                  label="Instructor credentials verified"
                  checked={approvalChecklist.instructorVerified}
                  onChange={() => handleChecklistChange('instructorVerified')}
                />
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Approval Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about the approval..."
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleApprove}
            disabled={isApproving || !notes.trim() || !Object.values(approvalChecklist).every(Boolean)}
          >
            {isApproving ? 'Approving...' : 'Approve Course'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Course: {selectedCourse?.titleCourse}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h6 className="mb-3">Course Details:</h6>
            <p><strong>Instructor:</strong> {selectedCourse && renderInstructorName(selectedCourse.instructor)}</p>
            <p><strong>Category:</strong> {selectedCourse && renderCategory(selectedCourse.category)}</p>
            <p><strong>Level:</strong> {selectedCourse?.level}</p>
            <p><strong>Duration:</strong> {selectedCourse?.duration} hours</p>
            <p><strong>Price:</strong> ${selectedCourse?.price}</p>
          </div>

          <Form>
            <Form.Group>
              <Form.Label>Rejection Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why the course is being rejected..."
                required
              />
              <Form.Text className="text-muted">
                Please provide a detailed explanation to help the instructor understand what needs to be improved.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleReject}
            disabled={isRejecting || !rejectionReason.trim()}
          >
            {isRejecting ? 'Rejecting...' : 'Reject Course'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* History Modal */}
      <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Approval History: {selectedCourse?.titleCourse}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {approvalHistory?.length > 0 ? (
            <div className="timeline">
              {approvalHistory.map((history, index) => (
                <div key={index} className="mb-3 pb-3 border-bottom">
                  <div className="d-flex justify-content-between">
                    <strong>{history.status}</strong>
                    <small>{formatSubmissionDate(history.createdAt)}</small>
                  </div>
                  <p className="mb-1">
                    <strong>Reviewer:</strong> {history.reviewer?.username || 'N/A'}
                  </p>
                  {history.notes && (
                    <p className="mb-1">
                      <strong>Notes:</strong> {history.notes}
                    </p>
                  )}
                  {history.rejectionReason && (
                    <p className="mb-1">
                      <strong>Reason:</strong> {history.rejectionReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Alert variant="info">No approval history available</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PendingCourses;
