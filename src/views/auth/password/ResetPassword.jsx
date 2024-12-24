// src/views/ResetPassword.js
import React, { useState } from 'react';
import { Card, Alert, Button } from 'react-bootstrap';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../layouts/AdminLayout/Breadcrumb';
import { Formik } from 'formik';
import * as Yup from 'yup';
import authService from '../services/authService';

const ResetPassword = () => {
  const { token } = useParams(); // Giả sử token được truyền qua route params
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
            <Card.Body className="text-center">
              <div className="mb-4">
                <i className="feather icon-lock auth-icon" />
              </div>
              <h3 className="mb-4">Reset Password</h3>
              <Formik
                initialValues={{
                  newPassword: '',
                }}
                validationSchema={Yup.object().shape({
                  newPassword: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .max(255, 'Password is too long')
                    .required('Password is required'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  setServerError(null);
                  setSuccessMessage(null);
                  authService.resetPassword(token, values.newPassword)
                    .then(response => {
                      setSuccessMessage("Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.");
                      setSubmitting(false);
                      navigate('/auth/signin');
                    })
                    .catch(err => {
                      if (err.response && err.response.data) {
                        setServerError(err.response.data.message || 'Đặt lại mật khẩu không thành công.');
                      } else {
                        setServerError('Đặt lại mật khẩu không thành công.');
                      }
                      setSubmitting(false);
                    });
                }}
              >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <div className="form-group mb-4">
                      <input
                        className="form-control"
                        name="newPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="password"
                        value={values.newPassword}
                        placeholder="New Password"
                      />
                      {touched.newPassword && errors.newPassword && <small className="text-danger form-text">{errors.newPassword}</small>}
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
                      Reset Password
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

export default ResetPassword;
