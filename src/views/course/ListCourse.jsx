// src/views/course/ListCourse.jsx

import React, { useState, useEffect } from 'react';
import { Button, Table, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import CourseService from '../../services/courseService';
import CategoryService from '../../services/categoryService';
import InstructorService from '../../services/instructorService'; // Giả sử bạn cần fetch instructors
import { useNavigate } from 'react-router-dom';

const ListCourse = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [courseData, categoryData, instructorData] = await Promise.all([
                CourseService.fetchCourses(),
                CategoryService.fetchCategories(),
                InstructorService.fetchInstructors(), // Giả sử bạn có phương thức fetchInstructors
            ]);
            setCourses(courseData);
            setCategories(categoryData);
            setInstructors(instructorData);
        } catch (error) {
            setNotification({ message: 'Failed to load courses.', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = () => {
        setShowAddModal(true);
    };

    const handleEditCourse = (course) => {
        setCurrentCourse(course);
        setShowEditModal(true);
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await CourseService.deleteCourse(courseId);
                setCourses(courses.filter(course => course.id !== courseId));
                setNotification({ message: 'Course deleted successfully!', type: 'success' });
            } catch (error) {
                setNotification({ message: 'Failed to delete course.', type: 'danger' });
            }
        }
    };

    const handleEnableCourse = async (courseId) => {
        try {
            await CourseService.enableCourse(courseId);
            setCourses(courses.map(course => course.id === courseId ? { ...course, status: 'ACTIVE' } : course));
            setNotification({ message: 'Course enabled successfully!', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Failed to enable course.', type: 'danger' });
        }
    };

    const handleDisableCourse = async (courseId) => {
        try {
            await CourseService.disableCourse(courseId);
            setCourses(courses.map(course => course.id === courseId ? { ...course, status: 'INACTIVE' } : course));
            setNotification({ message: 'Course disabled successfully!', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Failed to disable course.', type: 'danger' });
        }
    };

    const handleAddModalClose = () => setShowAddModal(false);
    const handleEditModalClose = () => setShowEditModal(false);

    const handleAddCourseSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const newCourse = {
            titleCourse: form.elements.titleCourse.value,
            description: form.elements.description.value,
            categoryId: parseInt(form.elements.categoryId.value),
            level: form.elements.level.value,
            basePrice: parseFloat(form.elements.basePrice.value),
            duration: parseInt(form.elements.duration.value),
            status: form.elements.status.value,
            // Các trường khác nếu cần
        };
        try {
            const addedCourse = await CourseService.addCourse(newCourse);
            setCourses([...courses, addedCourse]);
            setNotification({ message: 'Course added successfully!', type: 'success' });
            handleAddModalClose();
        } catch (error) {
            setNotification({ message: 'Failed to add course.', type: 'danger' });
        }
    };

    const handleEditCourseSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const updatedCourse = {
            titleCourse: form.elements.titleCourse.value,
            description: form.elements.description.value,
            categoryId: parseInt(form.elements.categoryId.value),
            level: form.elements.level.value,
            basePrice: parseFloat(form.elements.basePrice.value),
            duration: parseInt(form.elements.duration.value),
            status: form.elements.status.value,
            // Các trường khác nếu cần
        };
        try {
            const editedCourse = await CourseService.editCourse(currentCourse.id, updatedCourse);
            setCourses(courses.map(course => course.id === editedCourse.id ? editedCourse : course));
            setNotification({ message: 'Course updated successfully!', type: 'success' });
            handleEditModalClose();
        } catch (error) {
            setNotification({ message: 'Failed to update course.', type: 'danger' });
        }
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <div>
            <h2>Course List</h2>
            {notification && <Alert variant={notification.type}>{notification.message}</Alert>}
            <Button variant="primary" onClick={handleAddCourse} className="mb-3">
                Add Course
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Level</th>
                        <th>Base Price</th>
                        <th>Duration (hrs)</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>{course.titleCourse}</td>
                            <td>{course.description}</td>
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
                                <Button variant="warning" onClick={() => handleEditCourse(course)} className="me-2">
                                    Edit
                                </Button>
                                {course.status === 'ACTIVE' ? (
                                    <Button variant="secondary" onClick={() => handleDisableCourse(course.id)} className="me-2">
                                        Disable
                                    </Button>
                                ) : (
                                    <Button variant="success" onClick={() => handleEnableCourse(course.id)} className="me-2">
                                        Enable
                                    </Button>
                                )}
                                <Button variant="danger" onClick={() => handleDeleteCourse(course.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add Course Modal */}
            <Modal show={showAddModal} onHide={handleAddModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddCourseSubmit}>
                        <Form.Group controlId="titleCourse" className="mb-3">
                            <Form.Label>Course Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter course title" name="titleCourse" required />
                        </Form.Group>
                        <Form.Group controlId="description" className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter description" name="description" required />
                        </Form.Group>
                        <Form.Group controlId="categoryId" className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" name="categoryId" required>
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="level" className="mb-3">
                            <Form.Label>Level</Form.Label>
                            <Form.Control as="select" name="level" required>
                                <option value="BEGINNER">BEGINNER</option>
                                <option value="INTERMEDIATE">INTERMEDIATE</option>
                                <option value="ADVANCED">ADVANCED</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="basePrice" className="mb-3">
                            <Form.Label>Base Price ($)</Form.Label>
                            <Form.Control type="number" placeholder="Enter base price" name="basePrice" required min="0" step="0.01" />
                        </Form.Group>
                        <Form.Group controlId="duration" className="mb-3">
                            <Form.Label>Duration (hrs)</Form.Label>
                            <Form.Control type="number" placeholder="Enter duration in hours" name="duration" required min="0" />
                        </Form.Group>
                        <Form.Group controlId="status" className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" name="status" required>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </Form.Control>
                        </Form.Group>
                        {/* Các trường khác nếu cần */}
                        <Button variant="primary" type="submit">
                            Add Course
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Course Modal */}
            <Modal show={showEditModal} onHide={handleEditModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentCourse && (
                        <Form onSubmit={handleEditCourseSubmit}>
                            <Form.Group controlId="titleCourse" className="mb-3">
                                <Form.Label>Course Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="titleCourse"
                                    defaultValue={currentCourse.titleCourse}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="description" className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    defaultValue={currentCourse.description}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="categoryId" className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control as="select" name="categoryId" defaultValue={currentCourse.categoryId} required>
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="level" className="mb-3">
                                <Form.Label>Level</Form.Label>
                                <Form.Control as="select" name="level" defaultValue={currentCourse.level} required>
                                    <option value="BEGINNER">BEGINNER</option>
                                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                                    <option value="ADVANCED">ADVANCED</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="basePrice" className="mb-3">
                                <Form.Label>Base Price ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter base price"
                                    name="basePrice"
                                    defaultValue={currentCourse.basePrice}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </Form.Group>
                            <Form.Group controlId="duration" className="mb-3">
                                <Form.Label>Duration (hrs)</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter duration in hours"
                                    name="duration"
                                    defaultValue={currentCourse.duration}
                                    required
                                    min="0"
                                />
                            </Form.Group>
                            <Form.Group controlId="status" className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Control as="select" name="status" defaultValue={currentCourse.status} required>
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </Form.Control>
                            </Form.Group>
                            {/* Các trường khác nếu cần */}
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );

};

export default ListCourse;
    