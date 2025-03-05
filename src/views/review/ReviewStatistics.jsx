import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { FaFilter, FaDownload, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ReviewService from '../../services/reviewService';
import { NotificationContext } from '../../contexts/NotificationContext';
import { useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CSVLink } from 'react-csv';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const ReviewStatistics = () => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  
  // State for statistics data
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filters
  const [filters, setFilters] = useState({
    courseId: '',
    instructorId: '',
    startDate: null,
    endDate: null,
  });
  
  // State for available courses and instructors (for dropdowns)
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  
  // CSV export data
  const [csvData, setCsvData] = useState([]);
  const [recentComments, setRecentComments] = useState([]);
  // Fetch statistics with filters
  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Construct query parameters
      const params = new URLSearchParams();
      if (filters.courseId) params.append('courseId', filters.courseId);
      if (filters.instructorId) params.append('instructorId', filters.instructorId);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString().split('T')[0]);
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString().split('T')[0]);
      
      const response = await ReviewService.fetchReviewStatistics(params);
      setStatistics(response);
      
      // Prepare CSV data for export
      prepareCSVData(response);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching review statistics:', err);
      setError('Failed to load review statistics. Please try again.');
      setLoading(false);
      addNotification('Failed to load review statistics. Please try again.', 'danger');
    }
  };
  // Thêm hàm này sau hàm fetchStatistics
const fetchRecentComments = async () => {
  setLoading(true);
  try {
    // Construct query parameters
    const params = new URLSearchParams();
    if (filters.courseId) params.append('courseId', filters.courseId);
    if (filters.instructorId) params.append('instructorId', filters.instructorId);
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString().split('T')[0]);
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString().split('T')[0]);
    
    // Thêm tham số để lấy các comment gần đây
    params.append('page', '0');
    params.append('size', '10');
    params.append('sort', 'createdAt,desc');
    
    const response = await ReviewService.fetchAllReviews(params);
    
    // Kiểm tra cấu trúc response và lấy dữ liệu phù hợp
    const comments = response.content || response.reviews || response;
    setRecentComments(Array.isArray(comments) ? comments : []);
    
    setLoading(false);
  } catch (err) {
    console.error('Error fetching recent comments:', err);
    setLoading(false);
    addNotification('Failed to load recent comments. Please try again.', 'warning');
  }
};
  // Fetch courses and instructors for filter dropdowns
  const fetchFilterOptions = async () => {
    try {
      // These would be actual API calls to your backend
      const coursesResponse = await ReviewService.fetchCourses();
      const instructorsResponse = await ReviewService.fetchInstructors();
      
      setCourses(coursesResponse || []);
      setInstructors(instructorsResponse || []);
    } catch (err) {
      console.error('Error fetching filter options:', err);
      addNotification('Failed to load filter options. Please try again.', 'warning');
    }
  };
  
  // Prepare CSV data for export
  const prepareCSVData = (stats) => {
    if (!stats) return;
    
    const data = [
      ['Metric', 'Value'],
      ['Total Reviews', stats.totalReviews || 0],
      ['Average Rating', stats.averageRating ? stats.averageRating.toFixed(2) : '0.00'],
      ['5 Star Reviews', stats.ratingDistribution?.[5] || 0],
      ['4 Star Reviews', stats.ratingDistribution?.[4] || 0],
      ['3 Star Reviews', stats.ratingDistribution?.[3] || 0],
      ['2 Star Reviews', stats.ratingDistribution?.[2] || 0],
      ['1 Star Reviews', stats.ratingDistribution?.[1] || 0],
    ];
    
    // Add monthly data if available
    if (stats.monthlyReviews) {
      data.push(['', '']);
      data.push(['Month', 'Number of Reviews', 'Average Rating']);
      
      Object.entries(stats.monthlyReviews).forEach(([month, monthData]) => {
        data.push([month, monthData.count || 0, monthData.averageRating ? monthData.averageRating.toFixed(2) : '0.00']);
      });
    }
    
    setCsvData(data);
  };
  
  useEffect(() => {
    fetchStatistics();
    fetchFilterOptions();
    if (filters.courseId || filters.instructorId || filters.startDate || filters.endDate) {
      fetchRecentComments();
    }  }, [filters.courseId, filters.instructorId, filters.startDate, filters.endDate]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (date, name) => {
    setFilters(prev => ({
      ...prev,
      [name]: date
    }));
  };
  
  const applyFilters = (e) => {
    e.preventDefault();
    fetchStatistics();
  };
  
  const resetFilters = () => {
    setFilters({
      courseId: '',
      instructorId: '',
      startDate: null,
      endDate: null,
    });
    fetchStatistics();
  };
  
  // Prepare chart data for rating distribution
  const ratingDistributionData = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [
      {
        label: 'Number of Reviews',
        data: [
          statistics?.ratingDistribution?.[5] || 0,
          statistics?.ratingDistribution?.[4] || 0,
          statistics?.ratingDistribution?.[3] || 0,
          statistics?.ratingDistribution?.[2] || 0,
          statistics?.ratingDistribution?.[1] || 0,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare chart data for monthly reviews
  const monthlyReviewsData = {
    labels: statistics?.monthlyReviews ? Object.keys(statistics.monthlyReviews) : [],
    datasets: [
      {
        label: 'Number of Reviews',
        data: statistics?.monthlyReviews ? Object.values(statistics.monthlyReviews).map(data => data?.count || 0) : [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare chart data for monthly average ratings
  const monthlyRatingsData = {
    labels: statistics?.monthlyReviews ? Object.keys(statistics.monthlyReviews) : [],
    datasets: [
      {
        label: 'Average Rating',
        data: statistics?.monthlyReviews ? Object.values(statistics.monthlyReviews).map(data => data?.averageRating || 0) : [],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };
  
  return (
    <div className="review-statistics">
      <Card className="mb-4">
        <Card.Header as="h5">
          <div className="d-flex justify-content-between align-items-center">
            <span>Review Statistics</span>
            <Button variant="primary" onClick={() => navigate('/dashboard/reviews')}>
              <FaArrowLeft className="me-2" /> Back to Reviews
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={applyFilters}>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Course</Form.Label>
                  <Form.Select
                    name="courseId"
                    value={filters.courseId}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.titleCourse || course.title || `Course ${course.id}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Instructor</Form.Label>
                  <Form.Select
                    name="instructorId"
                    value={filters.instructorId}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Instructors</option>
                    {instructors.map(instructor => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.firstName && instructor.lastName 
                          ? `${instructor.firstName} ${instructor.lastName}`
                          : `Instructor ${instructor.id}`}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
  <Form.Group>
    <Form.Label>Start Date</Form.Label>
    <DatePicker
      selected={filters.startDate}
      onChange={(date) => handleDateChange(date, 'startDate')}
      className="form-control"
      dateFormat="yyyy-MM-dd"
      placeholderText="Select start date"
      maxDate={filters.endDate || new Date()}
    />
  </Form.Group>
</Col>
<Col md={2}>
  <Form.Group>
    <Form.Label>End Date</Form.Label>
    <DatePicker
      selected={filters.endDate}
      onChange={(date) => handleDateChange(date, 'endDate')}
      className="form-control"
      dateFormat="yyyy-MM-dd"
      placeholderText="Select end date"
      minDate={filters.startDate}
      maxDate={new Date()}
    />
  </Form.Group>
</Col>
<Col md={2} className="d-flex align-items-end">
  <Button type="submit" variant="primary" className="me-2">
    <FaFilter className="me-1" /> Apply
  </Button>
  <Button variant="secondary" onClick={resetFilters}>
    Reset
  </Button>
</Col>
</Row>
</Form>

{loading ? (
  <div className="text-center my-5">
    <Spinner animation="border" role="status" aria-label="Loading Statistics">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    <p className="mt-3">Loading statistics...</p>
  </div>
) : error ? (
  <Alert variant="danger">{error}</Alert>
) : statistics ? (
  <>
    {/* Summary Cards */}
    <Row className="mb-4">
      <Col md={3}>
        <Card className="text-center h-100">
          <Card.Body>
            <h3 className="mb-0">{statistics.totalReviews || 0}</h3>
            <Card.Text>Total Reviews</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center h-100">
          <Card.Body>
            <h3 className="mb-0">{statistics.averageRating ? statistics.averageRating.toFixed(1) : '0.0'}</h3>
            <Card.Text>Average Rating</Card.Text>
            <div className="text-warning">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ fontSize: '1.2rem' }}>
                  {i < Math.round(statistics.averageRating || 0) ? '★' : '☆'}
                </span>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center h-100">
          <Card.Body>
            <h3 className="mb-0">{statistics.totalPositiveReviews || 0}</h3>
            <Card.Text>Positive Reviews (4-5 ★)</Card.Text>
            <div className="text-success">
              {statistics.totalReviews ? ((statistics.totalPositiveReviews || 0) / statistics.totalReviews * 100).toFixed(1) : '0.0'}%
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center h-100">
          <Card.Body>
            <h3 className="mb-0">{statistics.totalNegativeReviews || 0}</h3>
            <Card.Text>Negative Reviews (1-2 ★)</Card.Text>
            <div className="text-danger">
              {statistics.totalReviews ? ((statistics.totalNegativeReviews || 0) / statistics.totalReviews * 100).toFixed(1) : '0.0'}%
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    
   {/* Charts */}
<Row className="mb-4">
  <Col md={6}>
    <Card className="h-100">
      <Card.Header>Rating Distribution</Card.Header>
      <Card.Body style={{ height: '300px' }}>  {/* Thêm chiều cao cố định */}
        <Bar 
          data={ratingDistributionData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0 // Chỉ hiển thị số nguyên
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: false,
              }
            }
          }} 
        />
      </Card.Body>
    </Card>
  </Col>
  <Col md={6}>
    <Card className="h-100">
      <Card.Header>Rating Distribution (%)</Card.Header>
      <Card.Body style={{ height: '300px' }}>  {/* Thêm chiều cao cố định */}
        <Pie 
          data={ratingDistributionData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              }
            }
          }} 
        />
      </Card.Body>
    </Card>
  </Col>
</Row>

{/* Monthly Trends */}
<Row className="mb-4">
  <Col md={6}>
    <Card className="h-100">
      <Card.Header>Monthly Review Count</Card.Header>
      <Card.Body style={{ height: '300px' }}>  {/* Thêm chiều cao cố định */}
        <Bar 
          data={monthlyReviewsData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              }
            }
          }} 
        />
      </Card.Body>
    </Card>
  </Col>
  <Col md={6}>
    <Card className="h-100">
      <Card.Header>Monthly Average Rating</Card.Header>
      <Card.Body style={{ height: '300px' }}>  {/* Thêm chiều cao cố định */}
        <Line 
          data={monthlyRatingsData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
              y: {
                min: 0,
                max: 5,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }} 
        />
      </Card.Body>
    </Card>
  </Col>
</Row>
    
    {/* Top Courses and Instructors */}
    {statistics.topCourses && statistics.topCourses.length > 0 && (
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>Top Rated Courses</Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Rating</th>
                      <th>Reviews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.topCourses.map((course, index) => (
                      <tr key={index}>
                        <td>{course.title || `Course ${course.id}`}</td>
                        <td>
                          <span className="text-warning">{course.averageRating ? course.averageRating.toFixed(1) : '0.0'}</span>
                          <span className="ms-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>
                                {i < Math.round(course.averageRating || 0) ? '★' : '☆'}
                              </span>
                            ))}
                          </span>
                        </td>
                        <td>{course.reviewCount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>Top Rated Instructors</Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Instructor</th>
                      <th>Rating</th>
                      <th>Reviews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.topInstructors && statistics.topInstructors.map((instructor, index) => (
                      <tr key={index}>
                        <td>{instructor.title || instructor.name || `Instructor ${instructor.id}`}</td>
                        <td>
                          <span className="text-warning">{instructor.averageRating ? instructor.averageRating.toFixed(1) : '0.0'}</span>
                          <span className="ms-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i}>
                                {i < Math.round(instructor.averageRating || 0) ? '★' : '☆'}
                              </span>
                            ))}
                          </span>
                        </td>
                        <td>{instructor.reviewCount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )}
    {/* Recent Comments Section */}
{/* Recent Comments Section - Phiên bản thay thế với card riêng cho mỗi comment */}
{!loading && !error && recentComments.length > 0 && (
  <div className="mb-4">
    <h5 className="mb-3">Recent Comments</h5>
    <Row>
      {recentComments.map((comment, index) => (
        <Col md={4} key={index} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <div>
                  <strong>{comment.studentName || `Student ${comment.studentId}`}</strong>
                </div>
                <div className="text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {i < Math.round(comment.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
              <Card.Subtitle className="mb-2 text-muted">
                {comment.courseTitle || `Course ${comment.courseId}`}
              </Card.Subtitle>
              <Card.Text>{comment.comment}</Card.Text>
              <div className="text-muted small">
                {new Date(comment.createdAt).toLocaleDateString()}
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
)}
    {/* Export Button */}
    <div className="text-end mb-3">
      {csvData.length > 0 && (
        <CSVLink
          data={csvData}
          filename={`review-statistics-${new Date().toISOString().split('T')[0]}.csv`}
          className="btn btn-success"
        >
          <FaDownload className="me-2" /> Export to CSV
        </CSVLink>
      )}
    </div>
  </>
) : (
  <Alert variant="info">No statistics available. Try adjusting your filters.</Alert>
)}
</Card.Body>
</Card>
</div>
);
};

export default ReviewStatistics;