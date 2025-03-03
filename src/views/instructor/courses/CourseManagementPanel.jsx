// src/components/instructor/CourseManagementPanel.jsx
// (Updated version with new features)
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  TextField,
  Pagination,
  Avatar
} from '@mui/material';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useInstructorCourses } from '../../hooks/useInstructorCourses';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const CourseManagementPanel = ({ instructorId }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const {
    courses,
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePageChange,
    updateCourseStatus,
    deleteCourse
  } = useInstructorCourses(instructorId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    try {
      await deleteCourse(selectedCourse.id);
      setDeleteDialogOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Course Management</Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => window.location.href = '/instructor/courses/create'}
          >
            Create New Course
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Revenue</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={course.thumbnail}
                        variant="rounded"
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {course.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {course.category}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={course.status}
                      color={
                        course.status === 'PUBLISHED' ? 'success' :
                        course.status === 'DRAFT' ? 'default' :
                        'warning'
                      }
                    />
                  </TableCell>
                  <TableCell>{course.enrolledStudents}</TableCell>
                  <TableCell>{course.averageRating.toFixed(1)}</TableCell>
                  <TableCell>${course.revenue.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => window.location.href = `/courses/${course.id}`}
                    >
                      <Eye size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => window.location.href = `/instructor/courses/edit/${course.id}`}
                    >
                      <Edit size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedCourse(course);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={(e, page) => handlePageChange(page - 1)}
          />
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Course</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedCourse?.title}"?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteCourse}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CourseManagementPanel;