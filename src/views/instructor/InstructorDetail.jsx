// src/views/instructor/InstructorDetail.jsx

import React from 'react';
import { Card, Button, Image, Badge } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { UPLOAD_BASE } from '../../config/endpoint';
import { useNavigate } from 'react-router-dom';

const InstructorDetail = ({ instructor }) => {
  const navigate = useNavigate(); // Sử dụng useNavigate

  // Image URL fallback logic
  const imageUrl = instructor.photo ? `${UPLOAD_BASE}/instructor/${instructor.photo}` : '/virtualcourse/images/default-profile.png'; // Đảm bảo đường dẫn ảnh mặc định đúng

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex align-items-center">
        <Image
          src={imageUrl}
          alt={`${instructor.firstName} ${instructor.lastName}`}
          roundedCircle
          width={80}
          height={80}
          className="me-3"
        />
        <div>
          <h4 className="card-title mb-0">
            {instructor.firstName} {instructor.lastName}
          </h4>
          <p className="card-subtitle text-muted">
            {instructor.title} - {instructor.workplace}
          </p>
        </div>
      </Card.Header>
      <Card.Body>
        <p>
          <strong>Gender:</strong> {instructor.gender}
        </p>
        <p>
          <strong>Phone:</strong> {instructor.phone || 'N/A'}
        </p>
        <p>
          <strong>Address:</strong> {instructor.address || 'N/A'}
        </p>
        <p>
          <strong>Bio:</strong> {instructor.bio || 'N/A'}
        </p>
        {/* Thêm các thông tin khác nếu cần */}
        {/* Hiển thị thông tin Account nếu cần */}
        {instructor.account && (
          <>
            <hr />
            <h5>Account Information</h5>
            <p>
              <strong>Username:</strong> {instructor.account.username}
            </p>
            <p>
              <strong>Email:</strong> {instructor.account.email}
            </p>
            {/* Thêm các thông tin khác từ Account nếu cần */}
          </>
        )}
      </Card.Body>
      <Card.Footer>
        <Button
          variant="info"
          onClick={() => navigate(`/dashboard/instructor/edit/${instructor.id}`)} // Thêm onClick handler
          aria-label={`Edit ${instructor.firstName} ${instructor.lastName}`}
        >
          <FaEdit /> Edit
        </Button>
      </Card.Footer>
    </Card>
  );
};

InstructorDetail.propTypes = {
  instructor: PropTypes.object.isRequired
};

export default InstructorDetail;
