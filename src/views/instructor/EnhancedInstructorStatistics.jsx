import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  BookOpen,
  Star,
  DollarSign,
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';
import InstructorService from '../../../services/instructorService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const EnhancedInstructorStatistics = ({ instructorId }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const data = await InstructorService.getInstructorStatistics(instructorId, timeRange);
        setStatistics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching instructor statistics:', err);
        setError('Failed to load instructor statistics');
      } finally {
        setLoading(false);
      }
    };

    if (instructorId) {
      fetchStatistics();
    }
  }, [instructorId, timeRange]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Instructor Performance Overview</Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box p={2} border={1} borderColor="divider" borderRadius={1}>
              <Box display="flex" alignItems="center" mb={1}>
                <BookOpen size={20} color="#0088FE" style={{ marginRight: 8 }} />
                <Typography variant="subtitle2">Total Courses</Typography>
              </Box>
              <Typography variant="h4">{statistics?.totalCourses || 0}</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Chip 
                  size="small" 
                  label={`${statistics?.publishedCourses || 0} published`} 
                  color="primary" 
                  variant="outlined" 
                />
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box p={2} border={1} borderColor="divider" borderRadius={1}>
              <Box display="flex" alignItems="center" mb={1}>
                <Users size={20} color="#00C49F" style={{ marginRight: 8 }} />
                <Typography variant="subtitle2">Total Students</Typography>
              </Box>
              <Typography variant="h4">{statistics?.totalStudents || 0}</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp size={16} color={statistics?.studentGrowth >= 0 ? "green" : "red"} />
                <Typography variant="caption" color={statistics?.studentGrowth >= 0 ? "success.main" : "error.main"} ml={0.5}>
                  {statistics?.studentGrowth || 0}% from previous {timeRange}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box p={2} border={1} borderColor="divider" borderRadius={1}>
              <Box display="flex" alignItems="center" mb={1}>
                <Star size={20} color="#FFBB28" style={{ marginRight: 8 }} />
                <Typography variant="subtitle2">Average Rating</Typography>
              </Box>
              <Typography variant="h4">{statistics?.averageRating?.toFixed(1) || '0.0'}</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Chip 
                  size="small" 
                  label={`${statistics?.totalReviews || 0} reviews`} 
                  color="warning" 
                  variant="outlined" 
                />
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box p={2} border={1} borderColor="divider" borderRadius={1}>
              <Box display="flex" alignItems="center" mb={1}>
                <DollarSign size={20} color="#FF8042" style={{ marginRight: 8 }} />
                <Typography variant="subtitle2">Total Revenue</Typography>
              </Box>
              <Typography variant="h4">
                ${statistics?.totalRevenue?.toFixed(2) || '0.00'}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp size={16} color={statistics?.revenueGrowth >= 0 ? "green" : "red"} />
                <Typography variant="caption" color={statistics?.revenueGrowth >= 0 ? "success.main" : "error.main"} ml={0.5}>
                  {statistics?.revenueGrowth || 0}% from previous {timeRange}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Student Enrollment Trend</Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={statistics?.enrollmentTrend || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Course Popularity</Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statistics?.coursePopularity || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Revenue by Course</Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statistics?.revenueByCourse || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="revenue"
                    nameKey="title"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statistics?.revenueByCourse?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>Rating Distribution</Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statistics?.ratingDistribution || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="rating" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EnhancedInstructorStatistics;