import React, { useContext, useState, useEffect } from 'react';
import { Bell } from 'react-bootstrap-icons';
import { Badge, Dropdown, ListGroup, Button, Spinner } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthContext';
import useNotifications from '../../hooks/useNotifications';
import { format, isToday, isYesterday } from 'date-fns';
import { Link } from 'react-router-dom';
import { getNotificationBadgeColor } from '../../constants/notificationTypes';

/**
 * NotificationBell component displays a notification icon with unread count
 * and a dropdown with recent notifications
 */
const NotificationBell = () => {
  const { auth } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Ensure user is authenticated
  if (!auth?.user?.id) {
    return null;
  }

  const userId = auth.user.id;

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  } = useNotifications(userId, {
    unreadOnly: true,
    size: 5,
    recentOnly: true
  });

  // Set up auto-refresh when dropdown is open
  useEffect(() => {
    if (isOpen && !refreshInterval) {
      const interval = setInterval(() => {
        refreshNotifications();
      }, 30000); // Refresh every 30 seconds when open
      setRefreshInterval(interval);
    } else if (!isOpen && refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isOpen, refreshInterval, refreshNotifications]);

  // Format date in a user-friendly way
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      
      if (isToday(date)) {
        return `Today, ${format(date, 'HH:mm')}`;
      } else if (isYesterday(date)) {
        return `Yesterday, ${format(date, 'HH:mm')}`;
      } else {
        return format(date, 'MMM dd, HH:mm');
      }
    } catch (e) {
      return dateString;
    }
  };

  const handleToggle = (isOpen) => {
    setIsOpen(isOpen);
    if (isOpen) {
      refreshNotifications();
    }
  };

  const handleMarkAsRead = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    markAsRead(id);
  };

  const handleMarkAllAsRead = (e) => {
    e.preventDefault();
    e.stopPropagation();
    markAllAsRead();
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

  return (
    <Dropdown show={isOpen} onToggle={handleToggle} align="end">
      <Dropdown.Toggle
        as="div"
        id="notification-dropdown"
        className="position-relative d-inline-block"
        style={{ cursor: 'pointer' }}
      >
        <Bell size={20} className="text-secondary" />
        {unreadCount > 0 && (
          <Badge
            bg="danger"
            pill
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.65rem' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ width: '350px', maxHeight: '500px', overflow: 'auto' }}>
        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
          <h6 className="mb-0">Notifications</h6>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="sm"
              className="text-decoration-none"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" className="me-2" />
            <span>Loading notifications...</span>
          </div>
        ) : notifications?.length > 0 ? (
          <>
            <ListGroup variant="flush">
              {notifications.map(notif => (
                <ListGroup.Item
                  key={notif.id}
                  action
                  as={Link}
                  to={`/notifications/${notif.id}`}
                  className="border-bottom"
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="d-flex align-items-center mb-1">
                        <Badge bg={getNotificationBadgeColor(notif.type)} className="me-2">
                          {getNotificationTypeName(notif.type)}
                        </Badge>
                      </div>
                      <p className="mb-1 text-truncate" style={{ maxWidth: '250px' }}>
                        {notif.content}
                      </p>
                      <small className="text-muted">
                        {formatDate(notif.sentAt)}
                      </small>
                    </div>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={(e) => handleMarkAsRead(e, notif.id)}
                    >
                      Mark read
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className="text-center py-2 border-top">
              <Link 
                to="/notifications" 
                className="text-decoration-none"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-3">
            <p className="mb-0">No new notifications</p>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationBell;