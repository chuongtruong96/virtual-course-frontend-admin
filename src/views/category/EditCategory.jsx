import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Card, Alert, Spinner, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryService from '../../services/categoryService';
import FileService from '../../services/fileService';
import { NotificationContext } from '../../contexts/NotificationContext';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await CategoryService.fetchCategoryById({ id, signal: null });
        setFormData({
          name: category.name,
          description: category.description || '',
          image: category.image || '',
        });
        if (category.image) {
          setImagePreview(`http://localhost:8080/uploads/category/${category.image}`);
        }
      } catch (err) {
        console.error('Error fetching category:', err);
        const message = err.response?.data?.message || 'Failed to load category.';
        setError(message);
        addNotification(message, 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, addNotification]);

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
      addNotification('Please select a file to upload.', 'warning');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const uploadedFileName = await FileService.uploadPhoto({ file, entity: 'category', signal: null });
      setFormData((prev) => ({ ...prev, image: uploadedFileName }));
      setImagePreview(`http://localhost:8080/uploads/category/${uploadedFileName}`);
      addNotification('Image uploaded successfully!', 'success');
    } catch (err) {
      console.error('Error uploading image:', err);
      const message = err.response?.data?.message || 'Failed to upload image.';
      setError(message);
      addNotification(message, 'danger');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!formData.name) {
      const message = 'Please fill in all required fields.';
      setError(message);
      addNotification(message, 'warning');
      setSubmitting(false);
      return;
    }

    try {
      await CategoryService.editCategory({ id, data: formData, signal: null });
      addNotification('Category updated successfully!', 'success');
      navigate('/dashboard/category/list-category');
    } catch (err) {
      console.error('Error updating category:', err);
      const message = err.response?.data?.message || 'Failed to update category.';
      setError(message);
      addNotification(message, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/category/list-category');
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" aria-label="Loading">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading category data...</p>
      </div>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Edit Category</Card.Title>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} aria-label="Edit Category Form">
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>
              Name <span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-label="Category Name"
              placeholder="Enter category name"
            />
          </Form.Group>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              aria-label="Category Description"
              placeholder="Enter description"
            />
          </Form.Group>

          <Form.Group controlId="image" className="mb-3">
            <Form.Label>Image</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Category Image"
              />
              <Button
                variant="outline-secondary"
                className="ms-2"
                onClick={handleUpload}
                disabled={uploading || !file}
                aria-label="Upload Category Image"
              >
                {uploading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  'Upload'
                )}
              </Button>
            </div>
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Category Preview"
                thumbnail
                width={100}
                height={100}
                className="mt-3"
              />
            )}
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleCancel} disabled={submitting} aria-label="Cancel">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting} aria-label="Save Changes">
              {submitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{' '}
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditCategory;
