// src/views/course/EditCourse.jsx

import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Spinner, Image } from 'react-bootstrap';
import CourseService from '../../services/courseService';
import CategoryService from '../../services/categoryService';
import InstructorService from '../../services/instructorService';
import { uploadPhoto } from '../../services/fileService'; // Import phương thức upload
import { useParams, useNavigate } from 'react-router-dom';

const EditCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
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
        imageCover: '', // Thêm trường imageCover
        urlVideo: '',
        hashtag: '',
        // Các trường khác nếu cần
    });

    // State quản lý file upload & preview
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseData, categoryData, instructorData] = await Promise.all([
                    CourseService.fetchCourseById(courseId),
                    CategoryService.fetchCategories(),
                    InstructorService.fetchInstructors(),
                ]);
                setFormData({
                    titleCourse: courseData.titleCourse,
                    description: courseData.description,
                    categoryId: courseData.categoryId,
                    level: courseData.level,
                    basePrice: courseData.basePrice,
                    duration: courseData.duration,
                    status: courseData.status,
                    imageCover: courseData.imageCover || '',
                    urlVideo: courseData.urlVideo || '',
                    hashtag: courseData.hashtag || '',
                    // Các trường khác nếu cần
                });
                setCategories(categoryData);
                setInstructors(instructorData);

                // Xử lý preview nếu đã có imageCover
                if (courseData.imageCover) {
                    setImagePreview(`http://localhost:8080/uploads/course/${courseData.imageCover}`);
                } else {
                    setImagePreview('https://via.placeholder.com/150'); // Ảnh mặc định
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
                setError('Failed to load course data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const chosenFile = e.target.files[0];
        if (chosenFile) {
            setFile(chosenFile);
            setImagePreview(URL.createObjectURL(chosenFile)); // Preview local
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please choose a file to upload.');
            return;
        }
        setUploading(true);
        setError(null);
        try {
            // Gọi API uploadPhoto cho entity='course'
            const uploadedFileName = await uploadPhoto(file, 'course');

            // Set imageCover thành tên file
            setFormData(prev => ({ ...prev, imageCover: uploadedFileName }));

            // Set imagePreview thành đường dẫn đầy đủ
            setImagePreview(`http://localhost:8080/uploads/course/${uploadedFileName}`);

            alert('Image uploaded successfully!');
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Kiểm tra dữ liệu bắt buộc
        if (!formData.titleCourse || !formData.description || !formData.categoryId || !formData.basePrice || !formData.duration) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            await CourseService.editCourse(courseId, formData);
            alert('Course updated successfully!');
            navigate('/courses');
        } catch (error) {
            console.error("Error updating course:", error);
            setError('Failed to update course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/courses');
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>Edit Course</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="titleCourse" className="mb-3">
                    <Form.Label>Course Title *</Form.Label>
                    <Form.Control
                        type="text"
                        name="titleCourse"
                        value={formData.titleCourse}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="categoryId" className="mb-3">
                    <Form.Label>Category *</Form.Label>
                    <Form.Control as="select" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="level" className="mb-3">
                    <Form.Label>Level *</Form.Label>
                    <Form.Control as="select" name="level" value={formData.level} onChange={handleChange} required>
                        <option value="BEGINNER">BEGINNER</option>
                        <option value="INTERMEDIATE">INTERMEDIATE</option>
                        <option value="ADVANCED">ADVANCED</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="basePrice" className="mb-3">
                    <Form.Label>Base Price *</Form.Label>
                    <Form.Control
                        type="number"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="duration" className="mb-3">
                    <Form.Label>Duration (hrs) *</Form.Label>
                    <Form.Control
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="status" className="mb-3">
                    <Form.Label>Status *</Form.Label>
                    <Form.Control as="select" name="status" value={formData.status} onChange={handleChange} required>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </Form.Control>
                </Form.Group>

                {/* Upload Image Cover */}
                <Form.Group controlId="imageCover" className="mb-3">
                    <Form.Label>Image Cover</Form.Label>
                    <div className="d-flex align-items-center">
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <Button variant="outline-primary" className="ms-2" onClick={handleUpload} disabled={!file || uploading}>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                    {imagePreview && (
                        <div className="mt-3">
                            <Image src={imagePreview} alt="Course Cover" thumbnail width={200} />
                        </div>
                    )}
                </Form.Group>

                {/* Các trường khác nếu cần */}

                <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save Changes'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default EditCourse;
