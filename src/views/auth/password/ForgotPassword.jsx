// src/views/ForgotPassword.js
import React, { useState } from 'react';
import { Card, Alert, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Breadcrumb from '../layouts/AdminLayout/Breadcrumb';
import { Formik } from 'formik';
import * as Yup from 'yup';
import authService from '../services/authService';

const ForgotPassword = () => {
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
            <Card.Body className="text-center">
              <div className="mb-4">
                <i className="feather icon-mail auth-icon" />
              </div>
              <h3 className="mb-4">Forgot Password</h3>
              <Formik
                initialValues={{
                  email: '',
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  setServerError(null);
                  setSuccessMessage(null);
                  authService.forgotPassword(values.email)
                    .then(response => {
                      setSuccessMessage("Đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn.");
                      setSubmitting(false);
                    })
                    .catch(err => {
                      if (err.response && err.response.data) {
                        setServerError(err.response.data.message || 'Yêu cầu không thành công.');
                      } else {
                        setServerError('Yêu cầu không thành công.');
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
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="email"
                        value={values.email}
                        placeholder="Email Address"
                      />
                      {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
                    </div>

                    {serverError && (
                      <Alert variant="danger">{serverError}</Alert>
                    )}

                    {successMessage && (
                      <Alert variant="success">{successMessage}</Alert>
                    )}

                    <Button
                      className="btn-block mb-4"
                      variant="primary"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      Send Reset Link
                    </Button>
                  </form>
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
    </React.Fragment>
  );
};

export default ForgotPassword;
