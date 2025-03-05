// src/components/instructor/TestManagementPanel.jsx
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
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { useInstructorTests } from '../../hooks/useInstructorTests';

const TestManagementPanel = ({ instructorId }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  // Sử dụng hook useInstructorTests
  const {
    tests,
    totalPages,
    currentPage,
    isLoading,
    error,
    handlePageChange,
    updateTestStatus,
    deleteTest
  } = useInstructorTests(instructorId);

  // Xử lý khi thay đổi trạng thái bài kiểm tra
  const handleStatusChange = async (testId, newStatus) => {
    try {
      await updateTestStatus({ testId, status: newStatus });
    } catch (error) {
      console.error('Error updating test status:', error);
    }
  };

  // Xử lý khi xác nhận xóa bài kiểm tra
  const handleDeleteConfirm = async () => {
    if (!selectedTest) return;
    try {
      await deleteTest(selectedTest.id);
      setDeleteDialogOpen(false);
      setSelectedTest(null);
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  // Hiển thị loading spinner khi đang tải dữ liệu
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">
          Error loading tests: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Test Management</Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => window.location.href = '/instructor/tests/create'}
          >
            Create New Test
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Test Title</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Questions</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Pass %</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.length > 0 ? (
                tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.title}</TableCell>
                    <TableCell>{test.courseName}</TableCell>
                    <TableCell>
                      <Chip
                        label={test.status}
                        color={test.status === 'ACTIVE' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{test.questionCount || 0}</TableCell>
                    <TableCell>{test.duration} min</TableCell>
                    <TableCell>{test.passPercentage}%</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Test">
                          <IconButton
                            size="small"
                            onClick={() => window.location.href = `/instructor/tests/${test.id}`}
                          >
                            <Eye size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Test">
                          <IconButton
                            size="small"
                            onClick={() => window.location.href = `/instructor/tests/edit/${test.id}`}
                          >
                            <Edit size={18} />
                          </IconButton>
                        </Tooltip>
                        {test.status === 'INACTIVE' ? (
                          <Tooltip title="Activate Test">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleStatusChange(test.id, 'ACTIVE')}
                            >
                              <CheckCircle size={18} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Deactivate Test">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => handleStatusChange(test.id, 'INACTIVE')}
                            >
                              <XCircle size={18} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete Test">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              setSelectedTest(test);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="textSecondary" py={2}>
                      No tests found. Create your first test to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={currentPage + 1}
              onChange={(e, page) => handlePageChange(page - 1)}
              color="primary"
            />
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Test</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedTest?.title}"?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TestManagementPanel;