// src/layouts/AdminLayout/NavBar/NavRight/index.jsx
// src/layouts/AdminLayout/NavBar/NavRight/index.jsx
import React, { useContext, useState } from 'react';
import { ListGroup, Dropdown, Badge, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import { AuthContext } from '../../../../contexts/AuthContext';
import { NotificationContext } from '../../../../contexts/NotificationContext';

// Import your custom toggle
import CustomToggle from '../../../../components/CustomToggle';

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const { notifications = [], removeNotification, clearAllNotifications } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/signin');
  };

  const handleMarkAsRead = () => {
    if (notifications && notifications.length > 0) {
      notifications.forEach((notification) => removeNotification(notification.id));
    }
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  let userName = 'John Doe';
  let userAvatar = '/virtualcourse/images/default-profile.png';
  if (auth && auth.user) {
    userName = auth.user.username || auth.user.email || userName;
    userAvatar = auth.user.avatar || userAvatar;
  }

  return (
    <>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        {/* Notification Dropdown */}
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end">
            <Dropdown.Toggle
              as={CustomToggle} // Use your custom toggle
              variant="link"
              id="dropdown-notification"
            >
              <i data-feather="bell" style={{ color: 'inherit' }}></i>
              {notifications && notifications.length > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {notifications.length}
                </Badge>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="notification notification-scroll">
              <div className="noti-head d-flex justify-content-between align-items-center p-3">
                <h6 className="d-inline-block m-b-0">Notifications</h6>
                {notifications && notifications.length > 0 && (
                  <div>
                    <Button variant="link" className="me-2" onClick={handleMarkAsRead}>
                      Mark as read
                    </Button>
                    <Button variant="link" onClick={handleClearAll}>
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
              <PerfectScrollbar style={{ maxHeight: '300px' }}>
                <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
                  {notifications && notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <ListGroup.Item
                        key={notification.id}
                        as="li"
                        bsPrefix=" "
                        className="notification"
                      >
                        <Card
                          className="d-flex align-items-center shadow-none mb-0 p-0"
                          style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                        >
                          <img
                            className="img-radius"
                            src={avatar1}
                            alt="Notification Avatar"
                          />
                          <Card.Body className="p-0 ms-2 flex-grow-1">
                            <p>
                              <strong>{notification.type || 'Notification'}</strong>
                              <span className="n-time text-muted ms-2">
                                <i data-feather="clock" className="me-1"></i>
                                {new Date(notification.timestamp).toLocaleTimeString()}
                              </span>
                            </p>
                            <p>{notification.message}</p>
                          </Card.Body>
                          <Button
                            variant="link"
                            onClick={() => removeNotification(notification.id)}
                            style={{ color: 'red', textDecoration: 'none' }}
                          >
                            <i data-feather="x-circle"></i>
                          </Button>
                        </Card>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item
                      as="li"
                      bsPrefix=" "
                      className="notification text-center"
                    >
                      No new notifications
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </PerfectScrollbar>
              <div className="noti-footer p-3 text-center">
                <Link to="/notifications">View all</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>

        {/* Chat Dropdown */}
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown>
            <Dropdown.Toggle
              as={CustomToggle}
              variant="link"
              id="dropdown-chat"
              className="displayChatbox"
              onClick={() => setListOpen(true)}
            >
              <i data-feather="mail"></i>
            </Dropdown.Toggle>
          </Dropdown>
        </ListGroup.Item>

        {/* User Dropdown */}
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end" className="drp-user">
            <Dropdown.Toggle
              as={CustomToggle}
              variant="link"
              id="dropdown-user"
            >
              <i data-feather="settings"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head d-flex align-items-center p-3">
                <div className="d-flex align-items-center">
                  <img src={userAvatar} className="img-radius" alt="User Profile" />
                  <span className="ms-2">{userName}</span>
                </div>
                <Button variant="link" onClick={handleLogout} className="ms-auto">
                  <i data-feather="log-out"></i>
                </Button>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i data-feather="settings"></i>
                    <span style={{ marginLeft: '8px' }}>Settings</span>
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i data-feather="user"></i>
                    <span style={{ marginLeft: '8px' }}>Profile</span>
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i data-feather="mail"></i>
                    <span style={{ marginLeft: '8px' }}>My Messages</span>
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i data-feather="lock"></i>
                    <span style={{ marginLeft: '8px' }}>Lock Screen</span>
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item" onClick={handleLogout}>
                    <i data-feather="log-out"></i>
                    <span style={{ marginLeft: '8px' }}>Logout</span>
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
};

export default NavRight;
