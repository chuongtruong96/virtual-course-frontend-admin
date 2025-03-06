import React, { useContext, useState, useEffect, useRef , useMemo, useCallback } from 'react';
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
import { AuthContext } from '../../contexts/AuthContext';
import useNotifications from '../../hooks/useNotifications';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { 
  normalizeNotificationType, 
  getNotificationBadgeColor, 
  NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES
} from '../../constants/notificationTypes';

/**
 * NotificationList component displays a list of notifications with filtering,
 * pagination, and management capabilities
 */
const NotificationList = () => {
  const { auth } = useContext(AuthContext);
  const queryClient = useQueryClient();
  
  // State for UI controls
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  
  // State for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showSendMultipleModal, setShowSendMultipleModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  // State for new notifications
  const [newNotification, setNewNotification] = useState({
    userId: '',
    content: '',
    type: 'SYSTEM',
    courseId: '',
    paymentId: ''
  });
  
  // State for multiple notifications
  const [multipleNotification, setMultipleNotification] = useState({
    userIds: '',
    content: '',
    type: 'SYSTEM',
    courseId: '',
    paymentId: ''
  });
  
  // Admin-specific states
  const [viewAllUsers, setViewAllUsers] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [specificUserId, setSpecificUserId] = useState(null);
  // Check user roles
  const checkRole = useCallback((roleToCheck) => {
    // Check if auth or roles is undefined
    if (!auth || !auth.roles) {
      // Try to get roles directly from localStorage as a fallback
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const roles = storedUser?.roles;
        
        if (roles) {
          // Check if roles is an array of strings
          if (typeof roles[0] === 'string') {
            return roles.includes(roleToCheck);
          }
          // Check if roles is an array of objects with authority property
          else if (typeof roles[0] === 'object') {
            return roles.some(role => role.authority === roleToCheck);
          }
        }
      } catch (e) {
        console.error('Error checking roles from localStorage:', e);
      }
      return false;
    }
    
    // If auth.roles exists, check it
    return auth.roles.some(role => {
      if (typeof role === 'string') {
        return role === roleToCheck;
      }
      return role.authority === roleToCheck;
    });
  }, [auth]);

  const isAdmin = useMemo(() => checkRole('ROLE_ADMIN'), [checkRole]);
  const isStudent = useMemo(() => checkRole('ROLE_STUDENT'), [checkRole]);
  const isInstructor = useMemo(() => checkRole('ROLE_INSTRUCTOR'), [checkRole]);

  // Debug log
  useEffect(() => {
    console.log('User roles:', {
      isAdmin,
      isStudent,
      isInstructor,
      allRoles: auth?.roles
    });
  }, [isAdmin, isStudent, isInstructor, auth?.roles]);

  // Ensure user is authenticated
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
  const searchTimeoutRef = useRef(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  // Add this effect for debouncing search
useEffect(() => {
  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current);
  }
  
  searchTimeoutRef.current = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500); // 500ms delay
  
  return () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };
}, [searchTerm]);
  // Options for useNotifications hook
  const options = useMemo(() => ({
    page,
    size,
    type: filterType,
    searchTerm: debouncedSearchTerm, // Use debounced search term here,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    enablePagination: true,
    viewAllUsers,
    isAdmin,
    unreadOnly: activeTab === 'unread',
    recentOnly: activeTab === 'recent'
  }), [
    page, size, filterType, debouncedSearchTerm, dateRange, // Changed here
    viewAllUsers, isAdmin, activeTab
  ]);
  // Add this inside the component, before the useNotifications hook

  
  // Use the notifications hook
  const {
    allNotifications,
    allNotificationsPaginated,
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
    refreshNotifications,
    sendNotification,
    sendNotificationToMultipleUsers
  } = useNotifications(userId, options);
  // Handle send notification
  const handleSendNotification = useCallback(() => {
    const { userId, content, type, courseId, paymentId } = newNotification;
    
    if (!userId || !content || !type) {
      alert('User ID, content, and type are required');
      return;
    }
    
    const normalizedType = normalizeNotificationType(type);
    
    sendNotification({
      targetUserId: parseInt(userId, 10),
      content,
      type: normalizedType,
      courseId: courseId ? parseInt(courseId, 10) : null,
      paymentId: paymentId ? parseInt(paymentId, 10) : null
    });
    
    setShowSendModal(false);
    setNewNotification({
      userId: '',
      content: '',
      type: 'SYSTEM',
      courseId: '',
      paymentId: ''
    });
  }, [newNotification, sendNotification]);

  // Handle send multiple notification
  const handleSendMultipleNotification = useCallback(() => {
    const { userIds, content, type, courseId, paymentId } = multipleNotification;
    
    // Validate input
    if (!userIds || !content || !type) {
      alert('User IDs, content, and type are required');
      return;
    }
    
    // Parse user IDs
    const userIdArray = userIds.split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id));
    
    if (userIdArray.length === 0) {
      alert('Please enter valid user IDs (comma separated)');
      return;
    }
    
    // Normalize type before sending
    const normalizedType = normalizeNotificationType(type);
    
    // Call API to send notification to multiple users
    sendNotificationToMultipleUsers({
      userIds: userIdArray,
      content,
      type: normalizedType,
      courseId: courseId ? parseInt(courseId, 10) : null,
      paymentId: paymentId ? parseInt(paymentId, 10) : null
    });
    
    // Close modal and reset form
    setShowSendMultipleModal(false);
    setMultipleNotification({
      userIds: '',
      content: '',
      type: 'SYSTEM',
      courseId: '',
      paymentId: ''
    });
  }, [multipleNotification, sendNotificationToMultipleUsers]);

  // Admin controls component
  const AdminControls = useMemo(() => {
    if (!isAdmin) return null;
    
    return (
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Admin Controls</Card.Title>
          <Form.Check
            type="switch"
            id="view-all-notifications"
            label="View notifications for all users"
            checked={viewAllUsers}
            onChange={() => {
              setViewAllUsers(!viewAllUsers);
              setSpecificUserId(null);
              setTargetUserId('');
              setPage(0);
              queryClient.invalidateQueries({ queryKey: ['notifications', 'all'] });
              setTimeout(refreshNotifications, 300);
            }}
            className="mb-2"
          />
          {viewAllUsers && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={refreshNotifications}
            >
              Force Refresh All Notifications
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  }, [isAdmin, viewAllUsers, refreshNotifications, queryClient]);

  // Admin user search component
  const AdminUserSearch = useMemo(() => {
    if (!isAdmin) return null;
    
    return (
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>View Specific User's Notifications</Card.Title>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Enter user ID"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              type="number"
            />
            <Button 
              variant="outline-primary"
              onClick={() => {
                if (targetUserId) {
                  setSpecificUserId(parseInt(targetUserId, 10));
                  setViewAllUsers(false);
                  setPage(0);
                  setTimeout(refreshNotifications, 300);
                }
              }}
            >
              View User
            </Button>
          </InputGroup>
          {specificUserId && (
            <Alert variant="info">
              Viewing notifications for User ID: {specificUserId}
              <Button
                variant="link"
                className="p-0 ms-2"
                onClick={() => {
                  setSpecificUserId(null);
                  setTargetUserId('');
                  setTimeout(refreshNotifications, 300);
                }}
              >
                Clear
              </Button>
            </Alert>
          )}
        </Card.Body>
      </Card>
    );
  }, [isAdmin, targetUserId, specificUserId, refreshNotifications]);
  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setPage(0); // Reset to first page when changing tabs
    setFilterType(null); // Reset type filter
    setSearchTerm(''); // Reset search
  }, []);

  // Handle mark as read
  const handleMarkAsRead = useCallback((id) => {
    markAsRead(id);
  }, [markAsRead]);

  // Handle mark all as read
  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  // Handle mark all as read by type
  const handleMarkAllAsReadByType = useCallback((type) => {
    markAllAsReadByType(type);
  }, [markAllAsReadByType]);

  // Handle delete
  const handleDelete = useCallback((notification) => {
    setSelectedNotification(notification);
    setShowDeleteModal(true);
  }, []);

  // Confirm delete
  const confirmDelete = useCallback(() => {
    if (selectedNotification) {
      deleteNotification(selectedNotification.id);
      setShowDeleteModal(false);
      setSelectedNotification(null);
    }
  }, [selectedNotification, deleteNotification]);

  // Handle edit
  const handleEdit = useCallback((notification) => {
    setSelectedNotification(notification);
    setEditContent(notification.content);
    setShowEditModal(true);
  }, []);

  // Confirm edit
  const confirmEdit = useCallback(() => {
    if (selectedNotification && editContent) {
      updateNotificationContent({
        id: selectedNotification.id,
        content: editContent
      });
      setShowEditModal(false);
      setSelectedNotification(null);
      setEditContent('');
    }
  }, [selectedNotification, editContent, updateNotificationContent]);

  // Handle delete all read
  const handleDeleteAllRead = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all read notifications?')) {
      deleteAllRead();
    }
  }, [deleteAllRead]);

  // Handle search
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    // The search is already triggered by the useNotifications hook
    // when searchTerm changes
  }, []);

  // Handle date range search
  // Modify the handleDateRangeSearch function
const handleDateRangeSearch = useCallback((e) => {
  e.preventDefault();
  
  // Validate date range
  if (!dateRange.startDate || !dateRange.endDate) {
    alert('Please select both start and end dates');
    return;
  }
  
  // Ensure start date is before end date
  if (new Date(dateRange.startDate) > new Date(dateRange.endDate)) {
    alert('Start date must be before end date');
    return;
  }
  
  // Force refresh to apply date filter
  refreshNotifications();
}, [dateRange, refreshNotifications]);

  // Handle type filter
  const handleTypeFilter = useCallback((type) => {
    console.log(`Setting filter type to: ${type}`);
    setFilterType(type);
    setPage(0); // Reset to first page when changing filter
    
    // Force refresh to apply the type filter
  setTimeout(() => {
    console.log("Triggering refresh with new filter type:", type);
    refreshNotifications();
  }, 300);
}, [refreshNotifications]);

  // Handle view mode toggle
  const handleViewModeToggle = useCallback(() => {
    setViewMode(viewMode === 'table' ? 'card' : 'table');
  }, [viewMode]);

  // Get notifications to display based on current filters and search
  const notificationsToDisplay = useMemo(() => {
    if (isAdmin && viewAllUsers) {
      return allNotificationsPaginated?.content || [];
    }
    return paginatedNotifications?.content || [];
  }, [isAdmin, viewAllUsers, allNotificationsPaginated, paginatedNotifications]);
  console.log("allNotificationsPaginated:", allNotificationsPaginated);
  console.log("paginatedNotifications:", paginatedNotifications);
  console.log("notificationsToDisplay:", notificationsToDisplay);
  // Get friendly name for notification type
  const getNotificationTypeName = useCallback((type) => {
    switch (type) {
      // Legacy values
      case 'COURSE': return 'Course';
      case 'PAYMENT': return 'Payment';
      case 'SYSTEM': return 'System';
      // New PascalCase values
      case 'Payment': return 'Payment';
      case 'Enrollment': return 'Enrollment';
      case 'CourseUpdate': return 'Course Update';
      case 'Assignment': return 'Assignment';
      case 'TestReminder': return 'Test Reminder';
      case 'General': return 'General';
      // Abbreviated values
      case 'CrsApprv': return 'Course Approved';
      case 'CrsRejct': return 'Course Rejected';
      case 'CrsSubmt': return 'Course Submitted';
      case 'CrsRevsn': return 'Course Revision';
      case 'SysAlert': return 'System Alert';
      case 'AccStatus': return 'Account Status';
      case 'InstApprv': return 'Instructor Approved';
      case 'InstRejct': return 'Instructor Rejected';
      case 'WalletCredit': return 'Wallet Credit';
      case 'WalletDebit': return 'Wallet Debit';
      case 'WalletWithdrawal': return 'Wallet Withdrawal';
      // Default: return the type itself
      default: return type;
    }
  }, []);

  // Format date
const formatDate = useCallback((dateString) => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  } catch (e) {
    return dateString;
  }
}, []);

// Thêm đoạn code này để debug
useEffect(() => {
  console.log("Statistics data:", statistics);
  console.log("All notifications:", allNotifications);
  console.log("Paginated notifications:", paginatedNotifications);
}, [statistics, allNotifications, paginatedNotifications]);

// Nếu backend không trả về statistics đúng, chúng ta có thể tính toán thủ công
// Nếu backend không trả về statistics đúng, chúng ta có thể tính toán thủ công
const calculatedStatistics = useMemo(() => {
  if (!allNotifications || allNotifications.length === 0) {
    return {
      totalCount: paginatedNotifications?.totalElements || 0,
      courseNotificationsCount: 0,
      paymentNotificationsCount: 0,
      systemNotificationsCount: 0,
      reviewNotificationsCount: 0,
      otherNotificationsCount: 0
    };
  }

  // Lấy tất cả thông báo từ allNotifications hoặc paginatedNotifications
  const notifications = allNotifications.length > 0
    ? allNotifications
    : (paginatedNotifications?.content || []);

  // Log để debug
  console.log("Calculating statistics from notifications:", notifications);
  
  // Tính toán số lượng theo loại
  let courseCount = 0;
  let paymentCount = 0;
  let systemCount = 0;
  let reviewCount = 0;
  let otherCount = 0;
  
  notifications.forEach(notif => {
    const type = notif.type;
    
    // Course related
    if (
      type === 'COURSE' || 
      type === 'CourseUpdate' || 
      type === 'CrsApprv' || 
      type === 'CrsRejct' || 
      type === 'CrsSubmt' || 
      type === 'CrsRevsn' || 
      type === 'Enrollment' || 
      type === 'Assignment' || 
      type === 'TestReminder'
    ) {
      courseCount++;
    }
    // Payment related
    else if (
      type === 'PAYMENT' || 
      type === 'Payment' || 
      type === 'WalletCredit' || 
      type === 'WalletDebit' || 
      type === 'WalletWithdrawal'
    ) {
      paymentCount++;
    }
    // System related
    else if (
      type === 'SYSTEM' || 
      type === 'SysAlert' || 
      type === 'General' || 
      type === 'AccStatus' || 
      type === 'InstApprv' || 
      type === 'InstRejct'
    ) {
      systemCount++;
    }
    // Review related
    else if (
      type === 'Review' || 
      type === 'ReviewResponse' || 
      type === 'ReviewApproval' ||
      type === 'CourseReview' ||
      type === 'InstructorReview'
    ) {
      reviewCount++;
    }
    // Nếu không thuộc loại nào ở trên
    else {
      otherCount++;
      console.log(`Notification with type "${type}" counted as "Other"`);
    }
  });

  return {
    totalCount: notifications.length,
    courseNotificationsCount: courseCount,
    paymentNotificationsCount: paymentCount,
    systemNotificationsCount: systemCount,
    reviewNotificationsCount: reviewCount,
    otherNotificationsCount: otherCount
  };
}, [allNotifications, paginatedNotifications]);

// Render loading state
if (isLoading) {
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
  const notifications = notificationsToDisplay;

  console.log("Notifications to display:", notifications);

  return (
    <div className="notification-management">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Notification Management</h3>
        <div>
          {isAdmin && (
            <>
              <Button
                variant="primary"
                className="me-2"
                onClick={() => setShowSendModal(true)}
              >
                Send New Notification
              </Button>
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => setShowSendMultipleModal(true)}
              >
                Send to Multiple Users
              </Button>
            </>
          )}
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
      {isAdmin && AdminControls}
      {isAdmin && AdminUserSearch}

      {/* Statistics Cards */}
      {(() => {
  // Tạo một đối tượng thống kê hợp nhất
  const stats = {
    totalCount: statistics?.totalCount || calculatedStatistics?.totalCount || 0,
    courseNotificationsCount: statistics?.courseNotificationsCount || calculatedStatistics?.courseNotificationsCount || 0,
    paymentNotificationsCount: statistics?.paymentNotificationsCount || calculatedStatistics?.paymentNotificationsCount || 0,
    systemNotificationsCount: statistics?.systemNotificationsCount || calculatedStatistics?.systemNotificationsCount || 0,
    // Nếu không có dữ liệu reviews, hiển thị 0
    reviewNotificationsCount: 0,
    // Tính toán "Other" bằng cách lấy tổng trừ đi các loại đã biết
    otherNotificationsCount: (statistics?.totalCount || 0) - 
      ((statistics?.courseNotificationsCount || 0) + 
       (statistics?.paymentNotificationsCount || 0) + 
       (statistics?.systemNotificationsCount || 0))
  };
  
  // Đảm bảo otherNotificationsCount không âm
  if (stats.otherNotificationsCount < 0) stats.otherNotificationsCount = 0;
  
  return (
    <Row className="mb-4">
      <Col md={2} sm={6}>
        <Card className="text-center mb-2">
          <Card.Body>
            <Card.Title>Total</Card.Title>
            <h3>{stats.totalCount}</h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} sm={6}>
        <Card className="text-center mb-2">
          <Card.Body>
            <Card.Title>Course</Card.Title>
            <h3>{stats.courseNotificationsCount}</h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} sm={6}>
        <Card className="text-center mb-2">
          <Card.Body>
            <Card.Title>Payment</Card.Title>
            <h3>{stats.paymentNotificationsCount}</h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} sm={6}>
        <Card className="text-center mb-2">
          <Card.Body>
            <Card.Title>System</Card.Title>
            <h3>{stats.systemNotificationsCount}</h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} sm={6}>
        <Card className="text-center mb-2" bg="light">
          <Card.Body>
            <Card.Title>Reviews</Card.Title>
            <h3>{stats.reviewNotificationsCount}</h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} sm={6}>
        <Card className="text-center mb-2" bg="light">
          <Card.Body>
            <Card.Title>Other</Card.Title>
            <h3>{stats.otherNotificationsCount}</h3>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
})()}
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
                      <Badge bg={getNotificationBadgeColor(notif.type)}>
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
                        <Badge bg={getNotificationBadgeColor(notif.type)} className="me-2">
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
      {/* Send Notification Modal */}
      <Modal show={showSendModal} onHide={() => setShowSendModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Send New Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>User ID *</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter user ID"
                value={newNotification.userId}
                onChange={(e) => setNewNotification({...newNotification, userId: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter notification content"
                value={newNotification.content}
                onChange={(e) => setNewNotification({...newNotification, content: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type *</Form.Label>
              <Form.Select
                value={newNotification.type}
                onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                required
              >
                <option value="">Select notification type</option>
                <optgroup label="System">
                  <option value="SYSTEM">System (Legacy)</option>
                  <option value="SysAlert">System Alert</option>
                  <option value="General">General</option>
                  <option value="AccStatus">Account Status</option>
                </optgroup>
                <optgroup label="Course">
                  <option value="COURSE">Course (Legacy)</option>
                  <option value="CourseUpdate">Course Update</option>
                  <option value="CrsApprv">Course Approved</option>
                  <option value="CrsRejct">Course Rejected</option>
                  <option value="CrsSubmt">Course Submitted</option>
                  <option value="CrsRevsn">Course Revision</option>
                </optgroup>
                <optgroup label="Instructor">
                  <option value="InstApprv">Instructor Approved</option>
                  <option value="InstRejct">Instructor Rejected</option>
                </optgroup>
                <optgroup label="Payment">
                  <option value="PAYMENT">Payment (Legacy)</option>
                  <option value="Payment">Payment</option>
                  <option value="WalletCredit">Wallet Credit</option>
                  <option value="WalletDebit">Wallet Debit</option>
                  <option value="WalletWithdrawal">Wallet Withdrawal</option>
                </optgroup>
                <optgroup label="Education">
                  <option value="Enrollment">Enrollment</option>
                  <option value="Assignment">Assignment</option>
                  <option value="TestReminder">Test Reminder</option>
                </optgroup>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Course ID (Optional)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter course ID if applicable"
                value={newNotification.courseId}
                onChange={(e) => setNewNotification({...newNotification, courseId: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment ID (Optional)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter payment ID if applicable"
                value={newNotification.paymentId}
                onChange={(e) => setNewNotification({...newNotification, paymentId: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSendModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSendNotification}>
            Send Notification
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Send to Multiple Users Modal */}
      <Modal show={showSendMultipleModal} onHide={() => setShowSendMultipleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Send Notification to Multiple Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>User IDs * (comma separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. 1, 2, 3, 4"
                value={multipleNotification.userIds}
                onChange={(e) => setMultipleNotification({...multipleNotification, userIds: e.target.value})}
                required
              />
              <Form.Text className="text-muted">
                Enter user IDs separated by commas
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter notification content"
                value={multipleNotification.content}
                onChange={(e) => setMultipleNotification({...multipleNotification, content: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type *</Form.Label>
              <Form.Select
                value={multipleNotification.type}
                onChange={(e) => setMultipleNotification({...multipleNotification, type: e.target.value})}
                required
              >
                <option value="">Select notification type</option>
                <optgroup label="System">
                  <option value="SYSTEM">System (Legacy)</option>
                  <option value="SysAlert">System Alert</option>
                  <option value="General">General</option>
                  <option value="AccStatus">Account Status</option>
                </optgroup>
                <optgroup label="Course">
                  <option value="COURSE">Course (Legacy)</option>
                  <option value="CourseUpdate">Course Update</option>
                  <option value="CrsApprv">Course Approved</option>
                  <option value="CrsRejct">Course Rejected</option>
                  <option value="CrsSubmt">Course Submitted</option>
                  <option value="CrsRevsn">Course Revision</option>
                </optgroup>
                <optgroup label="Instructor">
                  <option value="InstApprv">Instructor Approved</option>
                  <option value="InstRejct">Instructor Rejected</option>
                </optgroup>
                <optgroup label="Payment">
                  <option value="PAYMENT">Payment (Legacy)</option>
                  <option value="Payment">Payment</option>
                  <option value="WalletCredit">Wallet Credit</option>
                  <option value="WalletDebit">Wallet Debit</option>
                  <option value="WalletWithdrawal">Wallet Withdrawal</option>
                </optgroup>
                <optgroup label="Education">
                  <option value="Enrollment">Enrollment</option>
                  <option value="Assignment">Assignment</option>
                  <option value="TestReminder">Test Reminder</option>
                </optgroup>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Course ID (Optional)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter course ID if applicable"
                value={multipleNotification.courseId}
                onChange={(e) => setMultipleNotification({...multipleNotification, courseId: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment ID (Optional)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter payment ID if applicable"
                value={multipleNotification.paymentId}
                onChange={(e) => setMultipleNotification({...multipleNotification, paymentId: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSendMultipleModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSendMultipleNotification}>
            Send Notifications
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotificationList;