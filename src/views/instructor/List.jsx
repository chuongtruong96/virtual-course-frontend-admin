import React, { useState, useEffect } from 'react';
import { fetchInstructors, deleteInstructors, enableInstructor, disableInstructor } from '../../services/instructorService';
import { Row, Col, Card, Table, Button, Spinner, Alert, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../styles/table.css'; // Import your custom CSS

const ListInstructor = () => {
  const [instructorData, setInstructorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [genderFilter, setGenderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    firstName: true,
    lastName: true,
    gender: true,
    status: true,
    phone: true,
    bio: true,
    photo: true,
    title: true,
    workplace: true
  });

  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Fetch instructors on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchInstructors();
        setInstructorData(data);
      } catch (error) {
        setNotification({
          message: 'Failed to load instructors. Please try again later.',
          type: 'danger'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle delete instructor
  const handleDeleteInstructor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this instructor?')) return;
    try {
      await deleteInstructor(id);
      setInstructorData((prevData) => prevData.filter((instructor) => instructor.id !== id));
      setNotification({
        message: 'Instructor deleted successfully!',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to delete instructor. Please try again.',
        type: 'danger'
      });
    }
  };

  // Handle enable instructor
  const handleEnableInstructor = async (id) => {
    try {
      await enableInstructor(id);
      setInstructorData((prevData) =>
        prevData.map((instructor) => (instructor.id === id ? { ...instructor, status: 'ACTIVE' } : instructor))
      );
      setNotification({
        message: 'Instructor enabled successfully!',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to enable instructor. Please try again.',
        type: 'danger'
      });
    }
  };

  // Handle disable instructor
  const handleDisableInstructor = async (id) => {
    try {
      await disableInstructor(id);
      setInstructorData((prevData) =>
        prevData.map((instructor) => (instructor.id === id ? { ...instructor, status: 'INACTIVE' } : instructor))
      );
      setNotification({
        message: 'Instructor disabled successfully!',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: 'Failed to disable instructor. Please try again.',
        type: 'danger'
      });
    }
  };

  // Filter instructors based on gender, status, and name
  const filteredInstructors = instructorData.filter((instructor) => {
    const matchesGender = genderFilter ? instructor.gender === genderFilter : true;
    const matchesStatus = statusFilter ? instructor.status === statusFilter : true;
    const matchesName = instructorFilter
      ? `${instructor.firstName} ${instructor.lastName}`.toLowerCase().includes(instructorFilter.toLowerCase())
      : true;
    return matchesGender && matchesStatus && matchesName;
  });

  // Sorting functionality
  const handleSort = (column, order) => {
    const sortedInstructors = [...filteredInstructors].sort((a, b) => {
      if (column === 'firstName' || column === 'lastName') {
        return order === 'asc' ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column]);
      } else if (column === 'phone') {
        return order === 'asc' ? a[column] - b[column] : b[column] - a[column];
      }
      return 0;
    });
    setInstructorData(sortedInstructors);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const currentPageInstructors = filteredInstructors.slice(startIndex, startIndex + itemsPerPage);

  // Handle column visibility toggle
  const handleColumnVisibility = (column) => {
    setVisibleColumns((prevState) => ({
      ...prevState,
      [column]: !prevState[column]
    }));
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Loading instructors...</p>
      </div>
    );
  }

  return (
    <Row>
      <Col>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Instructor List</Card.Title>
            {/* Column visibility dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Columns
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.keys(visibleColumns).map((column) => (
                  <Dropdown.Item key={column} onClick={() => handleColumnVisibility(column)}>
                    {visibleColumns[column] ? `Hide ${column}` : `Show ${column}`}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>
          <Card.Body>
            {/* Display notifications */}
            {notification && <Alert variant={notification.type}>{notification.message}</Alert>}

            {/* Filters */}
            <div className="filters">
              <select onChange={(e) => setGenderFilter(e.target.value)} value={genderFilter}>
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              <input type="text" placeholder="Search Name" value={instructorFilter} onChange={(e) => setInstructorFilter(e.target.value)} />
            </div>

            {/* Sorting Controls */}
            <div>
              <button onClick={() => handleSort('firstName', 'asc')}>Sort First Name A-Z</button>
              <button onClick={() => handleSort('firstName', 'desc')}>Sort First Name Z-A</button>
              <button onClick={() => handleSort('lastName', 'asc')}>Sort Last Name A-Z</button>
              <button onClick={() => handleSort('lastName', 'desc')}>Sort Last Name Z-A</button>
            </div>

            {/* Table */}
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  {visibleColumns.firstName && <th>First Name</th>}
                  {visibleColumns.lastName && <th>Last Name</th>}
                  {visibleColumns.gender && <th>Gender</th>}
                  {visibleColumns.phone && <th>Phone</th>}
                  {visibleColumns.bio && <th>Bio</th>}
                  {visibleColumns.photo && <th>Photo</th>}
                  {visibleColumns.title && <th>Title</th>}
                  {visibleColumns.workplace && <th>Workplace</th>}
                  {visibleColumns.status && <th>Status</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPageInstructors.length > 0 ? (
                  currentPageInstructors.map((instructor) => (
                    <tr key={instructor.id}>
                      {visibleColumns.firstName && <td>{instructor.firstName}</td>}
                      {visibleColumns.lastName && <td>{instructor.lastName}</td>}
                      {visibleColumns.gender && <td>{instructor.gender}</td>}
                      {visibleColumns.phone && <td>{instructor.phone}</td>}
                      {visibleColumns.bio && <td>{instructor.bio}</td>}
                      {visibleColumns.photo && (
                        <td>
                          {instructor.photo && (
                            // <img src={instructor.photo} alt="Cover" className="img-thumbnail" />
                            <img src={`http://localhost:8080/uploads/instructor/${instructor.photo}`} alt="Instructor Photo" className="img-thumbnail" />
                            // <img src={`/uploads/instructor/${instructor.photo}`} alt="Instructor Photo" className="img-thumbnail" />

                          )}
                        </td>
                      )}
                      {visibleColumns.title && <td>{instructor.title}</td>}
                      {visibleColumns.workplace && <td>{instructor.workplace}</td>}
                      {visibleColumns.status && (
                        <td>
                          <span className={`badge ${instructor.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                            {instructor.status}
                          </span>
                        </td>
                      )}
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => navigate(`/instructors/edit/${instructor.id}`)}
                          style={{ marginRight: '10px' }}
                        >
                          Edit
                        </Button>
                        {instructor.status === 'ACTIVE' ? (
                          <Button variant="secondary" onClick={() => handleDisableInstructor(instructor.id)}>
                            Disable
                          </Button>
                        ) : (
                          <Button variant="success" onClick={() => handleEnableInstructor(instructor.id)}>
                            Enable
                          </Button>
                        )}
                        <Button variant="danger" onClick={() => handleDeleteInstructor(instructor.id)} style={{ marginLeft: '10px' }}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No instructors found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination Controls */}
            <div className="pagination-controls">
              <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                Previous
              </Button>
              <span>{`Page ${page}`}</span>
              <Button onClick={() => handlePageChange(page + 1)} disabled={page * itemsPerPage >= filteredInstructors.length}>
                Next
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ListInstructor;
