import React, { useState, useContext } from 'react';
import { 
  Form, 
  Button, 
  Card, 
  Alert, 
  Spinner, 
  Image,
  Row,
  Col 
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon,
  AlertTriangle 
} from 'lucide-react';
import { NotificationContext } from '../../contexts/NotificationContext';
import CategoryService from '../../services/categoryService';
import FileService from '../../services/fileService';

const AddCategory = () => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        addNotification('File size should not exceed 5MB', 'warning');
        return;
      }
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      addNotification('Please select a file to upload', 'warning');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const uploadedFilePath = await FileService.uploadPhoto({ 
        file, 
        entity: 'category'
      });
      setFormData(prev => ({ ...prev, image: uploadedFilePath }));
      addNotification('Image uploaded successfully', 'success');
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
      addNotification('Failed to upload image', 'danger');
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors).join(', '));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await CategoryService.addCategory(formData);
      addNotification('Category added successfully', 'success');
      navigate('/dashboard/category/list-category');
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err.response?.data?.message || 'Failed to add category');
      addNotification('Failed to add category', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Add New Category</Card.Title>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <AlertTriangle size={16} className="me-2" />
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={touched.name && !formData.name.trim()}
                  placeholder="Enter category name"
                />
                <Form.Control.Feedback type="invalid">
                  Name is required
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter category description"
                />
                <Form.Text className="text-muted">
                  {formData.description?.length || 0}/500 characters
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category Image</Form.Label>
                <div className="d-flex flex-column align-items-center p-3 border rounded">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Category Preview"
                      className="img-fluid mb-3"
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="text-center text-muted mb-3">
                      <ImageIcon size={64} />
                      <p className="mt-2">No image selected</p>
                    </div>
                  )}
                  
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-2"
                  />
                  
                  <Button
                    variant="outline-primary"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-100"
                  >
                    {uploading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="me-2" />
                        Upload Image
                      </>
                    )}
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/dashboard/category/list-category')}
              disabled={loading}
            >
              <X size={16} className="me-2" />
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="me-2" />
                  Save Category
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddCategory;