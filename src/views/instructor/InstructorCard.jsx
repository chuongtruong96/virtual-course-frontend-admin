import React, { useState } from 'react';
import { Card, Button, Badge, Collapse, Row, Col } from 'react-bootstrap';
import {
  FaBook,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaInfoCircle,
  FaWallet,
  FaMoneyCheckAlt,
  FaBell,
  FaStar
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import { UPLOAD_BASE } from '../../config/endpoint';
import { useNavigate } from 'react-router-dom';

// 1) Import hook useCourses => fetch list of courses by instructor
import useCourses from '../../hooks/useCourses';
// 2) Import CourseDetail (để hiển thị chi tiết 1 course)
import CourseDetail from '../../views/course/CourseDetail';

import '../../styles/InstructorCard.css';

const InstructorCard = ({
  instructor,
  onEdit,
  onDelete,
  onEnable,
  onDisable,
  onViewDetail
}) => {
  const navigate = useNavigate();
  const [openCourses, setOpenCourses] = useState(false);

  // State để lưu courseId đang được chọn để xem chi tiết
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Nguồn ảnh
  const imageUrl = instructor.photo
    ? `${UPLOAD_BASE}/instructor/${instructor.photo}`
    : '/virtualcourse/images/default-profile.png';

  // Toggle collapse
  const toggleCourses = () => {
    setOpenCourses(!openCourses);
  };

  // Lấy danh sách courses theo instructorId
  const instructorId = instructor?.id;
  const {
    courses,      // => mảng các Course
    isLoading,
    isError,
    error,
  } = useCourses(instructorId);

  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId);
  };

  return (
    <Card className="instructor-card-horizontal w-100">
      <Row className="g-0">
        <Col md={3} className="image-col">
          <Card.Img
            variant="top"
            src={imageUrl}
            alt={`${instructor.firstName} ${instructor.lastName}`}
            className="instructor-image-horizontal"
          />
        </Col>
        <Col md={9}>
          <Card.Body className="d-flex flex-column h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Card.Title className="mb-1">
                  {instructor.firstName} {instructor.lastName}
                </Card.Title>
                <Card.Subtitle className="text-muted mb-2">
                  {instructor.title} - {instructor.workplace}
                </Card.Subtitle>
              </div>
              <Badge
                bg={instructor.status === 'ACTIVE' ? 'success' : 'danger'}
                className="ms-2"
              >
                {instructor.status}
              </Badge>
            </div>

            <Card.Text className="mb-2">
              <strong>Gender:</strong> {instructor.gender} <br />
              <strong>Phone:</strong> {instructor.phone || 'N/A'} <br />
              <strong>Address:</strong> {instructor.address || 'N/A'}
            </Card.Text>

            {/* -- Dãy nút Action -- */}
            <div className="d-flex flex-wrap gap-2 mt-auto">
              <Button variant="info" size="sm" onClick={onViewDetail}>
                <FaInfoCircle /> View
              </Button>
              <Button variant="warning" size="sm" onClick={onEdit}>
                <FaEdit /> Edit
              </Button>
              {instructor.status === 'ACTIVE' ? (
                <Button variant="secondary" size="sm" onClick={onDisable}>
                  <FaToggleOff /> Disable
                </Button>
              ) : (
                <Button variant="success" size="sm" onClick={onEnable}>
                  <FaToggleOn /> Enable
                </Button>
              )}
              <Button variant="danger" size="sm" onClick={onDelete}>
                <FaTrash /> Delete
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  navigate(`/dashboard/instructor/${instructor.id}/wallet`)
                }
              >
                <FaWallet /> Wallet
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  navigate(`/dashboard/instructor/${instructor.id}/transactions`)
                }
              >
                <FaMoneyCheckAlt /> Transactions
              </Button>
              <Button
                variant="warning"
                size="sm"
                onClick={() =>
                  navigate(`/dashboard/instructor/${instructor.id}/notifications`)
                }
              >
                <FaBell /> Notifications
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() =>
                  navigate(`/dashboard/instructor/${instructor.id}/reviews`)
                }
              >
                <FaStar /> Reviews
              </Button>

              {/* Nút toggle hiển thị danh sách course */}
              <Button variant="outline-primary" size="sm" onClick={toggleCourses}>
                <FaBook /> Show Courses
              </Button>
            </div>

            {/* -- Collapse => hiển thị danh sách Course -- */}
            <Collapse in={openCourses}>
              <div className="mt-3" style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                {isLoading && <p>Loading courses ...</p>}
                {isError && <p className="text-danger">{error?.message || 'Error fetching courses'}</p>}

                {courses && courses.length > 0 ? (
                  <div>
                    <h5>Courses of this Instructor:</h5>
                    <ul style={{ marginLeft: '1rem' }}>
                      {courses.map((course) => (
                        <li key={course.id} style={{ marginBottom: '0.5rem' }}>
                          <strong>{course.titleCourse}</strong> -{' '}
                          <em>{course.status}</em>
                          {'  '}
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleSelectCourse(course.id)}
                          >
                            View Detail
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No courses found for this instructor.</p>
                )}

                {/* Hiển thị CourseDetail (nếu có selectedCourseId) */}
                {selectedCourseId && (
                  <div style={{ marginTop: '1rem' }}>
                    <CourseDetail forcedCourseId={selectedCourseId} />
                  </div>
                )}
              </div>
            </Collapse>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

InstructorCard.propTypes = {
  instructor: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEnable: PropTypes.func.isRequired,
  onDisable: PropTypes.func.isRequired,
  onViewDetail: PropTypes.func.isRequired,
};

export default InstructorCard;
