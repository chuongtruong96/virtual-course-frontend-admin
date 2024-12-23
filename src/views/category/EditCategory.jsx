// src/views/category/EditCategory.jsx

import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import CategoryService from '../../services/categoryService';
import { uploadPhoto } from '../../services/fileService'; // fileService.uploadPhoto
import { useParams, useNavigate } from 'react-router-dom';

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Trạng thái
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Lưu dữ liệu Category & hình
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '', // chỉ chứa tên file, ví dụ '1734854100323_Picture5.png'
  });

  // Dùng để hiển thị preview trên giao diện
  const [imagePreview, setImagePreview] = useState('');
  const [file, setFile] = useState(null);

  // Fetch data khi load trang
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await CategoryService.fetchCategoryById(categoryId);
        // Giả sử category.image = '1734854100323_Picture5.png'
        setFormData({
          name: category.name,
          description: category.description || '',
          image: category.image || '',
        });

        // Nếu DB đã có ảnh, hiển thị preview
        if (category.image) {
          // Giả sử ta muốn hiển thị ảnh từ server
          setImagePreview(`http://localhost:8080/uploads/category/${category.image}`);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError('Failed to load category data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [categoryId]);

  // Cập nhật form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Khi chọn file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Hiển thị preview tạm (local) trước khi upload
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  // Upload file lên server
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      // Trả về tên file, ví dụ: '1734854100323_Picture5.png'
      const uploadedFileName = await uploadPhoto(file, 'category');
      // Lưu lại tên file vào formData
      setFormData(prev => ({ ...prev, image: uploadedFileName }));
      // Cập nhật luôn preview từ server (nếu muốn hiển thị file đã upload)
      setImagePreview(`http://localhost:8080/uploads/category/${uploadedFileName}`);

      alert('Image uploaded successfully!');
    } catch (err) {
      console.error("Error uploading image:", err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Submit form để cập nhật category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      // Gửi tên file mới (hoặc cũ) kèm name, description
      await CategoryService.editCategory(categoryId, formData);
      alert('Category updated successfully!');
      navigate('/category/list-category');
    } catch (err) {
      console.error("Error updating category:", err);
      setError('Failed to update category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/category/list-category');
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading category data...</p>
      </div>
    );
  }

  return (
    <div className="edit-category-form-container">
      <Form onSubmit={handleSubmit}>
        <h2>Edit Category</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Tên Category */}
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>
            Name <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter category name"
          />
        </Form.Group>

        {/* Mô tả */}
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

        {/* Ảnh */}
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
              {uploading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                'Upload'
              )}
            </Button>
          </div>
          
          {/* Preview ảnh (đã có sẵn hoặc mới upload) */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Category Preview"
              className="mt-3"
              width="100"
              height="100"
            />
          )}
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditCategory;
