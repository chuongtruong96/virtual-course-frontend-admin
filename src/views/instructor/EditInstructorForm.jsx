// src/views/instructor/EditInstructorForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InstructorService from '../../services/instructorService';
import { uploadPhoto } from '../../services/fileService';

import {
  Box,
  CircularProgress,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert
} from '@mui/material';
import { FaSave, FaTimesCircle } from 'react-icons/fa';

const EditInstructorForm = () => {
  const { instructorId } = useParams();
  const navigate = useNavigate();

  // Trạng thái tải dữ liệu & lỗi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Dữ liệu Instructor
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
    status: '',
    accountId: null // Tùy backend có cần hay không
  });

  // File upload & preview
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Fetch instructor khi mount
  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const instructor = await InstructorService.fetchInstructorById(instructorId);
        // Gán formData từ instructor response
        setFormData({
          ...instructor
        });

        // Xử lý preview nếu đã có photo
        if (instructor.photo) {
          setImagePreview(`http://localhost:8080/uploads/instructor/${instructor.photo}`);
        } else {
          setImagePreview('https://via.placeholder.com/150'); // Ảnh mặc định
        }

      } catch (error) {
        console.error('Error fetching instructor:', error);
        setError('Failed to load instructor data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchInstructor();
  }, [instructorId]);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Khi chọn file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile)); // Preview local
    }
  };

  // Upload file mới lên server
  const handleUpload = async () => {
    if (!file) {
      alert('Please choose a file to upload.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      // Gọi API uploadPhoto cho entity='instructor'
      const uploadedFileName = await uploadPhoto(file, 'instructor');

      // Set photo thành tên file
      setFormData(prevData => ({ ...prevData, photo: uploadedFileName }));

      // Set imagePreview thành đường dẫn đầy đủ
      setImagePreview(`http://localhost:8080/uploads/instructor/${uploadedFileName}`);

      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  // Submit form => gọi editInstructor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Kiểm tra dữ liệu bắt buộc
    if (!formData.firstName || !formData.lastName || !formData.gender) {
      setError('Please fill required fields: firstName, lastName, gender');
      setLoading(false);
      return;
    }

    try {
      await InstructorService.editInstructor(instructorId, formData);
      alert('Instructor updated successfully');
      navigate('/instructor/list-instructor');
    } catch (error) {
      console.error('Failed to update instructor:', error);
      setError('Failed to update instructor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel => quay lại
  const handleCancel = () => {
    navigate('/instructor/list-instructor');
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography>Loading instructor...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" mb={2}>Edit Instructor</Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* First Name */}
        <TextField
          label="First Name *"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        {/* Last Name */}
        <TextField
          label="Last Name *"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        {/* Gender */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Gender *</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            label="Gender *"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        {/* Address */}
        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Phone */}
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Bio */}
        <TextField
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />

        {/* Title */}
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Workplace */}
        <TextField
          label="Workplace"
          name="workplace"
          value={formData.workplace}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Status */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Status *</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status *"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* Upload Photo */}
        <Box mt={2} mb={2}>
          <Button variant="contained" component="label">
            Select Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>

          {imagePreview && (
            <Box mt={1}>
              <img
                src={imagePreview}
                alt="Instructor Preview"
                width={100}
                height={100}
                style={{ objectFit: 'cover' }}
              />
            </Box>
          )}
        </Box>

        {/* Nút Save & Cancel */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<FaTimesCircle />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            startIcon={<FaSave />}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditInstructorForm;
