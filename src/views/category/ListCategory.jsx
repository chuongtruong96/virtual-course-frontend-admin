import React, { useState, useEffect, useContext } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Spinner, 
  Alert, 
  Form, 
  InputGroup,
  Badge,
  Image,
  Row,
  Col,
  Modal,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Book,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { NotificationContext } from '../../contexts/NotificationContext';
import CategoryService from '../../services/categoryService';
import { UPLOAD_PATH } from '../../config/endpoints';

const ListCategory = () => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.fetchAll();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
      addNotification('Failed to load categories', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCategories = React.useMemo(() => {
    let sortedItems = [...categories];
    if (sortConfig.key) {
      sortedItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedItems;
  }, [categories, sortConfig]);

  const filteredCategories = sortedCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      await CategoryService.deleteCategory(selectedCategory.id);
      setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
      addNotification('Category deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      addNotification('Failed to delete category', 'danger');
    }
  };

  const confirmDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading categories...</span>
        </Spinner>
        <p className="mt-3">Loading categories...</p>
      </div>
    );
  }

  const renderGridView = () => (
    <Row className="g-4">
      {filteredCategories.map(category => (
        <Col key={category.id} xs={12} md={6} lg={4}>
          <Card className="h-100 shadow-sm hover-shadow">
            <div className="position-relative">
              <Card.Img
                variant="top"
                src={category.image ? `${UPLOAD_PATH.CATEGORY}/${category.image}` : '/virtualcourse/images/default-category.png'}
                alt={category.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 end-0 p-2">
                <Badge bg="primary" className="me-2">
                  <Book size={14} className="me-1" />
                  {category.courses?.length || 0} Courses
                </Badge>
              </div>
            </div>
            <Card.Body>
              <Card.Title>{category.name}</Card.Title>
              <Card.Text className="text-muted">
                {category.description || 'No description available'}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="bg-transparent border-top-0">
              <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit Category</Tooltip>}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/dashboard/category/edit-category/${category.id}`)}
                    >
                      <Edit2 size={16} />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Delete Category</Tooltip>}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => confirmDelete(category)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </OverlayTrigger>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderTableView = () => (
    <Table responsive hover>
      <thead>
        <tr>
          <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
            Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </th>
          <th>Description</th>
          <th>Image</th>
          <th>Courses</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredCategories.map(category => (
          <tr key={category.id}>
            <td>{category.name}</td>
            <td>{category.description || 'No description'}</td>
            <td>
              <Image
                src={category.image ? `${UPLOAD_PATH.CATEGORY}/${category.image}` : '/virtualcourse/images/default-category.png'}
                alt={category.name}
                width={50}
                height={50}
                rounded
              />
            </td>
            <td>
              <Badge bg="primary">
                <Book size={14} className="me-1" />
                {category.courses?.length || 0}
              </Badge>
            </td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => navigate(`/dashboard/category/edit-category/${category.id}`)}
              >
                <Edit2 size={16} />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => confirmDelete(category)}
              >
                <Trash2 size={16} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0">Categories</Card.Title>
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard/category/add-category')}
          >
            <Plus size={16} className="me-1" />
            Add Category
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <div className="btn-group">
            <OverlayTrigger placement="top" overlay={<Tooltip>Grid View</Tooltip>}>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Table View</Tooltip>}>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
                onClick={() => setViewMode('table')}
              >
                <ImageIcon size={16} />
              </Button>
            </OverlayTrigger>
          </div>
        </div>

        {error ? (
          <Alert variant="danger">
            <AlertTriangle size={16} className="me-2" />
            {error}
          </Alert>
        ) : filteredCategories.length === 0 ? (
          <Alert variant="info">No categories found</Alert>
        ) : (
          viewMode === 'grid' ? renderGridView() : renderTableView()
        )}
      </Card.Body>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the category "{selectedCategory?.name}"?
          {selectedCategory?.courses?.length > 0 && (
            <Alert variant="warning" className="mt-3">
              <AlertTriangle size={16} className="me-2" />
              This category has {selectedCategory.courses.length} associated courses.
              Deleting it may affect these courses.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            <XCircle size={16} className="me-1" />
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <CheckCircle size={16} className="me-1" />
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ListCategory;