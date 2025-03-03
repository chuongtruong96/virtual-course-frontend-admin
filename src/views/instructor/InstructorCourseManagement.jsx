const InstructorCourseManagement = ({ instructorId }) => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');
    const [reviewAction, setReviewAction] = useState('');
    
    useEffect(() => {
      const fetchCourses = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/admin/instructors/${instructorId}/courses`);
          const data = await response.json();
          setCourses(data);
        } catch (error) {
          console.error("Failed to fetch instructor courses:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCourses();
    }, [instructorId]);
    
    const handleReviewCourse = (course, action) => {
      setSelectedCourse(course);
      setReviewAction(action);
      setReviewDialogOpen(true);
    };
    
    const handleSubmitReview = async () => {
      try {
        await fetch(`/api/admin/courses/${selectedCourse.id}/review`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: reviewAction,
            notes: reviewNotes
          }),
        });
        
        // Update local state to reflect the change
        setCourses(courses.map(course => 
          course.id === selectedCourse.id 
            ? { ...course, status: reviewAction === 'approve' ? 'PUBLISHED' : 'REJECTED' } 
            : course
        ));
        
        setReviewDialogOpen(false);
        setReviewNotes('');
      } catch (error) {
        console.error("Failed to submit course review:", error);
      }
    };
    
    if (isLoading) return <CircularProgress />;
    
    return (
      <>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Course Management</Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Students</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={course.imageCover}
                            variant="rounded"
                            sx={{ width: 40, height: 40, mr: 2 }}
                          />
                          <Typography variant="body2">{course.titleCourse}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{course.categoryName}</TableCell>
                      <TableCell>
                        <Chip
                          label={course.status}
                          color={
                            course.status === 'PUBLISHED' ? 'success' :
                            course.status === 'PENDING_REVIEW' ? 'warning' :
                            course.status === 'DRAFT' ? 'default' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{course.enrollmentCount || 0}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Rating value={course.averageRating || 0} readOnly size="small" precision={0.5} />
                          <Typography variant="body2" ml={1}>
                            ({course.ratingCount || 0})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex">
                          <Tooltip title="View Course">
                            <IconButton size="small" onClick={() => window.open(`/courses/${course.id}`, '_blank')}>
                              <Eye size={18} />
                            </IconButton>
                          </Tooltip>
                          
                          {course.status === 'PENDING_REVIEW' && (
                            <>
                              <Tooltip title="Approve Course">
                                <IconButton 
                                  size="small" 
                                  color="success"
                                  onClick={() => handleReviewCourse(course, 'approve')}
                                >
                                  <CheckCircle size={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject Course">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleReviewCourse(course, 'reject')}
                                >
                                  <XCircle size={18} />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        
        {/* Course Review Dialog */}
        <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {reviewAction === 'approve' ? 'Approve Course' : 'Reject Course'}
          </DialogTitle>
          <DialogContent>
            {selectedCourse && (
              <>
                <Box mb={3}>
                  <Typography variant="h6">{selectedCourse.titleCourse}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {selectedCourse.categoryName}
                  </Typography>
                </Box>
                
                <TextField
                  label={reviewAction === 'approve' ? 'Approval Notes' : 'Rejection Reason'}
                  multiline
                  rows={4}
                  fullWidth
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder={
                    reviewAction === 'approve' 
                      ? 'Add any notes about the approval...' 
                      : 'Please provide a detailed reason for rejection...'
                  }
                  required
                />
                
                {reviewAction === 'reject' && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    This action will change the course status to REJECTED and notify the instructor.
                  </Alert>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              color={reviewAction === 'approve' ? 'success' : 'error'}
              onClick={handleSubmitReview}
              disabled={!reviewNotes.trim()}
            >
              {reviewAction === 'approve' ? 'Approve Course' : 'Reject Course'}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };