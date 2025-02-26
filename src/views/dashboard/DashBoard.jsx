import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, Button, FormControl, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import useAdminDashboard from '../../hooks/useAdminDashboard';
import StatisticsChart from '../../components/statistics/StatisticsChart';
import { 
  Users, 
  BookOpen, 
  Grid as GridIcon, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Star
} from 'lucide-react';

const DashDefault = () => {
  const [timeFilter, setTimeFilter] = useState('allTime');
  const [modelFilter, setModelFilter] = useState('all');

  const {
    statistics,
    trends,
    pendingCourses,
    pendingInstructors,
    isLoading,
    isError,
    error,
    approveCourse,
    rejectCourse,
    approveInstructor,
    rejectInstructor
  } = useAdminDashboard(timeFilter, modelFilter);

  // Quick Stats Cards
  const quickStats = [
    {
      title: 'Total Users',
      count: statistics?.accounts || 0,
      icon: <Users />,
      trend: '+12%',
      trendUp: true,
      color: 'primary'
    },
    {
      title: 'Active Courses',
      count: statistics?.courses || 0,
      icon: <BookOpen />,
      trend: '+5%',
      trendUp: true,
      color: 'success'
    },
    {
      title: 'Categories',
      count: statistics?.categories || 0,
      icon: <GridIcon />,
      trend: '+8%',
      trendUp: true,
      color: 'warning'
    },
    {
      title: 'Pending Reviews',
      count: '45',
      icon: <Star />,
      trend: '-2%',
      trendUp: false,
      color: 'info'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      {/* Time Filter */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                displayEmpty
              >
                <MenuItem value="allTime">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Avatar sx={{ bgcolor: `${stat.color}.light`, color: `${stat.color}.main` }}>
                    {stat.icon}
                  </Avatar>
                  <Box textAlign="right">
                    <Typography variant="h4" component="div">
                      {stat.count}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mt={2}>
                  {stat.trendUp ? <TrendingUp size={16} color="green" /> : <TrendingDown size={16} color="red" />}
                  <Typography
                    variant="body2"
                    color={stat.trendUp ? "success.main" : "error.main"}
                    sx={{ ml: 1 }}
                  >
                    {stat.trend}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Statistics Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <StatisticsChart model="total" filter={timeFilter} title="Overall Statistics" />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatisticsChart model="courses" filter={timeFilter} title="Course Growth" />
        </Grid>
      </Grid>

      {/* Pending Approvals */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Course Approvals
              </Typography>
              {Array.isArray(pendingCourses) && pendingCourses.length > 0 ? (
                pendingCourses.map((course) => (
                  <Box key={course.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1">{course.titleCourse}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          By {course.instructorFirstName} {course.instructorLastName}
                        </Typography>
                      </Box>
                      <Box>
                        <Button
                          size="small"
                          startIcon={<CheckCircle />}
                          color="success"
                          onClick={() => approveCourse({ courseId: course.id, notes: '' })}
                          sx={{ mr: 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          startIcon={<XCircle />}
                          color="error"
                          onClick={() => rejectCourse({ courseId: course.id, reason: '' })}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No pending courses.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Instructor Approvals
              </Typography>
              {Array.isArray(pendingInstructors) && pendingInstructors.length > 0 ? (
                pendingInstructors.map((instructor) => (
                  <Box key={instructor.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1">{instructor.username}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {instructor.email}
                        </Typography>
                      </Box>
                      <Box>
                        <Button
                          size="small"
                          startIcon={<CheckCircle />}
                          color="success"
                          onClick={() => approveInstructor(instructor.id)}
                          sx={{ mr: 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          startIcon={<XCircle />}
                          color="error"
                          onClick={() => rejectInstructor({ instructorId: instructor.id, reason: '' })}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No pending instructors.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Reviews
              </Typography>
              <Box sx={{ height: 300, overflowY: 'auto' }}>
                {/* Add your reviews list here */}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Notifications
              </Typography>
              <Box sx={{ height: 300, overflowY: 'auto' }}>
                {/* Add your notifications list here */}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashDefault;