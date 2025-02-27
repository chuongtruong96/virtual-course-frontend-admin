import React, { useContext, useState } from 'react';
import { Bell } from 'react-bootstrap-icons';
import { Badge, Dropdown, ListGroup, Button } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthContext';
import useNotifications from '../../hooks/useNotifications';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
    const { auth } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    
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
        markAllAsRead 
    } = useNotifications(userId, { 
        unreadOnly: true, 
        size: 5 
    });
    
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, HH:mm');
        } catch (e) {
            return dateString;
        }
    };
    
    const handleToggle = (isOpen) => {
        setIsOpen(isOpen);
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
    
    return (
        <Dropdown show={isOpen} onToggle={handleToggle} align="end">
            <Dropdown.Toggle 
                as="div" 
                id="notification-dropdown"
                className="position-relative d-inline-block cursor-pointer"
                style={{ cursor: 'pointer' }}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <Badge 
                        bg="danger" 
                        pill 
                        className="position-absolute top-0 start-100 translate-middle"
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
                    <Dropdown.Item className="text-center">Loading...</Dropdown.Item>
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
                        <Dropdown.Item as={Link} to="/notifications" className="text-center">
                            View all notifications
                        </Dropdown.Item>
                    </>
                ) : (
                    <Dropdown.Item className="text-center">No new notifications</Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationBell;