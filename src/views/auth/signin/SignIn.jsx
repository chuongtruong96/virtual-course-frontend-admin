import React, { useState } from 'react';
import { Form, Button, Spinner, Container, Row, Col } from 'react-bootstrap';
import useAuth from '../../../hooks/useAuth';

const SignIn = () => {
  const { login, loginStatus } = useAuth();
  const [userData, setUserData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted', userData);
    try {
      await login(userData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h2>Đăng Nhập</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
              />
            </Form.Group>
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={loginStatus === 'loading' || !userData.email || !userData.password}
            >
              {loginStatus === 'loading' ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : 'Đăng Nhập'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
