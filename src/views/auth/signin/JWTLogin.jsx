// src/views/auth/JWTLogin.jsx
import React from 'react';
import { Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

// Dùng custom hook
import useAuth from '../../../hooks/useAuth';

const JWTLogin = () => {
  const { login } = useAuth(); // mutation login

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255)
          .required('Email is required'),
        password: Yup.string()
          .max(255)
          .required('Password is required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        // Gọi mutation
        login(values, {
          onSettled: () => {
            setSubmitting(false);
          },
        });
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
        <Form noValidate onSubmit={handleSubmit} aria-label="Login Form">
          <Form.Group controlId="email" className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email Address / Username"
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={touched.email && !!errors.email}
              aria-label="Email Address or Username"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password" className="mb-4">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              onBlur={handleBlur}
              onChange={handleChange}
              isInvalid={touched.password && !!errors.password}
              aria-label="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="rememberMe" className="custom-control custom-checkbox text-start mb-4 mt-2">
            <Form.Check 
              type="checkbox" 
              label="Save credentials." 
              className="mx-2" 
              id="customCheck1" 
              aria-label="Save credentials checkbox"
            />
          </Form.Group>

          <Row>
            <Col>
              <Button
                className="btn-block mb-4"
                variant="primary"
                disabled={isSubmitting}
                type="submit"
                aria-label="Signin"
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{' '}
                    Signing in...
                  </>
                ) : (
                  'Signin'
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default JWTLogin;
