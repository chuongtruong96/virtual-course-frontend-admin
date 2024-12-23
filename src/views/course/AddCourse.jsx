// src/views/course/AddCourse.jsx

import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import CourseService from '../../services/courseService';
import CategoryService from '../../services/categoryService';
import InstructorService from '../../services/instructorService';
import { uploadPhoto } from '../../services/fileService'; // Sử dụng uploadPhoto với tham số 'course'
import { useNavigate } from 'react-router-dom';
// import '../../styles/AddCourseForm.css';

const AddCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [instructors, setInstructors] = useState([]);

    const [formData, setFormData] = useState({
        titleCourse: '',
        description: '',
        categoryId: '',
        level: 'BEGINNER',
        basePrice: '',
        duration: '',
        status: 'ACTIVE',
        imageCover: '',
    });

    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryData, instructorData] = await Promise.all([
                    CategoryService.fetchCategories(),
                    InstructorService.fetchInstructors(),
                ]);
                setCategories(categoryData);
                setInstructors(instructorData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError('Failed to load categories or instructors.');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        setUploading(true);
        setError(null);
        try {
            const uploadedFilePath = await uploadPhoto(file, 'course'); // entity = 'course'
            setFormData(prev => ({ ...prev, imageCover: uploadedFilePath }));
            alert('Image cover uploaded successfully!');
        } catch (err) {
            console.error("Error uploading image cover:", err);
            setError('Failed to upload image cover. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Kiểm tra dữ liệu bắt buộc
        const { titleCourse, description, categoryId, basePrice, duration, imageCover } = formData;
        if (!titleCourse || !description || !categoryId || !basePrice || !duration || !imageCover) {
            setError('Please fill in all required fields and upload an image cover.');
            setLoading(false);
            return;
        }

        try {
            await CourseService.addCourse(formData);
            alert('Course added successfully!');
            navigate('/course/list-course'); // Điều hướng về danh sách Course
        } catch (err) {
            console.error("Error adding course:", err);
            setError('Failed to add course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/course/list-course');
    };

    return (
        <div className="add-course-form-container">
            <Form onSubmit={handleSubmit}>
                <h2>Add Course</h2>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group controlId="titleCourse" className="mb-3">
                    <Form.Label>Course Title <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control
                        type="text"
                        name="titleCourse"
                        value={formData.titleCourse}
                        onChange={handleChange}
                        required
                        placeholder="Enter course title"
                    />
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Description <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Enter course description"
                    />
                </Form.Group>

                <Form.Group controlId="categoryId" className="mb-3">
                    <Form.Label>Category <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control
                        as="select"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="level" className="mb-3">
                    <Form.Label>Level <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control
                        as="select"
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        required
                    >
                        <option value="BEGINNER">BEGINNER</option>
                        <option value="INTERMEDIATE">INTERMEDIATE</option>
                        <option value="ADVANCED">ADVANCED</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="basePrice" className="mb-3">
                    <Form.Label>Base Price ($) <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control
                        type="number"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleChange}
                        required
                        placeholder="Enter base price"
                        min="0"
                        step="0.01"
                    />
                </Form.Group>

                <Form.Group controlId="duration" className="mb-3">
                    <Form.Label>Duration (hours) <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        placeholder="Enter duration in hours"
                        min="0"
                    />
                </Form.Group>

                <Form.Group controlId="formStatus" className="mb-3">
                    <Form.Label>Status <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control
                        as="select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formImageCover" className="mb-3">
                    <Form.Label>Image Cover <span style={{ color: 'red' }}>*</span></Form.Label>
                    <div className="d-flex align-items-center">
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="outline-secondary"
                            className="ms-2"
                            onClick={handleUpload}
                            disabled={uploading || !file}
                        >
                            {uploading ? <Spinner as="span" animation="border" size="sm" /> : 'Upload'}
                        </Button>
                    </div>
                    {imagePreview && (
                        <img src={imagePreview} alt="Course Cover Preview" className="mt-3" width="100" height="100" />
                    )}
                </Form.Group>

                <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save'}
                    </Button>
                </div>
            </Form>
        </div>
    );

};

export default AddCourse;
