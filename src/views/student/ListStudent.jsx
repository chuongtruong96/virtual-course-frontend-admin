// src/views/student/ListStudent.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UPLOAD_PATH } from '../../config/endpoint';

// Import services
import StudentService from '../../services/studentService';

// Import NotificationContext
import { NotificationContext } from '../../contexts/NotificationContext';

// (Tuỳ bạn) Nếu bạn có một AddStudentModal, import nó:
// import AddStudentModal from './AddStudentModal';

const ListStudent = () => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Bộ lọc
  const [statusFilter, setStatusFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // (Nếu bạn có modal thêm student)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Lấy dữ liệu student khi mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await StudentService.fetchStudents(); 
        setStudentData(data);
      } catch (error) {
        alert('Failed to load students. Please try again later.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [addNotification]);

  // Hàm Enable Student
  const handleEnableStudent = async (studentId) => {
    try {
      await StudentService.enableStudent(studentId);
      addNotification('Student enabled successfully!', 'success');
      const updatedData = await StudentService.fetchStudents(); // Re-fetch data
      setStudentData(updatedData);
    } catch (error) {
      addNotification('Failed to enable student. Please try again.', 'danger');
    }
  };

  // Hàm Disable Student
  const handleDisableStudent = async (studentId) => {
    try {
      await StudentService.disableStudent(studentId);
      addNotification('Student disabled successfully!', 'success');
      const updatedData = await StudentService.fetchStudents(); // Re-fetch data
      setStudentData(updatedData);
    } catch (error) {
      addNotification('Failed to disable student. Please try again.', 'danger');
    }
  };

  // Hàm Delete Student
  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await StudentService.deleteStudent(id);
        // Loại bỏ khỏi list
        setStudentData((prev) => prev.filter((stu) => stu.id !== id));
        addNotification('Student deleted successfully!', 'success');
      } catch (error) {
        addNotification('Failed to delete student. Please try again.', 'danger');
      }
    }
  };

  // Bộ lọc 
  const filteredStudents = studentData.filter((stu) => {
    // Lọc theo status
    const matchStatus = statusFilter ? (stu.statusStudent === statusFilter) : true;
    // Lọc theo search name (VD: firstName + lastName)
    const fullName = (stu.firstName + ' ' + stu.lastName).toLowerCase();
    const matchName = searchFilter
      ? fullName.includes(searchFilter.toLowerCase())
      : true;
    return matchStatus && matchName;
  });

  // Tính toán phân trang
  const startIndex = (page - 1) * itemsPerPage;
  const currentPageStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Chuyển trang
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Bấm nút thêm Student => tuỳ logic:
  const handleShowAddStudentModal = () => setShowAddStudentModal(true);
  const handleCloseAddStudentModal = () => setShowAddStudentModal(false);

  // Sorting (tuỳ) - có thể thêm code sort theo cột if needed

  // Loading hiển thị spinner
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title as="h5">Student List</Card.Title>
            {/* Nút Add Student (nếu dùng modal) */}
            <Button variant="success" onClick={handleShowAddStudentModal}>
              Add Student
            </Button>
            {/* Hoặc nếu bạn muốn chuyển trang:
              <Button variant="success" onClick={() => navigate('/dashboard/student/add-student')}>
                Add Student
              </Button>
            */}
          </Card.Header>

          <Card.Body>
            {/* Lọc + Tìm kiếm */}
            <div className="filters mb-3 d-flex gap-3">
              <select
                className="form-select"
                onChange={(e) => setStatusFilter(e.target.value)}
                value={statusFilter}
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              <input
                type="text"
                className="form-control"
                placeholder="Search First/Last Name"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>

            {/* Table hiển thị Student */}
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Avatar</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPageStudents.length > 0 ? (
                  currentPageStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={`${student.firstName} ${student.lastName}`}
                            width="50"
                            height="50"
                          />
                        ) : (
                          <img
                            src="/virtualcourse/images/default-profile.png"
                            alt="Default"
                            width="50"
                            height="50"
                          />
                        )}
                      </td>
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>{student.gender}</td>
                      <td>{student.phone}</td>
                      <td>
                        <span
                          className={`badge ${
                            student.statusStudent === 'ACTIVE' ? 'bg-success' : 'bg-danger'
                          }`}
                        >
                          {student.statusStudent}
                        </span>
                      </td>
                      <td>
                        {/* Edit => /dashboard/student/edit-student/:id */}
                        <Button
                          variant="info"
                          size=""
                          className="me-2"
                          onClick={() => navigate(`/dashboard/student/edit-student/${student.id}`)}
                        >
                          Edit
                        </Button>

                        {/* Enable/Disable */}
                        {student.statusStudent === 'ACTIVE' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleDisableStudent(student.id)}
                          >
                            Disable
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEnableStudent(student.id)}
                          >
                            Enable
                          </Button>
                        )}

                        {/* Delete */}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination controls (Đơn giản) */}
            <div className="pagination-controls d-flex justify-content-between align-items-center">
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span>Page {page}</span>
              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page * itemsPerPage >= filteredStudents.length}
              >
                Next
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Modal AddStudent nếu có:
      {showAddStudentModal && (
        <AddStudentModal
          show={showAddStudentModal}
          handleClose={handleCloseAddStudentModal}
          setStudents={setStudentData}
        />
      )} 
      */}
    </Row>
  );
};

export default ListStudent;
