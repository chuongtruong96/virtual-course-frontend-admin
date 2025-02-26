import React, { useState, useContext } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Spinner, 
  Alert, 
  Form, 
  InputGroup,
  Badge,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Modal
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  UserCheck,
  UserX,
  Eye,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  BarChart2
} from 'lucide-react';
import useStudent from '../../hooks/useStudents';
import { NotificationContext } from '../../contexts/NotificationContext';

const ListStudent = () => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const { students, isLoading, isError, error, refetch } = useStudent();

  // State for filters and search
  const [statusFilter, setStatusFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort students
  const filteredStudents = React.useMemo(() => {
    if (!students) return [];

    return students.filter(student => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const matchName = searchFilter ? fullName.includes(searchFilter.toLowerCase()) : true;
      const matchStatus = statusFilter ? student.statusStudent === statusFilter : true;
      const matchGender = genderFilter ? student.gender === genderFilter : true;
      const matchCategory = categoryFilter ? student.categoryPrefer === categoryFilter : true;

      return matchName && matchStatus && matchGender && matchCategory;
    }).sort((a, b) => {
      if (sortConfig.key === 'name') {
        const nameA = `${a.firstName} ${a.lastName}`;
        const nameB = `${b.firstName} ${b.lastName}`;
        return sortConfig.direction === 'asc' ? 
          nameA.localeCompare(nameB) : 
          nameB.localeCompare(nameA);
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [students, searchFilter, statusFilter, genderFilter, categoryFilter, sortConfig]);

  // Get current students for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // View student details
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading students...</span>
        </Spinner>
        <p className="mt-3">Loading students...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="danger" className="d-flex align-items-center">
        <AlertTriangle size={18} className="me-2" />
        {error?.message || 'Failed to load students'}
        <Button variant="link" onClick={() => refetch()} className="ms-auto">
          Try again
        </Button>
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title className="mb-0">Student Management</Card.Title>
            <small className="text-muted">
              Total Students: {filteredStudents.length}
            </small>
          </div>
          <Button 
            variant="outline-primary"
            onClick={() => navigate('/dashboard/student/statistics')}
          >
            <BarChart2 size={16} className="me-2" />
            Statistics
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        {/* Filters */}
        <Row className="mb-4 g-3">
          <Col md={6} lg={3}>
            <InputGroup>
              <InputGroup.Text>
                <Search size={18} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </InputGroup>
          </Col>

          <Col md={6} lg={3}>
            <Form.Select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Form.Select>
          </Col>

          <Col md={6} lg={3}>
            <Form.Select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Form.Select>
          </Col>

          <Col md={6} lg={3}>
            <Form.Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="PROGRAMMING">Programming</option>
              <option value="DESIGN">Design</option>
              <option value="BUSINESS">Business</option>
              <option value="MARKETING">Marketing</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Students Table */}
        <div className="table-responsive">
          <Table hover bordered>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                  Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Status</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '32px', 
                          height: '32px',
                          backgroundColor: '#e9ecef'
                        }}
                      >
                        <GraduationCap size={16} />
                      </div>
                      {student.firstName} {student.lastName}
                    </div>
                  </td>
                  <td>{student.email}</td>
                  <td>
                    <Badge bg={student.statusStudent === 'ACTIVE' ? 'success' : 'danger'}>
                      {student.statusStudent}
                    </Badge>
                  </td>
                  <td>
                    {student.verifiedPhone ? (
                      <UserCheck size={16} className="text-success" />
                    ) : (
                      <UserX size={16} className="text-danger" />
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>View Details</Tooltip>}
                      >
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleViewDetails(student)}
                        >
                          <Eye size={14} />
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div>
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of {filteredStudents.length} students
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Card.Body>

      {/* Student Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h5 className="mb-3">Personal Information</h5>
                  <p>
                    <GraduationCap size={16} className="me-2" />
                    <strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.lastName}
                  </p>
                  <p>
                    <Mail size={16} className="me-2" />
                    <strong>Email:</strong> {selectedStudent.email}
                  </p>
                  <p>
                    <Phone size={16} className="me-2" />
                    <strong>Phone:</strong> {selectedStudent.phone || 'Not provided'}
                  </p>
                  <p>
                    <Calendar size={16} className="me-2" />
                    <strong>Date of Birth:</strong> {selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString() : 'Not provided'}
                  </p>
                </Col>
                <Col md={6}>
                  <h5 className="mb-3">Additional Information</h5>
                  <p>
                    <MapPin size={16} className="me-2" />
                    <strong>Address:</strong> {selectedStudent.address || 'Not provided'}
                  </p>
                  <p>
                    <Filter size={16} className="me-2" />
                    <strong>Preferred Category:</strong> {selectedStudent.categoryPrefer || 'Not specified'}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={selectedStudent.statusStudent === 'ACTIVE' ? 'success' : 'danger'}>
                      {selectedStudent.statusStudent}
                    </Badge>
                  </p>
                  <p>
                    <strong>Phone Verified:</strong>{' '}
                    {selectedStudent.verifiedPhone ? (
                      <Badge bg="success">Yes</Badge>
                    ) : (
                      <Badge bg="warning">No</Badge>
                    )}
                  </p>
                </Col>
              </Row>
              {selectedStudent.bio && (
                <div>
                  <h5>Bio</h5>
                  <p>{selectedStudent.bio}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ListStudent;