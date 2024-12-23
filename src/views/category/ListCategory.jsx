// src/views/category/ListCategory.jsx

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Spinner, Alert, Dropdown } from 'react-bootstrap';
import CategoryService from '../../services/categoryService';
import AddCategoryModal from './AddCategory';
import { useNavigate } from 'react-router-dom';

import '../../styles/table.css'; // Import CSS tùy chỉnh

const ListCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        description: true,
        image: true,
        status: true,
        actions: true,
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await CategoryService.fetchCategories();
            setCategories(data);
        } catch (error) {
            setNotification({ message: 'Failed to load categories.', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = () => setShowAddModal(true);
    const handleCloseAddModal = () => setShowAddModal(false);

    const handleEditCategory = (category) => {
        navigate(`/category/edit-category/${category.id}`);
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await CategoryService.deleteCategory(id);
                setCategories(categories.filter((cat) => cat.id !== id));
                setNotification({ message: 'Category deleted successfully!', type: 'success' });
            } catch (error) {
                setNotification({ message: 'Failed to delete category.', type: 'danger' });
            }
        }
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
            <div className="text-center">
                <Spinner animation="border" />
                <p>Loading categories...</p>
            </div>
        );
    }

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <Card.Title as="h5">Category List</Card.Title>
                        <Button variant="success" onClick={handleAddCategory}>
                            Add Category
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        {notification && <Alert variant={notification.type}>{notification.message}</Alert>}

                        <div className="filters mb-3 d-flex gap-3">
                            <select
                                className="form-select"
                                onChange={(e) => setStatusFilter(e.target.value)}
                                value={statusFilter}
                            >
                                <option value="">All Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Name"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            />
                        </div>

                        <Table responsive striped bordered hover>
                            <thead>
                                <tr>
                                    {visibleColumns.name && <th>Name</th>}
                                    {visibleColumns.description && <th>Description</th>}
                                    {visibleColumns.image && <th>Image</th>}
                                    {visibleColumns.status && <th>Status</th>}
                                    {visibleColumns.actions && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((category) => (
                                        <tr key={category.id}>
                                            {visibleColumns.name && <td>{category.name}</td>}
                                            {visibleColumns.description && <td>{category.description || 'N/A'}</td>}
                                            {visibleColumns.image && (
                                                <td>
                                                {category.image ? (
                                                  <img
                                                  src={`http://localhost:8080/uploads/category/${category.image}`}
                                                  alt={category.name}
                                                  width="50"
                                                />
                                                
                                                ) : (
                                                  <img
                                                    src="/virtualcourse/images/default-image.png"
                                                    alt="Default"
                                                    width="50"
                                                  />
                                                )}
                                              </td>
                                            )}
                                            {visibleColumns.status && (
                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            category.status === 'ACTIVE'
                                                                ? 'bg-success'
                                                                : 'bg-danger'
                                                        }`}
                                                    >
                                                        {category.status}
                                                    </span>
                                                </td>
                                            )}
                                            {visibleColumns.actions && (
                                                <td>
                                                    <Button
                                                        variant="warning"
                                                        onClick={() => handleEditCategory(category)}
                                                        className="me-2"
                                                        size="sm"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                        size="sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No categories found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>

            <AddCategoryModal
                show={showAddModal}
                handleClose={handleCloseAddModal}
                setCategories={setCategories}
                setNotification={setNotification}
            />
        </Row>
    );
};

export default ListCategory;
