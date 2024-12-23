// src/views/student/ListStudent.jsx

import React, { useState, useEffect } from 'react';
import StudentService from '../../services/studentService'; // Sử dụng default import
import { Row, Col, Card, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// import AddStudentModal from './AddStudentModal'; // Giả sử bạn có component modal AddStudent
// import '../../styles/ListStudent.css'; // Import CSS tùy chỉnh nếu cần

const ListStudent = () => {
    const [studentData, setStudentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    // State để điều khiển modal
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await StudentService.fetchStudents(); // Sử dụng StudentService.fetchStudents
                setStudentData(data);
            } catch (error) {
                setNotification({
                    message: 'Failed to load students. Please try again later.',
                    type: 'danger',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEnableStudent = async (id) => {
        try {
            await StudentService.enableStudent(id); // Sử dụng StudentService.enableStudent
            setStudentData((prevData) =>
                prevData.map((student) =>
                    student.id === id ? { ...student, statusStudent: 'ACTIVE' } : student
                )
            );
            setNotification({
                message: 'Student enabled successfully!',
                type: 'success',
            });
        } catch (error) {
            setNotification({
                message: 'Failed to enable student. Please try again.',
                type: 'danger',
            });
        }
    };

    const handleDisableStudent = async (id) => {
        try {
            await StudentService.disableStudent(id); // Sử dụng StudentService.disableStudent
            setStudentData((prevData) =>
                prevData.map((student) =>
                    student.id === id ? { ...student, statusStudent: 'INACTIVE' } : student
                )
            );
            setNotification({
                message: 'Student disabled successfully!',
                type: 'success',
            });
        } catch (error) {
            setNotification({
                message: 'Failed to disable student. Please try again.',
                type: 'danger',
            });
        }
    };

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await StudentService.deleteStudent(id); // Sử dụng StudentService.deleteStudent
                setStudentData((prevData) => prevData.filter((student) => student.id !== id));
                setNotification({
                    message: 'Student deleted successfully!',
                    type: 'success',
                });
            } catch (error) {
                setNotification({
                    message: 'Failed to delete student. Please try again.',
                    type: 'danger',
                });
            }
        }
    };

    const handleShowAddStudentModal = () => setShowAddStudentModal(true);
    const handleCloseAddStudentModal = () => setShowAddStudentModal(false);

    if (loading) {
        return (
            <div className="text-center">
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
                        {/* Button Add Student */}
                        <Button variant="success" onClick={handleShowAddStudentModal}>
                            Add Student
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        {/* Display notifications */}
                        {notification && <Alert variant={notification.type}>{notification.message}</Alert>}

                        {/* Filters và Sorting có thể thêm nếu cần */}

                        {/* Table */}
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
                                {studentData.length > 0 ? (
                                    studentData.map((student) => (
                                        <tr key={student.id}>
                                            <td>{student.id}</td>
                                            <td>
                                                {student.avatar ? (
                                                    <img src={student.avatar} alt={`${student.firstName} ${student.lastName}`} width="50" height="50" />
                                                ) : (
                                                    <img src="/uploads/student/default-avatar.png" alt="Default Avatar" width="50" height="50" />
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
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    onClick={() => navigate(`/student/edit-student/${student.id}`)}
                                                    className="me-2"
                                                >
                                                    Edit
                                                </Button>
                                                {student.statusStudent === 'ACTIVE' ? (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleDisableStudent(student.id)}
                                                        className="me-2"
                                                    >
                                                        Disable
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleEnableStudent(student.id)}
                                                        className="me-2"
                                                    >
                                                        Enable
                                                    </Button>
                                                )}
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

                        {/* Pagination Controls có thể thêm nếu cần */}
                    </Card.Body>
                </Card>
            </Col>

            {/* Modal AddStudent */}
            {/* Bạn cần triển khai AddStudentModal hoặc sử dụng navigate tới AddStudent page */}
            {/* <AddStudentModal show={showAddStudentModal} handleClose={handleCloseAddStudentModal} /> */}
        </Row>
    );

};

export default ListStudent;
