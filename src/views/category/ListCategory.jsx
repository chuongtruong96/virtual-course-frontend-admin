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
      const data = await CategoryService.fetchAllWithStats();
      console.log("Categories with stats:", data); // Debug log
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
        // Handle the new structure where category data is nested
        const aValue = sortConfig.key === 'name' || sortConfig.key === 'description' 
          ? a.category[sortConfig.key] 
          : a[sortConfig.key];
        const bValue = sortConfig.key === 'name' || sortConfig.key === 'description'
          ? b.category[sortConfig.key]
          : b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedItems;
  }, [categories, sortConfig]);

  const filteredCategories = sortedCategories.filter(categoryWithStats =>
    categoryWithStats.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoryWithStats.category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      const categoryId = selectedCategory.category.id;
      console.log("Deleting category with ID:", categoryId); // Debug log
      await CategoryService.deleteCategory(categoryId);
      setCategories(categories.filter(cat => cat.category.id !== categoryId));
      addNotification('Category deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      addNotification('Failed to delete category', 'danger');
    }
  };

  const confirmDelete = (category) => {
    console.log("Selected category for deletion:", category); // Debug log
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  // In ListCategory.jsx
const handleEditCategory = (categoryWithStats) => {
  if (!categoryWithStats || !categoryWithStats.category || !categoryWithStats.category.id) {
    console.error("Invalid category data:", categoryWithStats);
    addNotification('Cannot edit category: Invalid data', 'danger');
    return;
  }
  
  const categoryId = categoryWithStats.category.id;
  console.log("Navigating to edit category with ID:", categoryId); // Debug log
  navigate(`/dashboard/category/edit-category/${categoryId}`);
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
      {filteredCategories.map(categoryWithStats => (
        <Col key={categoryWithStats.category.id} xs={12} md={6} lg={4}>
          <Card className="h-100 shadow-sm hover-shadow">
            <div className="position-relative">
              <Card.Img
                variant="top"
                src={categoryWithStats.category.image ? categoryWithStats.category.image : '/virtualcourse/images/default-category.png'}
                alt={categoryWithStats.category.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 end-0 p-2">
                <Badge bg="primary" className="me-2">
                  <Book size={14} className="me-1" />
                  {categoryWithStats.courseCount} Courses
                </Badge>
              </div>
            </div>
            <Card.Body>
              <Card.Title>{categoryWithStats.category.name}</Card.Title>
              <Card.Text className="text-muted">
                {categoryWithStats.category.description || 'No description available'}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="bg-transparent border-top-0">
              <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit Category</Tooltip>}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditCategory(categoryWithStats)}
                    >
                      <Edit2 size={16} />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Delete Category</Tooltip>}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => confirmDelete(categoryWithStats)}
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
        {filteredCategories.map(categoryWithStats => (
          <tr key={categoryWithStats.category.id}>
            <td>{categoryWithStats.category.name}</td>
            <td>{categoryWithStats.category.description || 'No description'}</td>
            <td>
              <Image
                src={categoryWithStats.category.image ? categoryWithStats.category.image : '/virtualcourse/images/default-category.png'}
                alt={categoryWithStats.category.name}
                width={50}
                height={50}
                rounded
              />
            </td>
            <td>
              <Badge bg="primary">
                <Book size={14} className="me-1" />
                {categoryWithStats.courseCount}
              </Badge>
            </td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => handleEditCategory(categoryWithStats)}
              >
                <Edit2 size={16} />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => confirmDelete(categoryWithStats)}
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
          Are you sure you want to delete the category "{selectedCategory?.category.name}"?
          {selectedCategory?.courseCount > 0 && (
            <Alert variant="warning" className="mt-3">
              <AlertTriangle size={16} className="me-2" />
              This category has {selectedCategory.courseCount} associated courses.
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