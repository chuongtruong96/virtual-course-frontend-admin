import React, { useContext, useState } from 'react';
import { 
    Table, Spinner, Alert, Button, Badge, Modal, Form, 
    Tabs, Tab, Pagination, InputGroup, FormControl, Dropdown,
    Card, Row, Col, ListGroup
} from 'react-bootstrap';
import { NotificationContext } from '../../contexts/NotificationContext';
import { AuthContext } from '../../contexts/AuthContext';
import useNotifications from '../../hooks/useNotifications';
import { format } from 'date-fns';

const NotificationList = () => {
    const { addNotification } = useContext(NotificationContext);
    const { auth } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('all');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [filterType, setFilterType] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

    // Ensure user is authenticated and has a valid id
    if (!auth?.user?.id) {
        return <Alert variant="warning">User not authenticated. Please log in.</Alert>;
    }

    const userId = auth.user.id;

    // Determine options based on active tab and filters
    const getOptions = () => {
        const options = {
            page,
            size,
            enablePagination: true
        };

        if (activeTab === 'unread') {
            options.unreadOnly = true;
        } else if (activeTab === 'recent') {
            options.recentOnly = true;
        }

        if (filterType) {
            options.type = filterType;
        }

        return options;
    };

    // Use the enhanced hook
    const {
        paginatedNotifications,
        unreadCount,
        statistics,
        isLoading,
        isError,
        error,
        markAsRead,
        markAllAsRead,
        markAllAsReadByType,
        deleteNotification,
        deleteAllRead,
        updateNotificationContent
    } = useNotifications(userId, getOptions());

    // Search notifications
    const { 
        paginatedNotifications: searchResults,
        isLoading: isSearchLoading
    } = useNotifications(userId, {
        searchTerm,
        page,
        size,
        enablePagination: true
    });

    // Date range search
    const { 
        notifications: dateRangeResults,
        isLoading: isDateRangeLoading
    } = useNotifications(userId, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        enabled: !!(dateRange.startDate && dateRange.endDate)
    });

    // Handle pagination
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPage(0); // Reset to first page when changing tabs
        setFilterType(null); // Reset type filter
        setSearchTerm(''); // Reset search
    };

    // Handle mark as read
    const handleMarkAsRead = (id) => {
        markAsRead(id);
    };

    // Handle mark all as read
    const handleMarkAllAsRead = () => {
        markAllAsRead();
    };

    // Handle mark all as read by type
    const handleMarkAllAsReadByType = (type) => {
        markAllAsReadByType(type);
    };

    // Handle delete
    const handleDelete = (notification) => {
        setSelectedNotification(notification);
        setShowDeleteModal(true);
    };

    // Confirm delete
    const confirmDelete = () => {
        if (selectedNotification) {
            deleteNotification(selectedNotification.id);
            setShowDeleteModal(false);
            setSelectedNotification(null);
        }
    };

    // Handle edit
    const handleEdit = (notification) => {
        setSelectedNotification(notification);
        setEditContent(notification.content);
        setShowEditModal(true);
    };

    // Confirm edit
    const confirmEdit = () => {
        if (selectedNotification && editContent) {
            updateNotificationContent({
                id: selectedNotification.id,
                content: editContent
            });
            setShowEditModal(false);
            setSelectedNotification(null);
            setEditContent('');
        }
    };

    // Handle delete all read
    const handleDeleteAllRead = () => {
        if (window.confirm('Are you sure you want to delete all read notifications?')) {
            deleteAllRead();
        }
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        // The search is already triggered by the useNotifications hook
        // when searchTerm changes
    };

    // Handle date range search
    const handleDateRangeSearch = (e) => {
        e.preventDefault();
        // The date range search is already triggered by the useNotifications hook
        // when dateRange changes
    };

    // Handle type filter
    const handleTypeFilter = (type) => {
        setFilterType(type);
        setPage(0); // Reset to first page when changing filter
    };

    // Handle view mode toggle
    const handleViewModeToggle = () => {
        setViewMode(viewMode === 'table' ? 'card' : 'table');
    };

    // Get notifications to display based on current filters and search
    const getNotificationsToDisplay = () => {
        if (searchTerm) {
            return searchResults?.content || [];
        } else if (dateRange.startDate && dateRange.endDate) {
            return dateRangeResults || [];
        } else {
            return paginatedNotifications?.content || [];
        }
    };

    // Get badge color based on notification type
    const getBadgeColor = (type) => {
        switch (type) {
            case 'COURSE':
                return 'info';
            case 'PAYMENT':
                return 'success';
            case 'SYSTEM':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
        } catch (e) {
            return dateString;
        }
    };

    // Render loading state
    if (isLoading || isSearchLoading || isDateRangeLoading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" />
                <p>Loading notifications...</p>
            </div>
        );
    }

    // Render error state
    if (isError) {
        return <Alert variant="danger">{error?.message || 'Error fetching notifications.'}</Alert>;
    }

    // Get notifications to display
    const notifications = getNotificationsToDisplay();

    return (
        <div className="notification-management">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Notification Management</h3>
                <div>
                    <Badge bg="primary" className="me-2">
                        Unread: {unreadCount || 0}
                    </Badge>
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={handleMarkAllAsRead}
                    >
                        Mark All as Read
                    </Button>
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={handleDeleteAllRead}
                    >
                        Delete All Read
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Total</Card.Title>
                                <h3>{statistics.totalCount}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Course</Card.Title>
                                <h3>{statistics.courseNotificationsCount}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>Payment</Card.Title>
                                <h3>{statistics.paymentNotificationsCount}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>System</Card.Title>
                                <h3>{statistics.systemNotificationsCount}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Search and Filters */}
            <Row className="mb-4">
                <Col md={6}>
                    <Form onSubmit={handleSearch}>
                        <InputGroup>
                            <FormControl
                                placeholder="Search notifications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button type="submit" variant="outline-secondary">
                                Search
                            </Button>
                        </InputGroup>
                    </Form>
                </Col>
                <Col md={4}>
                    <Form onSubmit={handleDateRangeSearch}>
                        <InputGroup>
                            <FormControl
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                            />
                            <FormControl
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                            />
                            <Button type="submit" variant="outline-secondary">
                                Filter
                            </Button>
                        </InputGroup>
                    </Form>
                </Col>
                <Col md={2} className="d-flex justify-content-end">
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-type-filter">
                            {filterType || 'Filter by Type'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleTypeFilter(null)}>All Types</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleTypeFilter('COURSE')}>Course</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleTypeFilter('PAYMENT')}>Payment</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleTypeFilter('SYSTEM')}>System</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button 
                        variant="outline-secondary" 
                        className="ms-2"
                        onClick={handleViewModeToggle}
                    >
                        {viewMode === 'table' ? 'Card View' : 'Table View'}
                    </Button>
                </Col>
            </Row>

            {/* Tabs */}
            <Tabs
                activeKey={activeTab}
                onSelect={handleTabChange}
                className="mb-4"
            >
                <Tab eventKey="all" title="All Notifications" />
                <Tab eventKey="unread" title={`Unread (${unreadCount || 0})`} />
                <Tab eventKey="recent" title="Recent (30 days)" />
            </Tabs>

            {/* Notifications List */}
            {notifications.length > 0 ? (
                <>
                    {viewMode === 'table' ? (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Content</th>
                                    <th>Type</th>
                                    <th>Sent At</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notifications.map((notif) => (
                                    <tr key={notif.id}>
                                        <td>{notif.id}</td>
                                        <td>{notif.content}</td>
                                        <td>
                                            <Badge bg={getBadgeColor(notif.type)}>
                                                {notif.type}
                                            </Badge>
                                        </td>
                                        <td>{formatDate(notif.sentAt)}</td>
                                        <td>
                                            <Badge bg={notif.isRead ? 'secondary' : 'primary'}>
                                                {notif.isRead ? 'Read' : 'Unread'}
                                            </Badge>
                                        </td>
                                        <td>
                                            {!notif.isRead && (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    className="me-1"
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                >
                                                    Mark as Read
                                                </Button>
                                            )}
                                            <Button
                                                variant="info"
                                                size="sm"
                                                className="me-1"
                                                onClick={() => handleEdit(notif)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(notif)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                      <ListGroup>
                          {notifications.map((notif) => (
                              <ListGroup.Item 
                                  key={notif.id}
                                  className={`mb-2 ${!notif.isRead ? 'border-primary' : ''}`}
                              >
                                  <div className="d-flex justify-content-between align-items-start">
                                      <div>
                                          <div className="d-flex align-items-center mb-1">
                                              <Badge bg={getBadgeColor(notif.type)} className="me-2">
                                                  {notif.type}
                                              </Badge>
                                              <Badge bg={notif.isRead ? 'secondary' : 'primary'}>
                                                  {notif.isRead ? 'Read' : 'Unread'}
                                              </Badge>
                                              <small className="text-muted ms-2">
                                                  {formatDate(notif.sentAt)}
                                              </small>
                                          </div>
                                          <p className="mb-0">{notif.content}</p>
                                      </div>
                                      <div>
                                          {!notif.isRead && (
                                              <Button
                                                  variant="success"
                                                  size="sm"
                                                  className="me-1"
                                                  onClick={() => handleMarkAsRead(notif.id)}
                                              >
                                                  Mark as Read
                                              </Button>
                                          )}
                                          <Button
                                              variant="info"
                                              size="sm"
                                              className="me-1"
                                              onClick={() => handleEdit(notif)}
                                          >
                                              Edit
                                          </Button>
                                          <Button
                                              variant="danger"
                                              size="sm"
                                              onClick={() => handleDelete(notif)}
                                          >
                                              Delete
                                          </Button>
                                      </div>
                                  </div>
                                  {notif.courseId && (
                                      <div className="mt-2">
                                          <Badge bg="light" text="dark">
                                              Course ID: {notif.courseId}
                                          </Badge>
                                      </div>
                                  )}
                                  {notif.paymentId && (
                    <div className="mt-2">
                        <Badge bg="light" text="dark">
                            Payment ID: {notif.paymentId}
                        </Badge>
                    </div>
                )}
            </ListGroup.Item>
        ))}
    </ListGroup>
)}
                </>
            ) : (
                <Alert variant="info">
                    {searchTerm 
                        ? 'No notifications found matching your search.' 
                        : (dateRange.startDate && dateRange.endDate)
                            ? 'No notifications found in the selected date range.'
                            : 'No notifications found.'}
                </Alert>
            )}

            {/* Pagination */}
            {paginatedNotifications && paginatedNotifications.totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.First 
                            onClick={() => handlePageChange(0)} 
                            disabled={page === 0}
                        />
                        <Pagination.Prev 
                            onClick={() => handlePageChange(page - 1)} 
                            disabled={page === 0}
                        />
                        
                        {[...Array(paginatedNotifications.totalPages).keys()].map((pageNum) => (
                            <Pagination.Item
                                key={pageNum}
                                active={pageNum === page}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum + 1}
                            </Pagination.Item>
                        ))}
                        
                        <Pagination.Next 
                            onClick={() => handlePageChange(page + 1)} 
                            disabled={page === paginatedNotifications.totalPages - 1}
                        />
                        <Pagination.Last 
                            onClick={() => handlePageChange(paginatedNotifications.totalPages - 1)} 
                            disabled={page === paginatedNotifications.totalPages - 1}
                        />
                    </Pagination>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this notification?
                    {selectedNotification && (
                        <div className="mt-3 p-3 bg-light">
                            <p><strong>Content:</strong> {selectedNotification.content}</p>
                            <p><strong>Type:</strong> {selectedNotification.type}</p>
                            <p><strong>Sent At:</strong> {formatDate(selectedNotification.sentAt)}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                        </Form.Group>
                        {selectedNotification && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedNotification.type}
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sent At</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formatDate(selectedNotification.sentAt)}
                                        disabled
                                    />
                                </Form.Group>
                            </>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default NotificationList;