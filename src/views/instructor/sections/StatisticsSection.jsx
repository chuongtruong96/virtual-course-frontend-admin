import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Tooltip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Users,
  BookOpen,
  Award,
  Star,
  Clock,
  Calendar,
  HelpCircle,
  DollarSign,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

/**
 * StatisticsSection component displays key metrics about an instructor
 * in a grid of cards with icons and values.
 *
 * @param {Object} props
 * @param {Object} props.statistics - Object containing instructor statistics
 * @returns {JSX.Element}
 */
const StatisticsSection = ({ statistics }) => {
  // If statistics aren't loaded yet, show loading indicators
  if (!statistics) {
    return (
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Card>
                <CardContent>
                  <LinearProgress />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Define the statistics cards to display
  const statItems = [
    {
      title: 'Total Students',
      value: statistics.totalStudents || 0,
      icon: <Users size={24} color="#2196f3" />,
      tooltip: 'Total number of students enrolled in this instructor\'s courses'
    },
    {
      title: 'Active Courses',
      value: statistics.activeCourses || 0,
      icon: <BookOpen size={24} color="#4caf50" />,
      tooltip: 'Number of courses currently being taught'
    },
    {
      title: 'Total Revenue',
      value: statistics.totalRevenue ? `$${statistics.totalRevenue.toFixed(2)}` : '$0.00',
      icon: <DollarSign size={24} color="#f44336" />,
      tooltip: 'Total revenue generated from courses'
    },
    {
      title: 'Rating',
      value: statistics.averageRating ? `${statistics.averageRating.toFixed(1)}/5.0` : 'N/A',
      icon: <Star size={24} color="#ff9800" />,
      tooltip: 'Average student rating across all courses'
    },
    {
      title: 'Completion Rate',
      value: statistics.completionRate ? `${statistics.completionRate.toFixed(1)}%` : 'N/A',
      icon: <CheckCircle size={24} color="#9c27b0" />,
      tooltip: 'Percentage of students who complete courses'
    },
    {
      title: 'Experience',
      value: statistics.yearsExperience ? `${statistics.yearsExperience} years` : 'N/A',
      icon: <Calendar size={24} color="#795548" />,
      tooltip: 'Years of teaching experience'
    }
  ];

  // Additional metrics for detailed view
  const detailedMetrics = [
    {
      title: 'Total Sections',
      value: statistics.totalSections || 0,
      change: statistics.sectionGrowth || 0,
      icon: <BookOpen size={20} color="#2196f3" />
    },
    {
      title: 'New Students (30d)',
      value: statistics.newStudents || 0,
      change: statistics.studentGrowth || 0,
      icon: <Users size={20} color="#4caf50" />
    },
    {
      title: 'Recent Revenue (30d)',
      value: statistics.recentRevenue ? `$${statistics.recentRevenue.toFixed(2)}` : '$0.00',
      change: statistics.revenueGrowth || 0,
      icon: <DollarSign size={20} color="#f44336" />
    },
    {
      title: 'Reviews',
      value: statistics.totalReviews || 0,
      change: statistics.reviewGrowth || 0,
      icon: <Star size={20} color="#ff9800" />
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* Primary Statistics */}
      <Grid container spacing={3}>
        {statItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box mr={1}>
                    {item.icon}
                  </Box>
                  <Tooltip title={item.tooltip}>
                    <HelpCircle size={16} color="#999" />
                  </Tooltip>
                </Box>
                <Typography variant="h5" component="div" fontWeight="bold">
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Metrics */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Recent Performance
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            {detailedMetrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    {metric.icon}
                    <Typography variant="body2" color="text.secondary" ml={1}>
                      {metric.title}
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {metric.value}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TrendingUp 
                      size={16} 
                      color={metric.change >= 0 ? "#4caf50" : "#f44336"} 
                      style={{ marginRight: 4 }}
                    />
                    <Typography 
                      variant="caption" 
                      color={metric.change >= 0 ? "success.main" : "error.main"}
                    >
                      {metric.change >= 0 ? "+" : ""}{metric.change}% from previous period
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

StatisticsSection.propTypes = {
  statistics: PropTypes.shape({
    totalStudents: PropTypes.number,
    activeCourses: PropTypes.number,
    totalRevenue: PropTypes.number,
    averageRating: PropTypes.number,
    completionRate: PropTypes.number,
    yearsExperience: PropTypes.number,
    totalSections: PropTypes.number,
    newStudents: PropTypes.number,
    recentRevenue: PropTypes.number,
    totalReviews: PropTypes.number,
    sectionGrowth: PropTypes.number,
    studentGrowth: PropTypes.number,
    revenueGrowth: PropTypes.number,
    reviewGrowth: PropTypes.number
  })
};

export default StatisticsSection;