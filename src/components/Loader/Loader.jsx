// src/components/Loader/Loader.jsx

import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
    <Spinner animation="border" role="status" aria-label="Loading">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export default Loader;
