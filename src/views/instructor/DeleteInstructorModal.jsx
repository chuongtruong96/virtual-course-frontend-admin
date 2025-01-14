// src/views/instructor/DeleteInstructorModal.jsx

import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FaTrash, FaTimesCircle } from 'react-icons/fa';
import PropTypes from 'prop-types';

const DeleteInstructorModal = ({ show, handleClose, instructorId, onDeleteSuccess }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      // Gọi API để xóa Instructor
      const response = await fetch(`/api/instructors/${instructorId}`, {
        method: 'DELETE',
        credentials: 'include', // Nếu cần gửi cookie
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete instructor.');
      }

      // Nếu thành công, gọi callback để cập nhật danh sách hoặc thông báo
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      handleClose();
    } catch (err) {
      console.error('Error deleting instructor:', err);
      setError(err.message || 'Failed to delete instructor.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} aria-labelledby="delete-instructor-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title id="delete-instructor-modal">Confirm Delete Instructor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <p>Are you sure you want to delete this Instructor? The action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isDeleting} aria-label="Cancel">
          <FaTimesCircle /> Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isDeleting} aria-label="Delete">
          {isDeleting ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Đang xóa...
            </>
          ) : (
            <>
              <FaTrash /> Delete
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DeleteInstructorModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  instructorId: PropTypes.number.isRequired,
  onDeleteSuccess: PropTypes.func,
};

export default DeleteInstructorModal;
