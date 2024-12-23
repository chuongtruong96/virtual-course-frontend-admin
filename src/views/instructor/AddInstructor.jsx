// src/views/instructor/AddInstructor.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import instructorService from '../../services/instructorService';
import { uploadInstructorPhoto } from '../../services/fileService';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import '../../styles/EditInstructorForm.css';

const AddInstructor = () => {
    const { accountId } = useParams(); // Lấy accountId từ URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');

    // Sử dụng react-hook-form
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);

        try {
            // Kiểm tra nếu đã upload hình ảnh
            let photo = uploadedFileName;
            if (file && !uploadedFileName) {
                // Nếu người dùng đã chọn file nhưng chưa upload, yêu cầu upload
                alert('Please upload the photo before submitting the form.');
                setLoading(false);
                return;
            }

            // Tạo một bản sao của dữ liệu để gửi, không bao gồm các trường không cần thiết
            const instructorData = {
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                address: data.address,
                phone: data.phone,
                bio: data.bio,
                photo: photo, // Sử dụng tên file đã upload
                title: data.title,
                workplace: data.workplace,
                status: data.status,
                accountId: parseInt(accountId) // Thêm accountId vào data nếu cần
            };

            await instructorService.addInstructor(accountId, instructorData);
            alert('Instructor added successfully!');
            navigate('/virtualcourse/instructor/list-instructor'); // Điều hướng về danh sách Instructor
        } catch (err) {
            console.error("Error adding instructor:", err);
            // Kiểm tra lỗi từ backend và hiển thị thông báo phù hợp
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('Failed to add instructor. Please try again.');
            }
        } finally {
            setLoading(false);
        }
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

        setLoading(true);
        setError(null);
        try {
            const uploadedFilePath = await uploadPhoto(file , 'instructor');
            setUploadedFileName(uploadedFilePath); // Lưu tên file đã upload
            // Nếu cần, bạn có thể sử dụng setValue từ react-hook-form để cập nhật giá trị 'photo'
            setValue('photo', uploadedFilePath);
            alert('Photo uploaded successfully!');
        } catch (err) {
            console.error("Error uploading photo:", err);
            setError('Failed to upload photo. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-instructor-form-container">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <h2>Add Instructor</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form.Group controlId="formFirstName" className="mb-3">
                    <Form.Label>First Name <span style={{color: 'red'}}>*</span></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        {...register('firstName', { required: true })}
                        isInvalid={errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                        First name is required.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formLastName" className="mb-3">
                    <Form.Label>Last Name <span style={{color: 'red'}}>*</span></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        {...register('lastName', { required: true })}
                        isInvalid={errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                        Last name is required.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formGender" className="mb-3">
                    <Form.Label>Gender <span style={{color: 'red'}}>*</span></Form.Label>
                    <Form.Control
                        as="select"
                        {...register('gender', { required: true })}
                        isInvalid={errors.gender}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        Gender is required.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formStatus" className="mb-3">
                    <Form.Label>Status <span style={{color: 'red'}}>*</span></Form.Label>
                    <Form.Control
                        as="select"
                        {...register('status', { required: true })}
                        isInvalid={errors.status}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        Status is required.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formAddress" className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter address"
                        {...register('address')}
                    />
                </Form.Group>

                <Form.Group controlId="formPhone" className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        {...register('phone')}
                    />
                </Form.Group>

                <Form.Group controlId="formBio" className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter bio"
                        {...register('bio')}
                    />
                </Form.Group>

                <Form.Group controlId="formPhoto" className="mb-3">
                    <Form.Label>Photo</Form.Label>
                    <div className="d-flex align-items-center">
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <Button variant="outline-secondary" className="ms-2" onClick={handleUpload} disabled={loading || !file || uploadedFileName}>
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : uploadedFileName ? 'Uploaded' : 'Upload'}
                        </Button>
                    </div>
                    {imagePreview && (
                        <img src={imagePreview} alt="Instructor Preview" className="mt-3" width="100" height="100" />
                    )}
                </Form.Group>

                <Form.Group controlId="formTitle" className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        {...register('title')}
                    />
                </Form.Group>

                <Form.Group controlId="formWorkplace" className="mb-3">
                    <Form.Label>Workplace</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter workplace"
                        {...register('workplace')}
                    />
                </Form.Group>

                {/* Các trường khác nếu cần */}

                <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => navigate(-1)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Save'}
                    </Button>
                </div>
            </Form>
        </div>
    );

};

export default AddInstructor;
