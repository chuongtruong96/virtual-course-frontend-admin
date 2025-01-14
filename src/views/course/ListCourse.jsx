// src/views/course/ListCourse.jsx
import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Table, Spinner, Alert } from 'react-bootstrap';
import { NotificationContext } from '../../contexts/NotificationContext';
import useCourses from '../../hooks/useCourses';

const ListCourse = ({ instructorId: propInstructorId }) => {
  // Nếu parent (InstructorCard) truyền props.instructorId, ta ưu tiên. 
  // Còn nếu parent ko truyền => check route param. 
  // => Tùy logic bạn, 
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  // optional route param
  const routeParams = useParams();
  const routeInstructorId = routeParams.instructorId;

  // final instructorId => ưu tiên prop > route param
  const instructorId = propInstructorId ?? routeInstructorId;

  const { courses, isLoading, isError, error, deleteCourse, toggleCourseStatus } = useCourses(instructorId);

  const handleAddCourse = () => {
    if (instructorId) {
      navigate(`/dashboard/course/add-course/${instructorId}`);
    } else {
      addNotification('No instructorId => cannot add course', 'warning');
    }
  };

  const handleEditCourse = (courseId) => {
    navigate(`/dashboard/course/edit-course/${courseId}`);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này không?')) {
      deleteCourse(courseId);
    }
  };

  const handleToggleStatus = (courseId, currentStatus) => {
    toggleCourseStatus({ courseId, currentStatus });
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" aria-label="Loading Courses">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Đang tải danh sách khóa học...</p>
      </div>
    );
  }

  if (isError) {
    return <Alert variant="danger">{error || 'Failed to load courses.'}</Alert>;
  }

  return (
    <div className="list-course-container">
      <h2>
        Danh Sách Khóa Học {instructorId ? `(Instructor ${instructorId})` : '(All)'}
      </h2>
      {instructorId && (
        <Button variant="primary" onClick={handleAddCourse} className="mb-3" aria-label="Add Course">
          Thêm Khóa Học cho Instructor {instructorId}
        </Button>
      )}

      {courses.length > 0 ? (
        <Table striped bordered hover responsive aria-label="Courses Table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Level</th>
              <th>Price ($)</th>
              <th>Duration (hrs)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.titleCourse}</td>
                <td>{course.categoryName}</td>
                <td>{course.level}</td>
                <td>{course.basePrice}</td>
                <td>{course.duration}</td>
                <td>
                  <span className={`badge ${course.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                    {course.status}
                  </span>
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditCourse(course.id)}
                    aria-label={`Edit Course ${course.titleCourse}`}
                  >
                    Chỉnh Sửa
                  </Button>
                  <Button
                    variant={course.status === 'ACTIVE' ? 'secondary' : 'success'}
                    size="sm"
                    className="me-2"
                    onClick={() => handleToggleStatus(course.id, course.status)}
                    aria-label={`${course.status === 'ACTIVE' ? 'Disable' : 'Enable'} Course ${course.titleCourse}`}
                  >
                    {course.status === 'ACTIVE' ? 'Ngừng Hoạt Động' : 'Kích Hoạt'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                    aria-label={`Delete Course ${course.titleCourse}`}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">
          No courses found {instructorId ? `for instructorId=${instructorId}` : ''}
        </Alert>
      )}
    </div>
  );
};

export default ListCourse;
