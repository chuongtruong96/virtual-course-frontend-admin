// src/components/Account/AddAccountModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { addAccount, fetchRoles } from '../../services/accountService';
import { useNavigate } from 'react-router-dom';

const AddAccountModal = ({ show, handleClose }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        roles: [],
        enable: true,
        verifiedEmail: false,
        authenticationType: 'LOCAL',
        type: '',
        status: 'active',
    });

    useEffect(() => {
        const fetchRolesData = async () => {
            try {
                const rolesData = await fetchRoles();
                setRoles(rolesData);
            } catch (err) {
                console.error("Error fetching roles:", err);
                setError("Failed to fetch roles. Please try again.");
            }
        };
        if (show) {
            fetchRolesData();
        }
    }, [show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRolesChange = (e) => {
        const { options } = e.target;
        const selectedRoles = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                selectedRoles.push(options[i].value);
            }
        }
        setFormData(prev => ({ ...prev, roles: selectedRoles }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Kiểm tra dữ liệu bắt buộc
        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            const newAccount = await addAccount(formData);
            // Kiểm tra xem Roles có bao gồm Instructor hoặc Student không
            if (formData.roles.includes('INSTRUCTOR')) {
                alert('Account created successfully! Please add Instructor details.');
                handleClose(); // Đóng modal AddAccount
                navigate(`/instructor/add-instructor/${newAccount.id}`); // Chuyển hướng tới AddInstructor với accountId
            } else if (formData.roles.includes('STUDENT')) {
                alert('Account created successfully! Please add Student details.');
                handleClose(); // Đóng modal AddAccount
                navigate(`/student/add-student/${newAccount.id}`); // Chuyển hướng tới AddStudent với accountId
            } else {
                alert('Account created successfully!');
                handleClose(); // Đóng modal AddAccount
            }
        } catch (err) {
            console.error("Error adding account:", err);
            setError('Failed to add account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        if (!loading) {
            setFormData({
                username: '',
                email: '',
                password: '',
                roles: [],
                enable: true,
                verifiedEmail: false,
                authenticationType: 'LOCAL',
                type: '',
                status: 'active',
            });
            setError(null);
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleModalClose} backdrop="static" keyboard={!loading}>
            <Modal.Header closeButton={!loading}>
                <Modal.Title>Add Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUsername" className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmail" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formRoles" className="mb-3">
                        <Form.Label>Roles</Form.Label>
                        <Form.Control
                            as="select"
                            multiple
                            name="roles"
                            value={formData.roles}
                            onChange={handleRolesChange}
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.name}>{role.name}</option>
                            ))}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Hold down the Ctrl (windows) or Command (Mac) button to select multiple options.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formAuthenticationType" className="mb-3">
                        <Form.Label>Authentication Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="authenticationType"
                            value={formData.authenticationType}
                            onChange={handleChange}
                        >
                            <option value="LOCAL">Local</option>
                            <option value="GOOGLE">Google</option>
                            <option value="FACEBOOK">Facebook</option>
                            {/* Thêm các phương thức xác thực khác nếu cần */}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formType" className="mb-3">
                        <Form.Label>Type</Form.Label>
                        <Form.Control
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formStatus" className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Control>
                    </Form.Group>

                    {/* Các trường khác nếu cần */}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save'}
                </Button>
            </Modal.Footer>
        </Modal>
    );

};

export default AddAccountModal;
