// ExpandedRowDetails.js
import React from 'react';

const ExpandedRowDetails = ({ instructor }) => {
  // Check if instructor data is missing or undefined
  if (!instructor) {
    return <div>No instructor data available</div>;
  }

  return (
    <div>
      <p><strong>First Name:</strong> {instructor.firstName || 'N/A'}</p>
      <p><strong>Last Name:</strong> {instructor.lastName || 'N/A'}</p>
      <p><strong>Gender:</strong> {instructor.gender || 'N/A'}</p>
      <p><strong>Address:</strong> {instructor.address || 'N/A'}</p>
      <p><strong>Phone:</strong> {instructor.phone || 'N/A'}</p>
      <p><strong>Verified Phone:</strong> {instructor.verifiedPhone ? 'Yes' : 'No'}</p>
      <p><strong>Bio:</strong> {instructor.bio || 'No bio available'}</p>
      <p><strong>Title:</strong> {instructor.title || 'N/A'}</p>
      <p><strong>Workplace:</strong> {instructor.workplace || 'N/A'}</p>
      <p><strong>Photo:</strong> {instructor.photo ? <img src={instructor.photo} alt="Instructor" style={{ maxWidth: '100px', borderRadius: '50%' }} /> : 'No photo available'}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default ExpandedRowDetails;
