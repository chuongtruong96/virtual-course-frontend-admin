// src/views/instructor/AddInstructorModal.jsx

import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Image } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import accountService from '../../services/accountService'; // Import AccountService
import { NotificationContext } from '../../contexts/NotificationContext';
import { FaSave, FaTimes } from 'react-icons/fa';
import FileService from '../../services/fileService';

const AddInstructorModal = ({ show, handleClose, accountId }) => {
    const { addNotification } = useContext(NotificationContext);
    const queryClient = useQueryClient();

    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        address: '',
        phone: '',
        bio: '',
        photo: '',
        title: '',
        workplace: '',
        status: 'ACTIVE',
    });

    // Handle file changes
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setImagePreview(URL.createObjectURL(selected));
            setUploadedFileName(''); // Reset to allow uploading a new file
        }
    };

    // Handle photo upload
    const handleUpload = async () => {
        if (!file) {
            addNotification('Vui lòng chọn ảnh để tải lên.', 'warning');
            return;
        }
        setError(null);
        try {
            const uploadedFileName = await FileService.uploadPhoto({
                file,
                entity: 'instructor',
            });
            setUploadedFileName(uploadedFileName);
            setFormData((prev) => ({ ...prev, photo: uploadedFileName }));
            setImagePreview(`http://localhost:8080/uploads/instructor/${uploadedFileName}`);
            addNotification('Ảnh đã được tải lên thành công!', 'success');
        } catch (err) {
            console.error('Error uploading photo:', err);
            setError('Không thể tải lên ảnh. Vui lòng thử lại.');
            addNotification('Không thể tải lên ảnh. Vui lòng thử lại.', 'danger');
        }
    };

    // Define the mutation using the new service method
    const addInstructorMutation = useMutation({
        mutationFn: (instructorData) => accountService.addInstructorToAccount(accountId, instructorData),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['instructors']);
            addNotification('Instructor đã được thêm thành công!', 'success');
            resetForm();
            handleClose();
        },
        onError: (error) => {
            console.error('Error adding instructor:', error);
            setError('Không thể thêm Instructor. Vui lòng thử lại.');
            addNotification('Không thể thêm Instructor. Vui lòng thử lại.', 'danger');
        },
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        // Validation: Ensure required fields are filled
        if (!formData.firstName || !formData.lastName) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc.');
            addNotification('Vui lòng điền đầy đủ các trường bắt buộc.', 'warning');
            return;
        }

        // Prepare data to send (exclude accountId as it's in the URL)
        const { firstName, lastName, gender, address, phone, bio, photo, title, workplace, status } = formData;
        const dataToSend = {
            firstName,
            lastName,
            gender,
            address,
            phone,
            bio,
            photo,
            title,
            workplace,
            status,
        };

        addInstructorMutation.mutate(dataToSend);
    };

    // Reset form when modal closes or after successful submission
    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            gender: '',
            address: '',
            phone: '',
            bio: '',
            photo: '',
            title: '',
            workplace: '',
            status: 'ACTIVE',
        });
        setError(null);
        setFile(null);
        setImagePreview('');
        setUploadedFileName('');
    };

    // Handle modal close
    const handleModalCloseInternal = () => {
        if (!addInstructorMutation.isLoading) {
            resetForm();
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleModalCloseInternal} backdrop="static" keyboard={!addInstructorMutation.isLoading}>
            <Modal.Header closeButton={!addInstructorMutation.isLoading}>
                <Modal.Title>Add Instructor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit} aria-label="Add Instructor Form">
                    {/* First Name */}
                    <Form.Group controlId="formFirstName" className="mb-3">
                        <Form.Label>
                            First Name <span style={{ color: 'red' }}>*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                            placeholder="Enter firstname"
                        />
                    </Form.Group>

                    {/* Last Name */}
                    <Form.Group controlId="formLastName" className="mb-3">
                        <Form.Label>
                            Last Name <span style={{ color: 'red' }}>*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                            placeholder="Enter lastname"
                        />
                    </Form.Group>

                    {/* Gender */}
                    <Form.Group controlId="formGender" className="mb-3">
                        <Form.Label>
                            Gender <span style={{ color: 'red' }}>*</span>
                        </Form.Label>
                        <Form.Control
                            as="select"
                            name="gender"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            required
                            aria-label="Choose Gender"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </Form.Control>
                    </Form.Group>

                    {/* Status */}
                    <Form.Group controlId="formStatus" className="mb-3">
                        <Form.Label>
                            Status <span style={{ color: 'red' }}>*</span>
                        </Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            required
                            aria-label="Choose status"
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </Form.Control>
                    </Form.Group>

                    {/* Address */}
                    <Form.Group controlId="formAddress" className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Enter address"
                        />
                    </Form.Group>

                    {/* Phone */}
                    <Form.Group controlId="formPhone" className="mb-3">
                        <Form.Label>Phone number</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter phone number"
                        />
                    </Form.Group>

                    {/* Bio */}
                    <Form.Group controlId="formBio" className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Enter bio"
                        />
                    </Form.Group>

                    {/* Title */}
                    <Form.Group controlId="formTitle" className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter title"
                        />
                    </Form.Group>

                    {/* Workplace */}
                    <Form.Group controlId="formWorkplace" className="mb-3">
                        <Form.Label>Workplace</Form.Label>
                        <Form.Control
                            type="text"
                            name="workplace"
                            value={formData.workplace}
                            onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                            placeholder="Enter workplace"
                        />
                    </Form.Group>

                    {/* Photo */}
                    <Form.Group controlId="formPhoto" className="mb-3">
                        <Form.Label>Ảnh Đại Diện</Form.Label>
                        <div className="d-flex align-items-center">
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                aria-label="Chọn Ảnh Đại Diện"
                            />
                            <Button
                                variant="outline-secondary"
                                className="ms-2"
                                onClick={handleUpload}
                                disabled={!file || uploadedFileName !== ''}
                                aria-label="Tải Lên Ảnh"
                            >
                                {uploadedFileName ? 'Đã Tải Lên' : 'Tải Lên'}
                            </Button>
                        </div>
                        {imagePreview && (
                            <Image src={imagePreview} alt="Instructor Preview" className="mt-3" width="100" height="100" rounded />
                        )}
                    </Form.Group>

                    {/* Submit & Cancel */}
                    <div className="d-flex justify-content-between">
                        <Button
                            variant="secondary"
                            onClick={handleModalCloseInternal}
                            disabled={addInstructorMutation.isLoading}
                            aria-label="Hủy"
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={addInstructorMutation.isLoading}
                            aria-label="Lưu"
                        >
                            {addInstructorMutation.isLoading ? (
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            ) : (
                                <>
                                    <FaSave /> Lưu
                                </>
                            )}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );

};

export default AddInstructorModal;
