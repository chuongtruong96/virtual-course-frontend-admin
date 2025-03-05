import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
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
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Tooltip
} from '@mui/material';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import ENDPOINTS from '../../config/endpoints'; // Import ENDPOINTS

const InstructorTestManagement = ({ instructorId }) => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const queryClient = useQueryClient();

   // Fetch instructor tests - Sử dụng ENDPOINTS thay vì hardcode URL
   const { data: tests, isLoading, error } = useQuery({
    queryKey: ['instructor-tests-admin', instructorId],
    queryFn: async () => {
      // Sử dụng endpoint từ file cấu hình
      const response = await api.get(ENDPOINTS.INSTRUCTORS.TESTS(instructorId));
      return response.data;
    },
    enabled: !!instructorId,
    onError: (error) => {
      console.error("Failed to fetch instructor tests:", error);
    }
  });

  // Update test status mutation
  const updateTestStatus = useMutation({
    mutationFn: async ({ testId, status }) => {
      // Sử dụng endpoint từ file cấu hình
      const response = await api.put(ENDPOINTS.TESTS.UPDATE_STATUS(testId), { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-tests-admin', instructorId] });
    },
    onError: (error) => {
      console.error("Failed to update test status:", error);
    }
  });

  const handlePreviewTest = (test) => {
    setSelectedTest(test);
    setPreviewDialogOpen(true);
  };

  const handleUpdateTestStatus = async (testId, status) => {
    try {
      await updateTestStatus.mutateAsync({ testId, status });
    } catch (error) {
      console.error("Failed to update test status:", error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading tests: {error.message}
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Test & Quiz Management</Typography>
          
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
                {tests && tests.length > 0 ? (
                  tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>{test.title}</TableCell>
                      <TableCell>{test.courseName}</TableCell>
                      <TableCell>
                        <Chip
                          label={test.statusTest}
                          color={
                            test.statusTest === 'ACTIVE' ? 'success' :
                            test.statusTest === 'INACTIVE' ? 'default' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{test.questions?.length || 0}</TableCell>
                      <TableCell>{test.duration} min</TableCell>
                      <TableCell>{test.passPercentage}%</TableCell>
                      <TableCell>
                        <Box display="flex">
                          <Tooltip title="Preview Test">
                            <IconButton size="small" onClick={() => handlePreviewTest(test)}>
                              <Eye size={18} />
                            </IconButton>
                          </Tooltip>
                          
                          {test.statusTest === 'INACTIVE' ? (
                            <Tooltip title="Activate Test">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => handleUpdateTestStatus(test.id, 'ACTIVE')}
                              >
                                <CheckCircle size={18} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Deactivate Test">
                              <IconButton 
                                size="small" 
                                color="warning"
                                onClick={() => handleUpdateTestStatus(test.id, 'INACTIVE')}
                              >
                                <XCircle size={18} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="textSecondary" py={2}>
                        No tests found for this instructor.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Test Preview Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          Test Preview: {selectedTest?.title}
        </DialogTitle>
        <DialogContent>
          {selectedTest && (
            <>
              <Box mb={3}>
                <Typography variant="subtitle1">Test Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Duration:</strong> {selectedTest.duration} minutes
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total Marks:</strong> {selectedTest.totalMarks}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Pass Percentage:</strong> {selectedTest.passPercentage}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Status:</strong> {selectedTest.statusTest}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Course:</strong> {selectedTest.courseName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Final Test:</strong> {selectedTest.isFinalTest ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                </Grid>
                {selectedTest.description && (
                  <Box mt={2}>
                    <Typography variant="body2">
                      <strong>Description:</strong>
                    </Typography>
                    <Typography variant="body2">{selectedTest.description}</Typography>
                  </Box>
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Questions ({selectedTest.questions?.length || 0})
              </Typography>
              
              {selectedTest.questions?.length > 0 ? (
                selectedTest.questions.map((question, index) => (
                  <Card key={question.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="subtitle2">
                          Question {index + 1}: {question.content}
                        </Typography>
                        <Chip 
                          label={`${question.marks} ${question.marks > 1 ? 'marks' : 'mark'}`}
                          size="small"
                          color="primary"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Type: {question.type}
                      </Typography>
                      
                      <List dense>
                        {question.answerOptions?.map((option) => (
                          <ListItem key={option.id}>
                            <ListItemIcon>
                              {option.isCorrect ? (
                                <CheckCircle size={16} color="green" />
                              ) : (
                                <XCircle size={16} color="red" />
                              )}
                            </ListItemIcon>
                            <ListItemText primary={option.content} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Alert severity="info">No questions have been added to this test.</Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          {selectedTest && (
            <Button
              variant="contained"
              color={selectedTest.statusTest === 'ACTIVE' ? 'warning' : 'success'}
              onClick={() => {
                handleUpdateTestStatus(
                  selectedTest.id, 
                  selectedTest.statusTest === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                );
                setPreviewDialogOpen(false);
              }}
            >
              {selectedTest.statusTest === 'ACTIVE' ? 'Deactivate Test' : 'Activate Test'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InstructorTestManagement;