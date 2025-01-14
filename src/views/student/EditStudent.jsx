// src/views/student/EditStudent.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentService from '../../services/studentService';
import { uploadPhoto } from '../../services/fileService';
import { NotificationContext } from '../../contexts/NotificationContext';

import {
  Box,
  CircularProgress,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert
} from '@mui/material';
import { FaSave, FaTimesCircle } from 'react-icons/fa';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // formData sẽ chỉ lưu "filename.png" cho avatar
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    gender: '',
    phone: '',
    bio: '',
    avatar: '', // chỉ filename
    categoryPrefer: '',
    statusStudent: 'ACTIVE',
    verifiedPhone: false
  });

  // Preview hiển thị
  const [imagePreview, setImagePreview] = useState('');

  // Helper cắt prefix
  const extractFileName = (fullUrl) => {
    // fullUrl = "http://localhost:8080/uploads/student/xxx.png"
    if (!fullUrl || !fullUrl.includes('/')) return fullUrl || '';
    const idx = fullUrl.lastIndexOf('/');
    return fullUrl.substring(idx + 1); // => "xxx.png"
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const student = await StudentService.fetchStudentById(id);
        /*
         student.avatar = "http://localhost:8080/uploads/student/xxx.png"
         => cắt prefix => "xxx.png"
        */
        const filename = student.avatar ? extractFileName(student.avatar) : '';

        setFormData({
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          dob: student.dob ? student.dob.substring(0, 10) : '',
          address: student.address || '',
          gender: student.gender || '',
          phone: student.phone || '',
          bio: student.bio || '',
          avatar: filename, // CHỈ filename
          categoryPrefer: student.categoryPrefer || '',
          statusStudent: student.statusStudent || 'ACTIVE',
          verifiedPhone: !!student.verifiedPhone
        });

        // Xử lý preview full URL (nếu có)
        if (student.avatar) {
          setImagePreview(student.avatar); 
          // => "http://localhost:8080/uploads/student/xxx.png"
        } else {
          setImagePreview('https://via.placeholder.com/150');
        }
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Failed to load student data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  // Xử lý form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Chọn file => preview local
  const handleFileChange = (e) => {
    const chosenFile = e.target.files[0];
    if (chosenFile) {
      setFile(chosenFile);
      setImagePreview(URL.createObjectURL(chosenFile));
    }
  };
  const [file, setFile] = useState(null);

  // Upload file => server
  const handleUpload = async () => {
    if (!file) {
      alert('Please choose a file to upload.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const uploadedFileName = await uploadPhoto(file, 'student');
      // => e.g. "1735801864566_Picture6.png"
      // Gán vào formData.avatar
      setFormData(prev => ({
        ...prev,
        avatar: uploadedFileName // CHỈ filename
      }));
      alert('Avatar uploaded successfully!');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload avatar.');
    } finally {
      setUploading(false);
    }
  };

  // Submit => PUT /api/students/:id
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.gender) {
      setError('Please fill required fields: firstName, lastName, gender');
      setLoading(false);
      return;
    }

    try {
      // Gửi formData (avatar = "xxx.png") => backend
      const updated = await StudentService.editStudent(id, formData);

      // Thêm notify
      addNotification(
        `Successfully updated student (${updated.firstName} ${updated.lastName})`,
        'success'
      );

      alert('Student updated successfully');
      navigate('/dashboard/student/list-student');
    } catch (err) {
      console.error('Error updating student:', err);
      setError('Failed to update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel
  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography>Loading student...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" mb={2}>Edit Student</Typography>
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

        {/* Date of Birth */}
        <TextField
          label="Date of Birth *"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
        />

        {/* Address */}
        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
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
          rows={3}
        />

        {/* Preferred Categories */}
        <TextField
          label="Preferred Categories"
          name="categoryPrefer"
          value={formData.categoryPrefer}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Status */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Status *</InputLabel>
          <Select
            name="statusStudent"
            value={formData.statusStudent}
            onChange={handleChange}
            label="Status *"
          >
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* Verified Phone */}
        <FormControlLabel
          control={
            <Checkbox
              name="verifiedPhone"
              checked={formData.verifiedPhone}
              onChange={handleChange}
            />
          }
          label="Verified Phone"
          sx={{ mt: 1 }}
        />

        {/* Upload Avatar */}
        <Box mt={2} mb={2}>
          <Button variant="contained" component="label">
            Select Avatar
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
                alt="Student Preview"
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

export default EditStudent;
