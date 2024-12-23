// src/views/category/AddCategory.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../services/categoryService';
import { uploadPhoto } from '../../services/fileService'; // Sử dụng uploadPhoto với tham số 'category'
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
// import '../../styles/AddCategoryForm.css';

const AddCategory = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
    });

    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

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
            const uploadedFilePath = await uploadPhoto(file, 'category'); // entity = 'category'
            setFormData(prev => ({ ...prev, image: uploadedFilePath }));
            alert('Image uploaded successfully!');
        } catch (err) {
            console.error("Error uploading image:", err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Kiểm tra dữ liệu bắt buộc
        if (!formData.name) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            await CategoryService.addCategory(formData);
            alert('Category added successfully!');
            navigate('/category/list-category'); // Điều hướng về danh sách Category
        } catch (err) {
            console.error("Error adding category:", err);
            setError('Failed to add category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/category/list-category');
    };

    return (
        <div className="add-category-form-container">
            <Form onSubmit={handleSubmit}>
                <h2>Add Category</h2>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Name <span style={{ color: 'red' }}>*</span></Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter category name"
                    />
                </Form.Group>

                <Form.Group controlId="formDescription" className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                    />
                </Form.Group>

                <Form.Group controlId="formImage" className="mb-3">
                    <Form.Label>Image</Form.Label>
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
                        <img src={imagePreview} alt="Category Preview" className="mt-3" width="100" height="100" />
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

export default AddCategory;
