// src/views/auth/signin/JWTLogin.js
import React, { useContext, useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { AuthContext } from '../../../contexts/AuthContext';
import authService from '../../../services/authService';
import { useNavigate } from 'react-router-dom';

const JWTLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setServerError(null);
        authService.login(values)
          .then(data => {
            login(data.jwt);
            navigate('/dashboard');
          })
          .catch(err => {
            if (err.response && err.response.data) {
              setServerError(err.response.data.message || 'Đăng nhập không thành công.');
            } else {
              setServerError('Đăng nhập không thành công.');
            }
          })
          .finally(() => {
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
              placeholder="Email Address / Username"
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

          <div className="custom-control custom-checkbox text-start mb-4 mt-2">
            <input type="checkbox" className="custom-control-input mx-2" id="customCheck1" />
            <label className="custom-control-label" htmlFor="customCheck1">
              Save credentials.
            </label>
          </div>

          {serverError && (
            <Col sm={12}>
              <Alert variant="danger">{serverError}</Alert>
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
                Signin
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
