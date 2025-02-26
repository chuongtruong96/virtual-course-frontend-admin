import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Tooltip
} from 'react-bootstrap';
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  DollarSign, 
  BookOpen, 
  Award,
  BarChart2
} from 'lucide-react';
import { NotificationContext } from '../../contexts/NotificationContext';
import useCourses from '../../hooks/useCourses';

const ListCourse = ({ instructorId: propInstructorId }) => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const routeParams = useParams();
  const routeInstructorId = routeParams.instructorId;
  const instructorId = propInstructorId ?? routeInstructorId;

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: 'titleCourse',
    direction: 'asc'
  });

  // State for filtering and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    level: '',
    category: '',
    priceRange: '',
    status: '',
    duration: ''
  });

  const { courses, isLoading, isError, error } = useCourses('all');


  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Format duration with proper units
  const formatDuration = (hours) => {
    if (!hours) return 'N/A';
    return hours === 1 ? '1 hour' : `${hours} hours`;
  };

  // Get badge variant based on status
  const getStatusBadgeVariant = (status) => {
    const variants = {
      'ACTIVE': 'success',
      'PENDING': 'warning',
      'REJECTED': 'danger',
      'DRAFT': 'secondary',
      'ARCHIVED': 'dark'
    };
    return variants[status?.toUpperCase()] || 'secondary';
  };

  // Get level badge color
  const getLevelBadgeVariant = (level) => {
    const variants = {
      'BEGINNER': 'info',
      'INTERMEDIATE': 'primary',
      'ADVANCED': 'danger',
      'ALL LEVELS': 'success'
    };
    return variants[level?.toUpperCase()] || 'secondary';
  };

  // Filter courses based on search and filters
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = 
      course.titleCourse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = !filters.level || course.level === filters.level;
    const matchesCategory = !filters.category || course.categoryName === filters.category;
    const matchesStatus = !filters.status || course.status === filters.status;
    
    let matchesPriceRange = true;
    if (filters.priceRange) {
      const price = parseFloat(course.basePrice);
      const ranges = {
        'under50': price < 50,
        '50to100': price >= 50 && price <= 100,
        '100to200': price > 100 && price <= 200,
        'over200': price > 200
      };
      matchesPriceRange = ranges[filters.priceRange];
    }

    let matchesDuration = true;
    if (filters.duration) {
      const duration = parseInt(course.duration);
      const ranges = {
        'short': duration <= 5,
        'medium': duration > 5 && duration <= 10,
        'long': duration > 10
      };
      matchesDuration = ranges[filters.duration];
    }

    return matchesSearch && matchesLevel && matchesCategory && 
           matchesStatus && matchesPriceRange && matchesDuration;
  });

  // Sort courses
  const sortedCourses = [...(filteredCourses || [])].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Get current courses for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get unique values for filters
  const uniqueCategories = [...new Set(courses?.map(course => course.categoryName) || [])];
  const uniqueLevels = [...new Set(courses?.map(course => course.level) || [])];

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading courses...</span>
        </Spinner>
        <p className="mt-3">Loading courses...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="danger">
        {error?.message || 'Failed to load courses. Please try again later.'}
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title as="h4">
            Course List {instructorId ? `(Instructor ${instructorId})` : ''}
          </Card.Title>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => navigate('/dashboard/course/statistics')}
            >
              <BarChart2 size={16} className="me-1" />
              Statistics
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {/* Search and Filters */}
        <Row className="mb-4 g-3">
          <Col md={6} lg={4}>
            <InputGroup>
              <InputGroup.Text>
                <Search size={18} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={6} lg={2}>
            <Form.Select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
            >
              <option value="">All Levels</option>
              {uniqueLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6} lg={2}>
            <Form.Select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6} lg={2}>
            <Form.Select
              value={filters.priceRange}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
            >
              <option value="">All Prices</option>
              <option value="under50">Under $50</option>
              <option value="50to100">$50 - $100</option>
              <option value="100to200">$100 - $200</option>
              <option value="over200">Over $200</option>
            </Form.Select>
          </Col>
          <Col md={6} lg={2}>
            <Form.Select
              value={filters.duration}
              onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
            >
              <option value="">All Durations</option>
              <option value="short">Short (0-5 hours)</option>
              <option value="medium">Medium (6-10 hours)</option>
              <option value="long">Long (10+ hours)</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Courses Table */}
        {currentCourses.length > 0 ? (
          <>
            <div className="table-responsive">
              <Table hover bordered className="align-middle">
                <thead>
                  <tr>
                    <th style={{ cursor: 'pointer' }} onClick={() => requestSort('titleCourse')}>
                      <div className="d-flex align-items-center">
                        <BookOpen size={16} className="me-2" />
                        Title
                        {sortConfig.key === 'titleCourse' && (
                          <span className="ms-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th>Category</th>
                    <th>Level</th>
                    <th style={{ cursor: 'pointer' }} onClick={() => requestSort('basePrice')}>
                      <div className="d-flex align-items-center">
                        <DollarSign size={16} className="me-2" />
                        Price
                        {sortConfig.key === 'basePrice' && (
                          <span className="ms-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center">
                        <Clock size={16} className="me-2" />
                        Duration
                      </div>
                    </th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCourses.map((course) => (
                    <tr key={course.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="ms-2">{course.titleCourse}</span>
                        </div>
                      </td>
                      <td>{course.categoryName}</td>
                      <td>
                        <Badge bg={getLevelBadgeVariant(course.level)}>
                          {course.level}
                        </Badge>
                      </td>
                      <td>{formatPrice(course.basePrice)}</td>
                      <td>{formatDuration(course.duration)}</td>
                      <td>
                        <Badge bg={getStatusBadgeVariant(course.status)}>
                          {course.status}
                        </Badge>
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
                              onClick={() => navigate(`/dashboard/course/detail/${course.id}`)}
                            >
                              <Eye size={16} />
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
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedCourses.length)} of {sortedCourses.length} courses
              </div>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="me-2"
                >
                  Previous
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={indexOfLastItem >= sortedCourses.length}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Alert variant="info">
            No courses found {searchTerm ? 'matching your search criteria' : ''}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default ListCourse;