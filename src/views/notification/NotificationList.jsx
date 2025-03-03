import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  Table,
  Spinner,
  Alert,
  Button,
  Badge,
  Modal,
  Form,
  Tabs,
  Tab,
  Pagination,
  InputGroup,
  FormControl,
  Dropdown,
  Card,
  Row,
  Col,
  ListGroup
} from 'react-bootstrap';
import { NotificationContext } from '../../contexts/NotificationContext';
import { AuthContext } from '../../contexts/AuthContext';
import useNotifications from '../../hooks/useNotifications';
import NotificationService from '../../services/notificationService';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

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
  
  // Admin-specific states
  const isAdmin = auth?.roles?.some(role => 
    typeof role === 'string' 
        ? role === 'ROLE_ADMIN' 
        : role.authority === 'ROLE_ADMIN'
);  

const queryClient = useQueryClient();
const [viewAllUsers, setViewAllUsers] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [specificUserId, setSpecificUserId] = useState(null);

  // Ensure user is authenticated and has a valid id
  if (!auth?.user?.id) {
    return <Alert variant="warning">User not authenticated. Please log in.</Alert>;
  }

  // Determine which user ID to use for fetching notifications
  let userId = auth.user.id;
  if (isAdmin) {
    if (viewAllUsers) {
      // Will use special endpoint for all notifications
      userId = null;
    } else if (specificUserId) {
      // Use the specific user ID entered by admin
      userId = specificUserId;
    }
  }

  const TestApiButton = () => {
    if (!isAdmin) return null;
    
    return (
      <Button 
        variant="outline-secondary" 
        size="sm" 
        className="ms-2"
        onClick={async () => {
          try {
            console.log("Testing API directly");
            const response = await fetch('http://localhost:8080/api/notifications/all');
            const data = await response.json();
            console.log("Direct API test result:", data);
            alert(`API test result: ${data.length} notifications found`);
          } catch (error) {
            console.error("Direct API test failed:", error);
            alert(`API test failed: ${error.message}`);
          }
        }}
      >
        Test API Directly
      </Button>
    );
  };



  const AdminControls = () => {
  if (!isAdmin) return null;
  
  const handleViewAllToggle = () => {
    console.log("Toggling viewAllUsers from", viewAllUsers, "to", !viewAllUsers);
    
    // Đặt giá trị mới
    const newValue = !viewAllUsers;
    setViewAllUsers(newValue);
    
    // Reset các giá trị khác
    setSpecificUserId(null);
    setTargetUserId('');
    setPage(0);
    
    // Force invalidate cache
    if (newValue) {
      console.log("Invalidating 'all' notifications cache");
      queryClient.invalidateQueries(['notifications', 'all']);
      queryClient.invalidateQueries(['notifications', 'all', 'paginated']);
    }
    
    // Delay refresh để đảm bảo state đã được cập nhật
    setTimeout(() => {
      console.log("Refreshing with viewAllUsers =", newValue);
      refreshNotifications();
    }, 300);
  };
  
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Admin Controls</Card.Title>
        <Form.Check 
          type="switch"
          id="view-all-notifications"
          label="View notifications for all users"
          checked={viewAllUsers}
          onChange={handleViewAllToggle}
          className="mb-2"
        />
        {viewAllUsers && (
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={() => {
              console.log("Manual refresh triggered");
              queryClient.invalidateQueries(['notifications', 'all']);
              queryClient.invalidateQueries(['notifications', 'all', 'paginated']);
              setTimeout(refreshNotifications, 100);
            }}
          >
            Force Refresh All Notifications
          </Button>
        )}
        <TestApiButton />
      </Card.Body>
    </Card>
  );
};

  // Admin user search component
  const AdminUserSearch = () => {
    if (!isAdmin) return null;
    
    return (
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>View Specific User's Notifications</Card.Title>
          <Form onSubmit={(e) => {
            e.preventDefault();
            if (targetUserId) {
              setSpecificUserId(parseInt(targetUserId, 10));
              setViewAllUsers(false);
              setPage(0);
            }
          }}>
            <InputGroup>
              <FormControl
                placeholder="Enter user ID to view their notifications..."
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                type="number"
                min="1"
              />
              <Button type="submit" variant="outline-primary">
                View User Notifications
              </Button>
            </InputGroup>
          </Form>
          
          {specificUserId && (
            <div className="mt-2">
              <Badge bg="info">Viewing notifications for User ID: {specificUserId}</Badge>
              <Button 
                variant="link" 
                size="sm"
                onClick={() => {
                  setSpecificUserId(null);
                  setTargetUserId('');
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  // Determine options based on active tab, filters, and admin view
  const getOptions = () => {
    const options = {
      page,
      size,
      enablePagination: true,
      viewAllUsers: viewAllUsers && isAdmin // Chỉ bật viewAllUsers khi user là admin
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
    updateNotificationContent,
    refreshNotifications
  } = useNotifications(viewAllUsers && isAdmin ? null : userId, getOptions());
  console.log("useNotifications result:", {
    paginatedNotifications,
    unreadCount,
    statistics,
    isLoading,
    isError,
    error
});
  // Debug logs - MOVED AFTER useNotifications hook
  useEffect(() => {
    console.log("Current user ID:", auth?.user?.id);
    console.log("Is admin:", isAdmin);
    console.log("View all users:", viewAllUsers);
    console.log("Specific user ID:", specificUserId);
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      refreshNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [auth, isAdmin, viewAllUsers, specificUserId, refreshNotifications]);
  
  // Search notifications
  const { paginatedNotifications: searchResults, isLoading: isSearchLoading } = useNotifications(userId, {
    searchTerm,
    page,
    size,
    enablePagination: true,
    viewAllUsers: viewAllUsers && isAdmin
  });

  // Date range search
  const { notifications: dateRangeResults, isLoading: isDateRangeLoading } = useNotifications(userId, {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    enabled: !!(dateRange.startDate && dateRange.endDate),
    viewAllUsers: viewAllUsers && isAdmin
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
    console.log("Search results:", searchResults);
    console.log("Date range results:", dateRangeResults);
    console.log("Paginated notifications:", paginatedNotifications);
    console.log("viewAllUsers:", viewAllUsers);
    
    if (searchTerm) {
      return searchResults?.content || [];
    } else if (dateRange.startDate && dateRange.endDate) {
      return dateRangeResults || [];
    } else if (viewAllUsers && isAdmin) {
      console.log("Using all notifications view");
      // Kiểm tra xem paginatedNotifications có dữ liệu không
      if (paginatedNotifications && paginatedNotifications.content) {
        console.log("Paginated notifications content:", paginatedNotifications.content);
        return paginatedNotifications.content;
      } else {
        console.log("No paginated notifications content available");
        return [];
      }
    } else {
      console.log("Using regular user notifications view");
      return paginatedNotifications?.content || [];
    }
  };

  // Get badge color based on notification type
  const getBadgeColor = (type) => {
    console.log('Notification type:', type); // Debug log
    
    // Legacy notification types
    if (type === 'COURSE') return 'info';
    if (type === 'PAYMENT') return 'success';
    if (type === 'SYSTEM') return 'warning';
    
    // New notification types
    if (type === 'InstApprv' || type === 'CrsApprv') return 'success';
    if (type === 'InstRejct' || type === 'CrsRejct') return 'danger';
    if (type === 'SysAlert') return 'warning';
    if (type === 'Payment' || type === 'WalletCredit' || type === 'WalletDebit') return 'primary';
    if (type === 'Enrollment' || type === 'CourseUpdate') return 'info';
    if (type === 'Assignment' || type === 'TestReminder') return 'dark';
    if (type === 'AccStatus') return 'light';
    
    // Default
    return 'secondary';
  };

  // Get friendly name for notification type
  const getNotificationTypeName = (type) => {
    switch (type) {
      case 'COURSE': return 'Course';
      case 'PAYMENT': return 'Payment';
      case 'SYSTEM': return 'System';
      case 'InstApprv': return 'Instructor Approved';
      case 'InstRejct': return 'Instructor Rejected';
      case 'CrsApprv': return 'Course Approved';
      case 'CrsRejct': return 'Course Rejected';
      case 'CrsSubmt': return 'Course Submitted';
      case 'CrsRevsn': return 'Course Revision';
      case 'SysAlert': return 'System Alert';
      case 'AccStatus': return 'Account Status';
      case 'Payment': return 'Payment';
      case 'Enrollment': return 'Enrollment';
      case 'CourseUpdate': return 'Course Update';
      case 'Assignment': return 'Assignment';
      case 'TestReminder': return 'Test Reminder';
      case 'WalletCredit': return 'Wallet Credit';
      case 'WalletDebit': return 'Wallet Debit';
      case 'WalletWithdrawal': return 'Wallet Withdrawal';
      default: return type;
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
  console.log("Notifications to display:", notifications);

  return (
    <div className="notification-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Notification Management</h3>
        <div>
          <Badge bg="primary" className="me-2">
            Unread: {unreadCount || 0}
          </Badge>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleDeleteAllRead}>
            Delete All Read
          </Button>
          <Button variant="outline-secondary" size="sm" className="ms-2" onClick={refreshNotifications}>
            <i className="fas fa-sync-alt"></i> Refresh
          </Button>
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <>
          <AdminControls />
          <AdminUserSearch />
        </>
      )}

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
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
            <FormControl
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
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
            {filterType ? getNotificationTypeName(filterType) : 'Filter by Type'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleTypeFilter(null)}>All Types</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>Course Related</Dropdown.Header>
            <Dropdown.Item onClick={() => handleTypeFilter('COURSE')}>Course (Legacy)</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeFilter('CourseUpdate')}>Course Update</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeFilter('CrsApprv')}>Course Approved</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeFilter('CrsRejct')}>Course Rejected</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>Instructor Related</Dropdown.Header>
            <Dropdown.Item onClick={() => handleTypeFilter('InstApprv')}>Instructor Approved</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeFilter('InstRejct')}>Instructor Rejected</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>Payment Related</Dropdown.Header>
            <Dropdown.Item onClick={() => handleTypeFilter('PAYMENT')}>Payment (Legacy)</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeFilter('Payment')}>Payment</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeFilter('WalletCredit')}>Wallet Credit</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeFilter('WalletDebit')}>Wallet Debit</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header>System Related</Dropdown.Header>
            <Dropdown.Item onClick={() => handleTypeFilter('SYSTEM')}>System (Legacy)</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeFilter('SysAlert')}>System Alert</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTypeFilter('AccStatus')}>Account Status</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="outline-secondary" className="ms-2" onClick={handleViewModeToggle}>
          {viewMode === 'table' ? 'Card View' : 'Table View'}
        </Button>
      </Col>
    </Row>

    {/* Tabs */}
    <Tabs activeKey={activeTab} onSelect={handleTabChange} className="mb-4">
      <Tab eventKey="all" title="All Notifications" />
      <Tab eventKey="unread" title={`Unread (${unreadCount || 0})`} />
      <Tab eventKey="recent" title="Recent (30 days)" />
    </Tabs>

    {/* Notifications List */}
    {notifications && notifications.length > 0 ? (
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
                      {getNotificationTypeName(notif.type)}
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
                        {getNotificationTypeName(notif.type)}
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
                {viewAllUsers && isAdmin && notif.userId && (
                  <div className="mt-2">
                    <Badge bg="info">
                      User ID: {notif.userId}
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
          : dateRange.startDate && dateRange.endDate
          ? 'No notifications found in the selected date range.'
          : 'No notifications found.'}
      </Alert>
    )}

    {/* Pagination */}
    {paginatedNotifications && paginatedNotifications.totalPages > 1 && (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(0)} disabled={page === 0} />
          <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />

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
            <p>
              <strong>Content:</strong> {selectedNotification.content}
            </p>
            <p>
              <strong>Type:</strong> {getNotificationTypeName(selectedNotification.type)}
            </p>
            <p>
              <strong>Sent At:</strong> {formatDate(selectedNotification.sentAt)}
            </p>
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
                  value={getNotificationTypeName(selectedNotification.type)}
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