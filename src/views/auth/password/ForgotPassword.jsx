// src/views/auth/ForgotPassword.jsx
import React from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Dùng custom hook useAuth
import useAuth from '../../../hooks/useAuth';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth(); // mutation

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
            <Card.Body className="text-center">
              <div className="mb-4">
                <i className="feather icon-mail auth-icon" aria-hidden="true" />
              </div>
              <h3 className="mb-4">Forgot Password</h3>
              <Formik
                initialValues={{ email: '' }}
                validationSchema={Yup.object({
                  email: Yup.string()
                    .email('Must be a valid email')
                    .max(255)
                    .required('Email is required'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  // Gọi mutation
                  forgotPassword(values.email, {
                    onSettled: () => {
                      setSubmitting(false);
                    },
                  });
                }}
              >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={touched.email && !!errors.email}
                        aria-label="Email Address"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      className="btn-block mb-4"
                      variant="primary"
                      disabled={isSubmitting}
                      type="submit"
                      aria-label="Send Reset Link"
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
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
              <p className="mb-2 text-muted">
                <NavLink to="/auth/signin" className="f-w-400">
                  Back to Signin
                </NavLink>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
