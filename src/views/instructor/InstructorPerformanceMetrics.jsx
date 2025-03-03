const InstructorPerformanceMetrics = ({ instructorId }) => {
    const [metrics, setMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const fetchMetrics = async () => {
        setIsLoading(true);
        try {
          // This would call your backend API
          const response = await fetch(`/api/admin/instructors/${instructorId}/performance-metrics`);
          const data = await response.json();
          setMetrics(data);
        } catch (error) {
          console.error("Failed to fetch performance metrics:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchMetrics();
    }, [instructorId]);
    
    if (isLoading) return <CircularProgress />;
    
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Student Engagement</Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" sx={{ minWidth: 200 }}>Course Completion Rate:</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metrics?.completionRate || 0}
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <Typography variant="body2">{metrics?.completionRate || 0}%</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" sx={{ minWidth: 200 }}>Student Retention Rate:</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metrics?.retentionRate || 0}
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <Typography variant="body2">{metrics?.retentionRate || 0}%</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ minWidth: 200 }}>Student Satisfaction:</Typography>
                    <Rating
                      value={metrics?.studentSatisfaction || 0}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" ml={1}>
                      ({metrics?.studentSatisfaction?.toFixed(1) || '0.0'})
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Content Quality</Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" sx={{ minWidth: 200 }}>Course Rating:</Typography>
                    <Rating
                      value={metrics?.averageCourseRating || 0}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" ml={1}>
                      ({metrics?.averageCourseRating?.toFixed(1) || '0.0'})
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2" sx={{ minWidth: 200 }}>Content Freshness:</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metrics?.contentFreshness || 0}
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <Typography variant="body2">{metrics?.contentFreshness || 0}%</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{ minWidth: 200 }}>Content Freshness:</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metrics?.contentFreshness || 0}
                    sx={{ flexGrow: 1, mr: 1 }}
                  />
                  <Typography variant="body2">{metrics?.contentFreshness || 0}%</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 200 }}>Material Completeness:</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metrics?.materialCompleteness || 0}
                    sx={{ flexGrow: 1, mr: 1 }}
                  />
                  <Typography variant="body2">{metrics?.materialCompleteness || 0}%</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Revenue Performance</Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={metrics?.revenueData || []}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="students" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};                   