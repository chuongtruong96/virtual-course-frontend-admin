const InstructorReviewManagement = ({ instructorId }) => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [moderationDialogOpen, setModerationDialogOpen] = useState(false);
    const [moderationAction, setModerationAction] = useState('');
    const [moderationReason, setModerationReason] = useState('');
    
    useEffect(() => {
      const fetchReviews = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/admin/instructors/${instructorId}/reviews`);
          const data = await response.json();
          setReviews(data);
        } catch (error) {
          console.error("Failed to fetch instructor reviews:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchReviews();
    }, [instructorId]);
    
    const handleModerateReview = (review, action) => {
      setSelectedReview(review);
      setModerationAction(action);
      setModerationDialogOpen(true);
    };
    
    const handleSubmitModeration = async () => {
      try {
        await fetch(`/api/admin/reviews/${selectedReview.id}/moderate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: moderationAction,
            reason: moderationReason
          }),
        });
        
        // Update local state
        if (moderationAction === 'remove') {
          setReviews(reviews.filter(review => review.id !== selectedReview.id));
        } else {
          setReviews(reviews.map(review => 
            review.id === selectedReview.id ? { ...review, status: 'APPROVED' } : review
          ));
        }
        
        setModerationDialogOpen(false);
        setModerationReason('');
      } catch (error) {
        console.error("Failed to moderate review:", error);
      }
    };
    
    if (isLoading) return <CircularProgress />;
    
    return (
      <>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Review Management</Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Instructor Reply</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.studentName}</TableCell>
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
                      <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {review.reply ? (
                          <Tooltip title={review.reply}>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 150,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {review.reply}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Chip label="No reply" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex">
                          <Tooltip title="View Full Review">
                            <IconButton 
                              size="small"
                              onClick={() => handleModerateReview(review, 'view')}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove Review">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleModerateReview(review, 'remove')}
                            >
                              <XCircle size={18} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        
        {/* Review Moderation Dialog */}
        <Dialog 
          open={moderationDialogOpen} 
          onClose={() => setModerationDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            {moderationAction === 'remove' ? 'Remove Review' : 'Review Details'}
          </DialogTitle>
          <DialogContent>
            {selectedReview && (
              <>
                <Box mb={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Student Information</Typography>
                      <Typography variant="body2">
                        <strong>Name:</strong> {selectedReview.studentName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Email:</strong> {selectedReview.studentEmail}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Course Information</Typography>
                      <Typography variant="body2">
                        <strong>Course:</strong> {selectedReview.courseName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Date:</strong> {new Date(selectedReview.createdAt).toLocaleDateString()}
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
                      <Typography variant="subtitle2" gutterBottom>Instructor Reply</Typography>
                      <Typography variant="body2">{selectedReview.reply}</Typography>
                    </CardContent>
                  </Card>
                )}
                
                {moderationAction === 'remove' && (
                  <>
                    <Typography variant="subtitle2" gutterBottom>
                      Reason for Removal
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      value={moderationReason}
                      onChange={(e) => setModerationReason(e.target.value)}
                      placeholder="Please provide a reason for removing this review..."
                      required
                    />
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      This action will permanently remove the review and notify the student.
                    </Alert>
                  </>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModerationDialogOpen(false)}>
              {moderationAction === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {moderationAction === 'remove' && (
              <Button 
                variant="contained" 
                color="error"
                onClick={handleSubmitModeration}
                disabled={!moderationReason.trim()}
              >
                Remove Review
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </>
    );
  };

export default InstructorReviewManagement;