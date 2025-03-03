// src/components/instructor/ReviewManagementPanel.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
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
  TextField,
  Rating,
  Avatar,
  Pagination,
  Grid
} from '@mui/material';
import { Eye, MessageSquare, Calendar } from 'lucide-react';
import { useInstructorReviews } from '../../hooks/useInstructorReviews';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { format } from 'date-fns';

const ReviewManagementPanel = ({ instructorId }) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  const {
    reviews,
    totalPages,
    currentPage,
    isLoading,
    error,
    filters,
    handlePageChange,
    filterByRating,
    replyToReview
  } = useInstructorReviews(instructorId);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setViewDialogOpen(true);
  };

  const handleReplyToReview = (review) => {
    setSelectedReview(review);
    setReplyText(review.reply || '');
    setReplyDialogOpen(true);
  };

  const handleSubmitReply = async () => {
    if (!selectedReview) return;
    try {
      await replyToReview({
        reviewId: selectedReview.id,
        reply: replyText
      });
      setReplyDialogOpen(false);
      setReplyText('');
      setSelectedReview(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Review Management</Typography>
          <Box>
            <Chip
              label="All Ratings"
              color={filters.rating === '' ? 'primary' : 'default'}
              onClick={() => filterByRating('')}
              sx={{ mr: 1 }}
            />
            {[5, 4, 3, 2, 1].map((rating) => (
              <Chip
                key={rating}
                label={`${rating} Stars`}
                color={filters.rating === rating ? 'primary' : 'default'}
                onClick={() => filterByRating(rating)}
                sx={{ mr: 1 }}
              />
            ))}
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Reply Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={review.studentAvatar}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      />
                      <Typography variant="body2">
                        {review.studentName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{review.courseName}</TableCell>
                  <TableCell>
                    <Rating value={review.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {review.comment}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Calendar size={16} style={{ marginRight: 4 }} />
                      {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {review.reply ? (
                      <Chip label="Replied" color="success" size="small" />
                    ) : (
                      <Chip label="No Reply" variant="outlined" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewReview(review)}
                    >
                      <Eye size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleReplyToReview(review)}
                    >
                      <MessageSquare size={18} />
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

        {/* View Review Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Review Details</DialogTitle>
          <DialogContent>
            {selectedReview && (
              <>
                <Box mb={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Student Information</Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <Avatar
                          src={selectedReview.studentAvatar}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="body2">
                            <strong>Name:</strong> {selectedReview.studentName}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Email:</strong> {selectedReview.studentEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Course Information</Typography>
                      <Typography variant="body2" mt={1}>
                        <strong>Course:</strong> {selectedReview.courseName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Date:</strong> {format(new Date(selectedReview.createdAt), 'MMM dd, yyyy')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2">Review</Typography>
                      <Rating value={selectedReview.rating} readOnly />
                    </Box>
                    <Typography variant="body2">{selectedReview.comment}</Typography>
                  </CardContent>
                </Card>

                {selectedReview.reply && (
                  <Card variant="outlined" sx={{ mb: 3, bgcolor: 'action.hover' }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>Your Reply</Typography>
                      <Typography variant="body2">{selectedReview.reply}</Typography>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setViewDialogOpen(false);
                handleReplyToReview(selectedReview);
              }}
            >
              {selectedReview?.reply ? 'Edit Reply' : 'Reply'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog
          open={replyDialogOpen}
          onClose={() => setReplyDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedReview?.reply ? 'Edit Reply to Review' : 'Reply to Review'}
          </DialogTitle>
          <DialogContent>
            {selectedReview && (
              <>
                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom>Student Review</Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Rating:</Typography>
                    <Rating value={selectedReview.rating} readOnly size="small" />
                  </Box>
                  <Typography variant="body2">
                    <strong>Comment:</strong> {selectedReview.comment}
                  </Typography>
                </Box>

                <TextField
                  label="Your Reply"
                  multiline
                  rows={4}
                  fullWidth
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your response to the student's review..."
                  required
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
            >
              {selectedReview?.reply ? 'Update Reply' : 'Submit Reply'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ReviewManagementPanel;