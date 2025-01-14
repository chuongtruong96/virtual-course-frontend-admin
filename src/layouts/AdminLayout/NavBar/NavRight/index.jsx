// src/layouts/AdminLayout/NavBar/NavRight/index.jsx

import React, { useState, useContext } from 'react';
import { Card, ListGroup, Dropdown, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';

// Giả sử bạn có ChatList
import ChatList from './ChatList';

// Import các avatar demo (nếu còn dùng)
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';

// Import AuthContext
import { AuthContext } from '../../../../contexts/AuthContext';

// Import NotificationContext
import { NotificationContext } from '../../../../contexts/NotificationContext';

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);

  // Từ AuthContext, ta lấy 'auth' (có user) + 'logout'
  const { auth, logout } = useContext(AuthContext);

  // Từ NotificationContext, lấy notifications + removeNotification
  const { notifications, removeNotification } = useContext(NotificationContext);

  const navigate = useNavigate();

  // Dummy notiData (nếu bạn vẫn còn dùng)
  const notiData = [
    // ...
  ];

  // Hàm logout
  const handleLogout = () => {
    logout();            // gọi logout từ AuthContext
    navigate('/auth/signin'); // chuyển trang đăng nhập
  };

  // Đánh dấu tất cả là đã đọc
  const handleMarkAsRead = () => {
    notifications.forEach((notification) => removeNotification(notification.id));
  };

  // Xoá tất cả notification
  const handleClearAll = () => {
    notifications.forEach((notification) => removeNotification(notification.id));
  };

  // Lấy thông tin user để hiển thị
  let userName = 'John Doe'; // fallback
  let userAvatar = '/virtualcourse/images/default-profile.png'; // fallback

  // Nếu có `auth.user`, ta lấy username/email v.v.
  if (auth && auth.user) {
    // 1) username
    if (auth.user.username) {
      userName = auth.user.username;
    } else if (auth.user.email) {
      userName = auth.user.email;
    }
    // 2) avatar (nếu backend trả về đường dẫn)
    // Ví dụ: auth.user.avatar = 'http://localhost:8080/uploads/instructor/photo123.jpg'
    // if (auth.user.avatar) {
    //   userAvatar = auth.user.avatar;
    // }
    // (Nếu bạn chưa có avatar từ server, dùng fallback.)
  }

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        {/* Notification Dropdown */}
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="feather icon-bell icon" />
              {notifications.length > 0 && (
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
                {notifications.length > 0 && (
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
                  {notifications.length > 0 ? (
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
                            src={avatar1} // Hoặc notification.avatar nếu có
                            alt="Notification Avatar"
                          />
                          <Card.Body className="p-0 ms-2 flex-grow-1">
                            <p>
                              <strong>Notification</strong>
                              <span className="n-time text-muted ms-2">
                                <i className="icon feather icon-clock me-1" />
                                {notification.timestamp.toLocaleTimeString()}
                              </span>
                            </p>
                            <p>{notification.message}</p>
                          </Card.Body>
                          <Button
                            variant="link"
                            onClick={() => removeNotification(notification.id)}
                            style={{ color: 'red', textDecoration: 'none' }}
                          >
                            <i className="feather icon-x-circle"></i>
                          </Button>
                        </Card>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item as="li" bsPrefix=" " className="notification text-center">
                      No new notifications
                    </ListGroup.Item>
                  )}

                  {/* Optional: Add static notifications if needed */}
                  {notiData.map((data, index) => (
                    <ListGroup.Item key={index} as="li" bsPrefix=" " className="notification">
                      <Card
                        className="d-flex align-items-center shadow-none mb-0 p-0"
                        style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                      >
                        <img
                          className="img-radius"
                          src={data.image}
                          alt="Generic placeholder"
                        />
                        <Card.Body className="p-0 ms-2">
                          <p>
                            <strong>{data.name}</strong>
                            <span className="n-time text-muted">
                              <i className="icon feather icon-clock me-2" />
                              {data.activity}
                            </span>
                          </p>
                          <p>{data.details}</p>
                        </Card.Body>
                      </Card>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </PerfectScrollbar>
              <div className="noti-footer p-3 text-center">
                <Link to="#">show all</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>

        {/* Chat Dropdown */}
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown>
            <Dropdown.Toggle
              as={Link}
              variant="link"
              to="#"
              className="displayChatbox"
              onClick={() => setListOpen(true)}
            >
              <i className="icon feather icon-mail" />
            </Dropdown.Toggle>
          </Dropdown>
        </ListGroup.Item>

        {/* User Dropdown */}
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head d-flex align-items-center p-3">
                {/* Hiển thị avatar và userName từ auth.user */}
                <img src={userAvatar} className="img-radius" alt="User Profile" />
                <span className="ms-2">{userName}</span>
                {/* Logout Button */}
                <Button variant="link" onClick={handleLogout} className="ms-auto">
                  <i className="feather icon-log-out"></i>
                </Button>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-settings" /> Settings
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-mail" /> My Messages
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-lock" /> Lock Screen
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item" onClick={handleLogout}>
                    <i className="feather icon-log-out" /> Logout
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>

      {/* ChatList (nếu có) */}
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
