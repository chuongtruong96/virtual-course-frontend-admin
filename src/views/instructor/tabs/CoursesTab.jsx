import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import { Search, Eye, BookOpen } from 'lucide-react';

/**
 * CoursesTab component displays a list of courses taught by an instructor
 * with filtering and pagination capabilities.
 * 
 * @param {Object} props
 * @param {Array} props.courses - Array of course objects
 * @param {boolean} props.isLoading - Loading state indicator
 * @param {Function} props.onViewCourse - Callback function when View Course button is clicked
 * @returns {JSX.Element}
 */
const CoursesTab = ({ courses = [], isLoading = false, onViewCourse }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Ensure courses is an array before filtering
  const coursesArray = Array.isArray(courses) ? courses : [];

  // Filter courses based on search term
  const filteredCourses = coursesArray.filter(course => 
    course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course?.courseCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current page of courses
  const currentCourses = filteredCourses
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Status chip color mapping
  const statusColors = {
    active: 'success',
    pending: 'warning',
    completed: 'info',
    cancelled: 'error',
    draft: 'default'
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2">
            <BookOpen size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Instructor Courses
          </Typography>
          
          <TextField
            size="small"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {coursesArray.length === 0 ? (
          <Box py={4} textAlign="center">
            <Typography color="textSecondary">
              No courses found for this instructor.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Code</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Students</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.courseCode}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {course.title}
                        </Typography>
                      </TableCell>
                      <TableCell>{course.studentCount}</TableCell>
                      <TableCell>
                        {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={course.status} 
                          size="small"
                          color={statusColors[course.status?.toLowerCase()] || 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          startIcon={<Eye size={16} />}
                          onClick={() => onViewCourse(course.id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredCourses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CoursesTab;