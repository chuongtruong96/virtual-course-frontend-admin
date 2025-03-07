import React, { useState } from 'react';
import { Form, Button, Spinner, Container, Row, Col, Alert } from 'react-bootstrap';
import useAuth from '../../../hooks/useAuth';

const SignIn = () => {
  const { login, loginStatus } = useAuth();
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted', userData);
    setError(''); // Clear any previous errors
    
    try {
      await login(userData);
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 404) {
          setError('Tài khoản không tồn tại. Vui lòng kiểm tra lại email của bạn.');
        } else if (error.response.status === 401) {
          setError('Email hoặc mật khẩu không chính xác.');
        } else if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Đăng nhập thất bại. Vui lòng thử lại sau.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h2>Đăng Nhập</h2>
          
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          
          {loginStatus === 'error' && !error && (
            <Alert variant="danger" className="mt-3">
              Đăng nhập thất bại. Vui lòng thử lại.
            </Alert>
          )}
          
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
            <div className="d-flex justify-content-between align-items-center">
              <Button
                variant="primary"
                type="submit"
                disabled={loginStatus === 'loading' || !userData.email || !userData.password}
              >
                {loginStatus === 'loading' ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : 'Đăng Nhập'}
              </Button>
              <a href="/forgot-password" className="text-decoration-none">Quên mật khẩu?</a>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;