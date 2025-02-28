import React, { useState, useEffect, useContext } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { NotificationContext } from '../../contexts/NotificationContext';
import CategoryService from '../../services/categoryService';
import FileService from '../../services/fileService';
import { UPLOAD_PATH } from '../../config/endpoints';

const EditCategory = () => {
  const { id } = useParams();
  console.log("Category ID from URL params:", id); // Debug log

  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    if (!id) {
      console.error("No category ID provided");
      setError("No category ID provided");
      setLoading(false);
      return;
    }
    
    console.log("Fetching category with ID:", id); // Debug log
    try {
      // First try to fetch with stats
      const categoryWithStats = await CategoryService.fetchCategoryWithStatsById(id);
      console.log("Category with stats:", categoryWithStats); // Debug log
      setFormData({
        name: categoryWithStats.category.name,
        description: categoryWithStats.category.description || '',
        image: categoryWithStats.category.image || ''
      });
      if (categoryWithStats.category.image) {
        setImagePreview(categoryWithStats.category.image);
      }
    } catch (err) {
      console.error("Error fetching category with stats:", err);

      try {
        // Fallback to regular fetch if with-stats endpoint fails
        const category = await CategoryService.fetchCategoryById(id);
        console.log("Category (fallback):", category); // Debug log
        
        setFormData({
          name: category.name,
          description: category.description || '',
          image: category.image || ''
        });
        if (category.image) {
          setImagePreview(category.image);
        }
      } catch (fetchErr) {
        console.error('Error fetching category:', fetchErr);
        setError('Failed to load category');
        addNotification('Failed to load category', 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

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

    setSaving(true);
    setError(null);

    try {
      await CategoryService.editCategory(id, formData);
      addNotification('Category updated successfully', 'success');
      navigate('/dashboard/category/list-category');
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.response?.data?.message || 'Failed to update category');
      addNotification('Failed to update category', 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading category...</span>
        </Spinner>
        <p className="mt-3">Loading category details...</p>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="link"
        className="mb-3 ps-0"
        onClick={() => navigate('/dashboard/category/list-category')}
      >
        <ArrowLeft size={16} className="me-1" />
        Back to Categories
      </Button>

      <Card>
        <Card.Header>
          <Card.Title>Edit Category</Card.Title>
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
                disabled={saving}
              >
                <X size={16} className="me-2" />
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="me-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default EditCategory;