import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InstructorService from '../../services/instructorService';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { FaSave, FaTimesCircle } from 'react-icons/fa';
import { uploadInstructorPhoto } from '../../services/fileService'; // Import phương thức upload
import '../../styles/EditInstructorForm.css';

const EditInstructorForm = ({ onSubmit, onCancel }) => {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    address: '',
    phone: '',
    bio: '',
    photo: '', // Default empty
    title: '',
    workplace: '',
    status: '',
    accountId: null, // If needed
  });

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const instructor = await InstructorService.fetchInstructorById(instructorId);
        setFormData({
          ...instructor,
        });
        setImageUrl(instructor.photo ? `http://localhost:8080/uploads/${instructor.photo}` : '/virtualcourse/images/default-profile.png'); // Đảm bảo đường dẫn default image đúng
        setLoading(false);
      } catch (error) {
        console.error('Error fetching instructor:', error);
        setLoading(false);
        alert('Failed to load instructor data. Please try again later.');
      }
    };
    fetchInstructor();
  }, [instructorId]);

  if (loading) return <CircularProgress />;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert('Please choose a file to upload.');
      return;
    }

    try {
      const uploadedFileName = await uploadInstructorPhoto(file); // e.g., "instructor/instructor9.jpg"
      setImageUrl(`http://localhost:8080/uploads/${uploadedFileName}`); // Đúng đường dẫn
      setFormData((prevData) => ({ ...prevData, photo: uploadedFileName }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await InstructorService.editInstructor(instructorId, formData);
      alert('Instructor updated successfully');
      if (onSubmit) onSubmit();
      navigate('/instructor/list-instructor');
    } catch (error) {
      console.error('Failed to update instructor:', error);
      alert('Failed to update instructor. Please try again.');
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(-1);
  };

  return (
    <form className="edit-instructor-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Edit Instructor</h2>
      {/* Input fields */}
      <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth margin="normal" required />
      <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth margin="normal" required />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Gender</InputLabel>
        <Select name="gender" value={formData.gender} onChange={handleChange}>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>
      <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Bio" name="bio" value={formData.bio} onChange={handleChange} fullWidth multiline rows={4} margin="normal" />
      <TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Workplace" name="workplace" value={formData.workplace} onChange={handleChange} fullWidth margin="normal" />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Status</InputLabel>
        <Select name="status" value={formData.status} onChange={handleChange}>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      {/* Image Upload */}
      <div className="file-upload">
        <label>Upload Photo</label>
        <input type="file" name="photo" onChange={handleFileChange} />
        <Button onClick={handleUpload} variant="outlined" color="primary">Upload Photo</Button>
        {imageUrl && <img src={imageUrl} alt="Instructor" width="100" />}
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="form-buttons">
        <Button type="submit" variant="contained" color="primary" startIcon={<FaSave />}>Save</Button>
        <Button type="button" variant="outlined" color="secondary" startIcon={<FaTimesCircle />} onClick={handleCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default EditInstructorForm;
