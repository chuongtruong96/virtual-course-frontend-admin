// src/components/instructor/StatisticsPanel.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const StatisticsPanel = ({ data, timeRange, onTimeRangeChange }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Performance Overview</Typography>
          <Select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            size="small"
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </Box>

        <Grid container spacing={3}>
          {/* Revenue Stats */}
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Revenue"
              value={data.totalRevenue}
              trend={data.revenueTrend}
            />
          </Grid>

          {/* Student Stats */}
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Students"
              value={data.totalStudents}
              trend={data.studentTrend}
            />
          </Grid>

          {/* Course Stats */}
          <Grid item xs={12} md={3}>
            <StatCard
              title="Active Courses"
              value={data.activeCourses}
              trend={data.courseTrend}
            />
          </Grid>

          {/* Rating Stats */}
          <Grid item xs={12} md={3}>
            <StatCard
              title="Average Rating"
              value={data.averageRating}
              trend={data.ratingTrend}
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={6}>
            <RevenueChart data={data.revenueData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <EnrollmentChart data={data.enrollmentData} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Helper Components
const StatCard = ({ title, value, trend }) => (
  <Box p={2} bgcolor="background.paper" borderRadius={1}>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" gutterBottom>
      {value}
    </Typography>
    <Typography 
      variant="body2"
      color={trend >= 0 ? "success.main" : "error.main"}
    >
      {trend >= 0 ? "+" : ""}{trend}%
    </Typography>
  </Box>
);

const RevenueChart = ({ data }) => (
  <Box height={300}>
    <Typography variant="subtitle2" gutterBottom>
      Revenue Trend
    </Typography>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </Box>
);

const EnrollmentChart = ({ data }) => (
  <Box height={300}>
    <Typography variant="subtitle2" gutterBottom>
      Enrollment Trend
    </Typography>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="enrollments" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

export default StatisticsPanel;