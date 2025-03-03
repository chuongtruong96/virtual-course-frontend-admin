const InstructorTestManagement = ({ instructorId }) => {
    const [tests, setTests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState(null);
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    
    useEffect(() => {
      const fetchTests = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/admin/instructors/${instructorId}/tests`);
          const data = await response.json();
          setTests(data);
        } catch (error) {
          console.error("Failed to fetch instructor tests:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchTests();
    }, [instructorId]);
    
    const handlePreviewTest = (test) => {
      setSelectedTest(test);
      setPreviewDialogOpen(true);
    };
    
    const handleUpdateTestStatus = async (testId, status) => {
      try {
        await fetch(`/api/admin/tests/${testId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });
        
        // Update local state
        setTests(tests.map(test => 
          test.id === testId ? { ...test, statusTest: status } : test
        ));
      } catch (error) {
        console.error("Failed to update test status:", error);
      }
    };
    
    if (isLoading) return <CircularProgress />;
    
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
                  {tests.map((test) => (
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
                  ))}
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

                      