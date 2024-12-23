import React, { useState } from 'react';
import { FaCheckCircle, FaBan } from 'react-icons/fa';
import ActionButton from '../../components/Table/ActionButton';
import './styled/Card.css';
import '../../styles/ActionButton.css';

const InstructorCard = ({ instructor, onEdit, onDelete, onEnable, onDisable }) => {
  const [showFullBio, setShowFullBio] = useState(false);

  const handleToggleBio = () => setShowFullBio(!showFullBio);

  // Image URL fallback logic
  const imageUrl = instructor.photo 
    ? `http://localhost:8080/uploads/instructor/${instructor.photo}` 
    : '/virtualcourse/images/default-profile.png'; // Đảm bảo đường dẫn default image đúng

  return (
    <div className="instructor-card">
      <div className="card-header">
        <div className="parallax-effect">
          {/* Check if image exists, fallback to default */}
          <img
            src={imageUrl}
            alt={`${instructor.firstName} ${instructor.lastName}`}
            className="card-img"
          />
        </div>
        <h4 className="card-title">
          {instructor.firstName} {instructor.lastName}
        </h4>
        <p className="card-title-sub">
          {instructor.title} - {instructor.workplace}
        </p>
      </div>

      <div className="card-body">
        <div className="info-group">
          <p><strong>Gender:</strong> {instructor.gender}</p>
          <p><strong>Phone:</strong> {instructor.phone}</p>
          <p><strong>Address:</strong> {instructor.address}</p>
          <p>
            <strong>Bio:</strong> {showFullBio ? instructor.bio : `${instructor.bio.substring(0, 100)}...`}
            {instructor.bio.length > 100 && (
              <button className="read-more" onClick={handleToggleBio}>
                {showFullBio ? 'Read Less' : 'Read More'}
              </button>
            )}
          </p>
        </div>

        <div className="status">
          <p>
            {instructor.status === 'active' ? <FaCheckCircle className="status-icon active" /> : <FaBan className="status-icon inactive" />}
            {instructor.status === 'active' ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>

      <div className="card-footer">
        <ActionButton type="edit" onClick={() => onEdit(instructor.id)} />
        <ActionButton type="delete" onClick={() => onDelete(instructor.id)} />
        <ActionButton
          type={instructor.status === 'active' ? 'disable' : 'enable'}
          onClick={instructor.status === 'active' ? () => onDisable(instructor.id) : () => onEnable(instructor.id)}
        />
      </div>
    </div>
  );
};

export default InstructorCard;
