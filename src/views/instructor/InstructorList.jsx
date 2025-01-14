// src/views/instructor/InstructorList.jsx

import React, { useState, useContext, useMemo } from 'react';
import {
  Modal, Row, Col, Button, Spinner, Alert, Form,
  InputGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { FaPlus, FaSearch } from 'react-icons/fa';

import useInstructors from '../../hooks/useInstructors';
import { NotificationContext } from '../../contexts/NotificationContext';
import AddInstructorModal from './AddInstructor';
import InstructorCard from './InstructorCard';
import InstructorDetail from './InstructorDetail';

import '../../styles/table.css';

const InstructorList = () => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const queryClient = useQueryClient();

  const {
    instructors,
    isLoading,
    isError,
    error,
    enableInstructor,
    disableInstructor,
    deleteInstructor
  } = useInstructors();

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Modal AddInstructor
  const [showAddInstructorModal, setShowAddInstructorModal] = useState(false);

  // Modal InstructorDetail
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');

  // Dữ liệu đã filter
  const filteredInstructors = useMemo(() => {
    let data = instructors || [];
    if (statusFilter) {
      data = data.filter((inst) => inst.status === statusFilter);
    }
    if (instructorFilter) {
      const lower = instructorFilter.toLowerCase();
      data = data.filter(
        (inst) =>
          inst.firstName.toLowerCase().includes(lower) ||
          inst.lastName.toLowerCase().includes(lower)
      );
    }
    return data;
  }, [instructors, statusFilter, instructorFilter]);

  // Phân trang
  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);
  const currentPageInstructors = filteredInstructors.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Xử lý Enable/Disable/Delete
  const handleEnableInstructor = (id) => {
    enableInstructor(id);
  };

  const handleDisableInstructor = (id) => {
    disableInstructor(id);
  };

  const handleDeleteInstructor = (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      deleteInstructor(id);
    }
  };

  // Detail modal
  const handleShowInstructorDetail = (instructor) => {
    setSelectedInstructor(instructor);
    setShowDetailModal(true);
  };

  const handleCloseInstructorDetail = () => {
    setSelectedInstructor(null);
    setShowDetailModal(false);
  };

  // Thêm Instructor
  const handleShowAddInstructorModal = () => setShowAddInstructorModal(true);
  const handleCloseAddInstructorModal = () => setShowAddInstructorModal(false);

  // Chuyển trang
  const handlePageChange = (newPage) => setPage(newPage);

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" aria-label="Loading Instructors">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading instructors...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="danger">
        {error?.message || 'Failed to load instructors. Please try again later.'}
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Instructor List</h3>
        <Button
          variant="success"
          onClick={handleShowAddInstructorModal}
          aria-label="Add Instructor"
        >
          <FaPlus /> Add Instructor
        </Button>
      </div>

      {/* Filters */}
      <div className="filters mb-3 d-flex flex-wrap gap-3">
        <Form.Select
          aria-label="Filter by Status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </Form.Select>

        <InputGroup style={{ maxWidth: '300px' }}>
          <Form.Control
            placeholder="Search by First or Last Name"
            value={instructorFilter}
            onChange={(e) => {
              setInstructorFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Search First or Last Name"
          />
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
        </InputGroup>
      </div>

      {/* Danh sách instructors => Mỗi instructor 1 row => Col=12 */}
      {currentPageInstructors.length > 0 ? (
        currentPageInstructors.map((inst) => (
          <Row key={inst.id} className="mb-3">
            <Col xs={12}>
              <InstructorCard
                instructor={inst}
                onEdit={() => navigate(`/dashboard/instructor/edit/${inst.id}`)}
                onDelete={() => handleDeleteInstructor(inst.id)}
                onEnable={() => handleEnableInstructor(inst.id)}
                onDisable={() => handleDisableInstructor(inst.id)}
                onViewDetail={() => handleShowInstructorDetail(inst)}
              />
            </Col>
          </Row>
        ))
      ) : (
        <Alert variant="warning" className="text-center">
          No instructors found.
        </Alert>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous Page"
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next Page"
        >
          Next
        </Button>
      </div>

      {/* Modal AddInstructor */}
      <AddInstructorModal
        show={showAddInstructorModal}
        handleClose={handleCloseAddInstructorModal}
        accountId={null}
      />

      {/* Modal InstructorDetail */}
      {selectedInstructor && (
        <Modal
          show={showDetailModal}
          onHide={handleCloseInstructorDetail}
          size="lg"
          aria-labelledby="instructor-detail-modal"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="instructor-detail-modal">
              Instructor Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InstructorDetail instructor={selectedInstructor} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default InstructorList;
