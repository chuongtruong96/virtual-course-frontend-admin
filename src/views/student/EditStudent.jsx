// src/views/instructor/EditInstructorForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InstructorService from '../../services/instructorService';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { FaSave, FaTimesCircle } from 'react-icons/fa';
import { uploadPhoto } from '../../services/fileService'; // Import phương thức upload chung
import '../../styles/EditInstructorForm.css';

const EditInstructorForm = ({ onSubmit, onCancel }) => {
  const { id } = useParams(); // Đã đổi từ instructorId sang id để đồng nhất với route
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    address: '',
    phone: '',
    bio: '',
    photo: '', // Mặc định trống
    title: '',
    workplace: '',
    status: '',
    accountId: null, // Nếu cần
  });

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const instructor = await InstructorService.fetchInstructorById(id);
        setFormData({
          firstName: instructor.firstName || '',
          lastName: instructor.lastName || '',
          gender: instructor.gender || '',
          address: instructor.address || '',
          phone: instructor.phone || '',
          bio: instructor.bio || '',
          photo: instructor.photo || '',
          title: instructor.title || '',
          workplace: instructor.workplace || '',
          status: instructor.status || '',
          accountId: instructor.accountId || null,
        });
        setImageUrl(instructor.photo ? `http://localhost:8080/uploads/${instructor.photo}` : '/virtualcourse/images/default-profile.png'); // Đảm bảo đường dẫn default image đúng
        setLoading(false);
      } catch (error) {
        console.error('Error fetching instructor:', error);
        setLoading(false);
        setError('Failed to load instructor data. Please try again later.');
      }
    };
    fetchInstructor();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert('Please choose a file to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const uploadedFileName = await uploadPhoto(file, 'instructor'); // Sử dụng uploadPhoto với entity là 'instructor'
      setImageUrl(`http://localhost:8080/uploads/${uploadedFileName}`); // Đúng đường dẫn
      setFormData((prevData) => ({ ...prevData, photo: uploadedFileName }));
      alert('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await InstructorService.editInstructor(id, formData);
      alert('Instructor updated successfully');
      if (onSubmit) onSubmit();
      navigate('/instructor/list'); // Đảm bảo rằng route này tồn tại
    } catch (error) {
      console.error('Failed to update instructor:', error);
      setError('Failed to update instructor. Please try again.');
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(-1);
  };

  if (loading) return <CircularProgress />;

  return (
    <form className="edit-instructor-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Edit Instructor</h2>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Các trường nhập liệu */}
      <TextField
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Gender</InputLabel>
        <Select name="gender" value={formData.gender} onChange={handleChange}>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />
      <TextField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Workplace"
        name="workplace"
        value={formData.workplace}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Status</InputLabel>
        <Select name="status" value={formData.status} onChange={handleChange}>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      {/* Upload ảnh */}
      <div className="file-upload" style={{ marginTop: '16px' }}>
        <label>Upload Photo</label>
        <input
          type="file"
          name="photo"
          onChange={handleFileChange}
          style={{ display: 'block', marginBottom: '8px' }}
        />
        <Button
          onClick={handleUpload}
          variant="outlined"
          color="primary"
          disabled={uploading || !file}
        >
          {uploading ? <CircularProgress size={24} /> : 'Upload Photo'}
        </Button>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Instructor"
            width="100"
            style={{ marginTop: '10px' }}
          />
        )}
      </div>

      {/* Nút Submit và Cancel */}
      <div className="form-buttons" style={{ marginTop: '24px' }}>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          startIcon={<FaTimesCircle />}
          onClick={handleCancel}
          style={{ marginRight: '16px' }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<FaSave />}
          disabled={loading}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default EditInstructorForm;
