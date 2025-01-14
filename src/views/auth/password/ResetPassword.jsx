// src/views/auth/ResetPassword.jsx
import React from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { NavLink, useParams } from 'react-router-dom';
import Breadcrumb from '../layouts/AdminLayout/Breadcrumb';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Dùng custom hook
import useAuth from '../../../hooks/useAuth';

const ResetPassword = () => {
  const { token } = useParams(); // Lấy token từ route
  const { resetPassword } = useAuth(); // mutation

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
                <i className="feather icon-lock auth-icon" aria-hidden="true" />
              </div>
              <h3 className="mb-4">Reset Password</h3>
              <Formik
                initialValues={{ newPassword: '' }}
                validationSchema={Yup.object({
                  newPassword: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .max(255, 'Password is too long')
                    .required('Password is required'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  // Gọi mutation
                  resetPassword({ token, newPassword: values.newPassword }, {
                    onSettled: () => {
                      setSubmitting(false);
                    },
                  });
                }}
              >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group controlId="newPassword" className="mb-4">
                      <Form.Control
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        isInvalid={touched.newPassword && !!errors.newPassword}
                        aria-label="New Password"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.newPassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      className="btn-block mb-4"
                      variant="primary"
                      disabled={isSubmitting}
                      type="submit"
                      aria-label="Reset Password"
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
                          Resetting...
                        </>
                      ) : (
                        'Reset Password'
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

export default ResetPassword;
