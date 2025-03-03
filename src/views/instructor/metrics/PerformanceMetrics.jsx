// src/components/instructor/PerformanceMetrics.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Rating
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PerformanceMetrics = ({ metrics }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Performance Metrics</Typography>

        <Grid container spacing={3}>
          {/* Student Engagement Metrics */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Student Engagement
                </Typography>
                
                {/* Course Completion Rate */}
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{ minWidth: 200 }}>
                    Course Completion Rate:
                  </Typography>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={metrics?.completionRate || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {metrics?.completionRate?.toFixed(1) || 0}%
                  </Typography>
                </Box>

                {/* Student Retention Rate */}
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{ minWidth: 200 }}>
                    Student Retention Rate:
                  </Typography>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={metrics?.retentionRate || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {metrics?.retentionRate?.toFixed(1) || 0}%
                  </Typography>
                </Box>

                {/* Student Satisfaction */}
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 200 }}>
                    Student Satisfaction:
                  </Typography>
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

          {/* Content Quality Metrics */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Content Quality
                </Typography>

                {/* Average Course Rating */}
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{ minWidth: 200 }}>
                    Average Course Rating:
                  </Typography>
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

                {/* Content Freshness */}
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{ minWidth: 200 }}>
                    Content Freshness:
                  </Typography>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={metrics?.contentFreshness || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {metrics?.contentFreshness || 0}%
                  </Typography>
                </Box>

                {/* Material Completeness */}
                <Box display="flex" alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 200 }}>
                    Material Completeness:
                  </Typography>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={metrics?.materialCompleteness || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {metrics?.materialCompleteness || 0}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Rating Distribution
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metrics?.ratingDistribution || []}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="rating" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="count" 
                        fill="#8884d8" 
                        name="Number of Reviews" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Course Performance
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics?.coursePerformance || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {(metrics?.coursePerformance || []).map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
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

export default PerformanceMetrics;