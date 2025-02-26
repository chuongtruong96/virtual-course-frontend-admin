// src/views/auth/SignUp1.jsx
import React from 'react';
import { Card, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';

// Layout & context
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { NotificationContext } from '../../../contexts/NotificationContext';

// Dùng custom hook useAuth
import useAuth from '../../../hooks/useAuth';

const SignUp1 = () => {
  const { register } = useAuth(); // Mutation "register"
  
  return (
    <>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" aria-hidden="true" />
                  </div>
                  <h3 className="mb-4">Sign up</h3>
                  <Formik
                    initialValues={{
                      username: '',
                      email: '',
                      password: '',
                      roles: [],
                    }}
                    validationSchema={Yup.object({
                      username: Yup.string()
                        .max(255)
                        .required('Username is required'),
                      email: Yup.string()
                        .email('Must be a valid email')
                        .max(255)
                        .required('Email is required'),
                      password: Yup.string()
                        .min(6, 'Password must be at least 6 characters')
                        .required('Password is required'),
                      roles: Yup.array()
                        .of(Yup.string())
                        .min(1, 'Select at least one role'),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                      // Gọi mutation: .mutate(payload, { onSettled })
                      register(values, {
                        onSettled: () => {
                          // Hết loading (Formik)
                          setSubmitting(false);
                        },
                      });
                    }}
                  >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                      <Form noValidate onSubmit={handleSubmit} aria-label="Signup Form">
                        {/* Username */}
                        <Form.Group controlId="username" className="mb-3">
                          <Form.Label>
                            Username <span style={{ color: 'red' }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            placeholder="Username"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.username}
                            isInvalid={touched.username && !!errors.username}
                            aria-label="Username"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.username}
                          </Form.Control.Feedback>
                        </Form.Group>

                        {/* Email */}
                        <Form.Group controlId="email" className="mb-3">
                          <Form.Label>
                            Email <span style={{ color: 'red' }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            isInvalid={touched.email && !!errors.email}
                            aria-label="Email Address"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>

                        {/* Password */}
                        <Form.Group controlId="password" className="mb-4">
                          <Form.Label>
                            Password <span style={{ color: 'red' }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            isInvalid={touched.password && !!errors.password}
                            aria-label="Password"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </Form.Group>

                        {/* Roles */}
                        <Form.Group controlId="roles" className="mb-3 text-start">
                          <Form.Label>
                            Roles <span style={{ color: 'red' }}>*</span>
                          </Form.Label>
                          <div>
                            <Form.Check
                              type="checkbox"
                              name="roles"
                              value="ADMIN"
                              label="ADMIN"
                              checked={values.roles.includes('ADMIN')}
                              onChange={handleChange}
                              aria-label="Select ADMIN role"
                            />
                            <Form.Check
                              type="checkbox"
                              name="roles"
                              value="STUDENT"
                              label="STUDENT"
                              checked={values.roles.includes('STUDENT')}
                              onChange={handleChange}
                              aria-label="Select STUDENT role"
                            />
                            <Form.Check
                              type="checkbox"
                              name="roles"
                              value="INSTRUCTOR"
                              label="INSTRUCTOR"
                              checked={values.roles.includes('INSTRUCTOR')}
                              onChange={handleChange}
                              aria-label="Select INSTRUCTOR role"
                            />
                          </div>
                          {touched.roles && errors.roles && (
                            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                              {errors.roles}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>

                        <Button
                          className="btn-block mb-4"
                          variant="primary"
                          disabled={isSubmitting}
                          type="submit"
                          aria-label="Sign up"
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
                              Signing up...
                            </>
                          ) : (
                            'Sign up'
                          )}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                  <p className="mb-2">
                    Already have an account?{' '}
                    <NavLink to="/auth/signin" className="f-w-400" aria-label="Login">
                      Login
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SignUp;
