// src/views/auth/signup/SignUp1.js
import React, { useState } from 'react';
import { Card, Row, Col, Alert, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import authService from '../../../services/authService';

const SignUp1 = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  return (
    <React.Fragment>
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
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Sign up</h3>
                  <Formik
                    initialValues={{
                      username: '',
                      email: '',
                      password: '',
                      roles: ['USER'],
                      submit: null
                    }}
                    validationSchema={Yup.object().shape({
                      username: Yup.string().max(255).required('Username is required'),
                      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                      password: Yup.string().min(6, 'Password must be at least 6 characters').max(255).required('Password is required'),
                      roles: Yup.array().of(Yup.string()).min(1, 'Select at least one role')
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                      setServerError(null);
                      setSuccessMessage(null);
                      authService.register(values)
                        .then(response => {
                          setSuccessMessage("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
                          setSubmitting(false);
                          navigate('/auth/signin');
                        })
                        .catch(err => {
                          if (err.response && err.response.data) {
                            setServerError(err.response.data.message || 'Đăng ký không thành công.');
                          } else {
                            setServerError('Đăng ký không thành công.');
                          }
                          setSubmitting(false);
                        });
                    }}
                  >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                      <form noValidate onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                          <input
                            className="form-control"
                            name="username"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="text"
                            value={values.username}
                            placeholder="Username"
                          />
                          {touched.username && errors.username && <small className="text-danger form-text">{errors.username}</small>}
                        </div>
                        <div className="form-group mb-3">
                          <input
                            className="form-control"
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="email"
                            value={values.email}
                            placeholder="Email Address"
                          />
                          {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
                        </div>
                        <div className="form-group mb-4">
                          <input
                            className="form-control"
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="password"
                            value={values.password}
                            placeholder="Password"
                          />
                          {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
                        </div>

                        <div className="form-group mb-3 text-start">
                          <label>Roles:</label>
                          <div>
                            <input
                              type="checkbox"
                              name="roles"
                              value="USER"
                              checked={values.roles.includes('USER')}
                              onChange={handleChange}
                            /> USER
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              name="roles"
                              value="STUDENT"
                              checked={values.roles.includes('STUDENT')}
                              onChange={handleChange}
                            /> STUDENT
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              name="roles"
                              value="INSTRUCTOR"
                              checked={values.roles.includes('INSTRUCTOR')}
                              onChange={handleChange}
                            /> INSTRUCTOR
                          </div>
                          {touched.roles && errors.roles && <small className="text-danger form-text">{errors.roles}</small>}
                        </div>

                        {serverError && (
                          <Col sm={12}>
                            <Alert variant="danger">{serverError}</Alert>
                          </Col>
                        )}

                        {successMessage && (
                          <Col sm={12}>
                            <Alert variant="success">{successMessage}</Alert>
                          </Col>
                        )}

                        <Row>
                          <Col mt={2}>
                            <Button
                              className="btn-block mb-4"
                              variant="primary"
                              disabled={isSubmitting}
                              size="large"
                              type="submit"
                            >
                              Sign up
                            </Button>
                          </Col>
                        </Row>
                      </form>
                    )}
                  </Formik>
                  <p className="mb-2">
                    Already have an account?{' '}
                    <NavLink to="/auth/signin" className="f-w-400">
                      Login
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUp1;
