import React from 'react';
import { Form } from 'react-bootstrap';

const BatchUpload = () => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Handle file upload logic here
  };

  return (
    <Form>
      <Form.Group>
        <Form.Label>Upload CSV/Excel File</Form.Label>
        <Form.Control type="file" accept=".csv, .xls, .xlsx" onChange={handleFileChange} />
      </Form.Group>
    </Form>
  );
};

export default BatchUpload;
