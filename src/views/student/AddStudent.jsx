// src/views/student/AddStudent.jsx

import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentService from '../../services/studentService';
import { uploadPhoto } from '../../services/fileService';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
// import '../../styles/AddStudentForm.css';
import { NotificationContext } from '../../contexts/NotificationContext';

const AddStudent = () => {
    const { accountId } = useParams(); // Lấy accountId từ URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');
  const { addNotification } = useContext(NotificationContext);

    // Sử dụng react-hook-form
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);

        try {
            // Kiểm tra nếu đã upload hình ảnh
            let avatar = uploadedFileName;
            if (file && !uploadedFileName) {
                // Nếu người dùng đã chọn file nhưng chưa upload, yêu cầu upload
                alert('Please upload the avatar before submitting the form.');
                setLoading(false);
                return;
            }

            // Tạo một bản sao của dữ liệu để gửi, không bao gồm các trường không cần thiết
            const studentData = {
                firstName: data.firstName,
                lastName: data.lastName,
                dob: data.dob,
                address: data.address,
                gender: data.gender,
                phone: data.phone,
                bio: data.bio,
                avatar: avatar, // Sử dụng tên file đã upload
                categoryPrefer: data.categoryPrefer,
                statusStudent: data.statusStudent,
                verifiedPhone: data.verifiedPhone,
                accountId: parseInt(accountId, 10) // Thêm accountId vào data nếu cần
            };

            await StudentService.addStudent(accountId, studentData);
            addNotification('Successfully added student.', 'success');

            alert('Student added successfully!');
            navigate('/dashboard/student/list-student'); // Điều hướng về danh sách Student
        } catch (err) {
            console.error("Error adding student:", err);
            // Kiểm tra lỗi từ backend và hiển thị thông báo phù hợp
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('Failed to add student. Please try again.');
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
            const uploadedFilePath = await uploadPhoto(file, 'student');
            setUploadedFileName(uploadedFilePath); // Lưu tên file đã upload
            setValue('avatar', uploadedFilePath); // Cập nhật giá trị 'avatar' trong form
            setImagePreview(`http://localhost:8080/uploads/student/${uploadedFilePath}`);
            alert('Avatar uploaded successfully!');
        } catch (err) {
            console.error("Error uploading avatar:", err);
            setError('Failed to upload avatar. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
      navigate(-1); // Quay lại trang trước
    };
    return (
        <div className="add-student-form-container">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <h2>Add Student</h2>
                {error && <Alert variant="danger">{error}</Alert>}

                {/* First Name */}
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

                {/* Last Name */}
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

                {/* Date of Birth */}
                <Form.Group controlId="formDob" className="mb-3">
                    <Form.Label>Date of Birth <span style={{color: 'red'}}>*</span></Form.Label>
                    <Form.Control
                        type="date"
                        {...register('dob', { required: true })}
                        isInvalid={errors.dob}
                    />
                    <Form.Control.Feedback type="invalid">
                        Date of Birth is required.
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Address */}
                <Form.Group controlId="formAddress" className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter address"
                        {...register('address')}
                    />
                </Form.Group>

                {/* Gender */}
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

                {/* Phone */}
                <Form.Group controlId="formPhone" className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                        {...register('phone')}
                    />
                </Form.Group>

                {/* Bio */}
                <Form.Group controlId="formBio" className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter bio"
                        {...register('bio')}
                    />
                </Form.Group>

                {/* Preferred Categories */}
                <Form.Group controlId="formCategoryPrefer" className="mb-3">
                    <Form.Label>Preferred Categories</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter preferred categories"
                        {...register('categoryPrefer')}
                    />
                </Form.Group>

                {/* Status */}
                <Form.Group controlId="formStatusStudent" className="mb-3">
                    <Form.Label>Status <span style={{color: 'red'}}>*</span></Form.Label>
                    <Form.Control
                        as="select"
                        {...register('statusStudent', { required: true })}
                        isInvalid={errors.statusStudent}
                    >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        Status is required.
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Verified Phone */}
                <Form.Group controlId="formVerifiedPhone" className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Verified Phone"
                        {...register('verifiedPhone')}
                    />
                </Form.Group>

                {/* Upload Avatar */}
                <Form.Group controlId="formAvatar" className="mb-3">
                    <Form.Label>Avatar</Form.Label>
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
                        <img src={imagePreview} alt="Student Preview" className="mt-3" width="100" height="100" />
                    )}
                </Form.Group>

                {/* Các trường khác nếu cần */}

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
  }
    export default AddStudent;
