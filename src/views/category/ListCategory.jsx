import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Spinner, Alert, Card, Row, Col, Form, Image } from 'react-bootstrap';
import CategoryService from '../../services/categoryService';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../../contexts/NotificationContext';
import { UPLOAD_PATH } from '../../config/endpoint';

const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await CategoryService.fetchAll({ signal: null });
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        const message = err.response?.data?.message || 'Failed to load categories.';
        setError(message);
        addNotification(message, 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addNotification]);

  const handleAddCategory = () => navigate('/dashboard/category/add-category');
  
  const handleEditCategory = (id) => navigate(`/dashboard/category/edit-category/${id}`);
  
  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await CategoryService.deleteCategory({ id, signal: null });
        setCategories(categories.filter((cat) => cat.id !== id));
        addNotification('Category deleted successfully!', 'success');
      } catch (err) {
        console.error('Error deleting category:', err);
        const message = err.response?.data?.message || 'Failed to delete category.';
        addNotification(message, 'danger');
      }
    }
  };

  const handleSort = (field, order) => {
    const sortedCategories = [...categories].sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setCategories(sortedCategories);
  };

  const filteredCategories = categories.filter((category) => {
    const matchesStatus = statusFilter ? category.status === statusFilter : true;
    const matchesName = categoryFilter
      ? category.name.toLowerCase().includes(categoryFilter.toLowerCase())
      : true;
    return matchesStatus && matchesName;
  });

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" aria-label="Loading Categories">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading categories...</p>
      </div>
    );
  }

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title as="h5">Category List</Card.Title>
            <Button onClick={handleAddCategory} variant="primary" aria-label="Add Category">
              Add Category
            </Button>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Filters */}
            <Form className="filters mb-3 d-flex gap-3" aria-label="Category Filters">
              <Form.Select
                onChange={(e) => setStatusFilter(e.target.value)}
                value={statusFilter}
                aria-label="Filter by Status"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Form.Select>

              <Form.Control
                type="text"
                placeholder="Search Name"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Search by Name"
              />
            </Form>

            {/* Sorting Controls */}
            <div className="sorting-controls mb-3 d-flex gap-2" aria-label="Sorting Controls">
              <Button variant="outline-primary" onClick={() => handleSort('name', 'asc')} aria-label="Sort Name A-Z">
                Sort Name A-Z
              </Button>
              <Button variant="outline-primary" onClick={() => handleSort('name', 'desc')} aria-label="Sort Name Z-A">
                Sort Name Z-A
              </Button>
              <Button variant="outline-primary" onClick={() => handleSort('description', 'asc')} aria-label="Sort Description A-Z">
                Sort Description A-Z
              </Button>
              <Button variant="outline-primary" onClick={() => handleSort('description', 'desc')} aria-label="Sort Description Z-A">
                Sort Description Z-A
              </Button>
            </div>

            {/* Table */}
            <Table responsive striped bordered hover aria-label="Category List Table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description || 'N/A'}</td>
                      <td>
                        {category.image ? (
                          <Image
                            src={`${UPLOAD_PATH.CATEGORY}/${category.image}`}
                            alt={category.name}
                            width={50}
                            height={50}
                            rounded
                          />
                        ) : (
                          <Image
                            src="/virtualcourse/images/default-image.png"
                            alt="Default"
                            width={50}
                            height={50}
                            rounded
                          />
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            category.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'
                          }`}
                        >
                          {category.status}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => handleEditCategory(category.id)}
                          className="me-2"
                          aria-label={`Edit category ${category.name}`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteCategory(category.id)}
                          aria-label={`Delete category ${category.name}`}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ListCategory;
