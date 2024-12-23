// src/views/student/AddStudent.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentService from '../../services/studentService'; // Sử dụng default import
import { uploadPhoto } from '../../services/fileService'; // Sử dụng uploadPhoto với tham số 'student'
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
// import '../../styles/AddStudentForm.css';

const AddStudent = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    gender: '',
    phone: '',
    bio: '',
    avatar: '',
    categoryPrefer: '',
    statusStudent: 'ACTIVE',
    verifiedPhone: false, // Giá trị mặc định

  });

  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const uploadedFilePath = await uploadPhoto(file, 'student'); // entity = 'student'
      setFormData((prev) => ({ ...prev, avatar: uploadedFilePath }));
      alert('Avatar uploaded successfully!');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Kiểm tra dữ liệu bắt buộc
    if (!formData.firstName || !formData.lastName || !formData.gender) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const newStudent = {
        ...formData,
        accountId: parseInt(accountId) // Đảm bảo accountId được gửi đúng cách
      };
      await StudentService.addStudent(newStudent); // Sử dụng StudentService.addStudent
      alert('Student added successfully!');
      navigate('/student/list-student'); // Điều hướng về danh sách Student
    } catch (err) {
      console.error('Error adding student:', err);
      setError('Failed to add student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Quay lại trang trước
  };

  return (
    <div className="add-student-form-container">
      <Form onSubmit={handleSubmit}>
        <h2>Add Student</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group controlId="formFirstName" className="mb-3">
          <Form.Label>
            First Name <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter first name"
          />
        </Form.Group>

        <Form.Group controlId="formLastName" className="mb-3">
          <Form.Label>
            Last Name <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Enter last name"
          />
        </Form.Group>

        <Form.Group controlId="formDob" className="mb-3">
          <Form.Label>
            Date of Birth <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        </Form.Group>

        <Form.Group controlId="formAddress" className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" />
        </Form.Group>

        <Form.Group controlId="formGender" className="mb-3">
          <Form.Label>
            Gender <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control as="select" name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formPhone" className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" />
        </Form.Group>

        <Form.Group controlId="formBio" className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control as="textarea" rows={3} name="bio" value={formData.bio} onChange={handleChange} placeholder="Enter bio" />
        </Form.Group>

        <Form.Group controlId="formAvatar" className="mb-3">
          <Form.Label>Avatar</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            <Button variant="outline-secondary" className="ms-2" onClick={handleUpload} disabled={uploading || !file}>
              {uploading ? <Spinner as="span" animation="border" size="sm" /> : 'Upload'}
            </Button>
          </div>
          {imagePreview && <img src={imagePreview} alt="Student Preview" className="mt-3" width="100" height="100" />}
        </Form.Group>

        <Form.Group controlId="formCategoryPrefer" className="mb-3">
          <Form.Label>Preferred Categories</Form.Label>
          <Form.Control
            type="text"
            name="categoryPrefer"
            value={formData.categoryPrefer}
            onChange={handleChange}
            placeholder="Enter preferred categories"
          />
        </Form.Group>

        <Form.Group controlId="formStatusStudent" className="mb-3">
          <Form.Label>
            Status <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control as="select" name="statusStudent" value={formData.statusStudent} onChange={handleChange} required>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </Form.Control>
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

export default AddStudent;
