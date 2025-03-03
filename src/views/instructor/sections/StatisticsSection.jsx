import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Tooltip,
  LinearProgress
} from '@mui/material';
import { 
  Users, 
  BookOpen, 
  Award, 
  Star, 
  Clock, 
  Calendar,
  HelpCircle
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
      icon: <Users size={24} />,
      tooltip: 'Total number of students enrolled in this instructor\'s courses'
    },
    {
      title: 'Active Courses',
      value: statistics.activeCourses || 0,
      icon: <BookOpen size={24} />,
      tooltip: 'Number of courses currently being taught'
    },
    {
      title: 'Certifications',
      value: statistics.certifications || 0,
      icon: <Award size={24} />,
      tooltip: 'Professional certifications held by the instructor'
    },
    {
      title: 'Rating',
      value: statistics.rating ? `${statistics.rating.toFixed(1)}/5.0` : 'N/A',
      icon: <Star size={24} />,
      tooltip: 'Average student rating across all courses'
    },
    {
      title: 'Teaching Hours',
      value: statistics.teachingHours || 0,
      icon: <Clock size={24} />,
      tooltip: 'Total hours of instruction delivered'
    },
    {
      title: 'Experience',
      value: statistics.yearsExperience ? `${statistics.yearsExperience} years` : 'N/A',
      icon: <Calendar size={24} />,
      tooltip: 'Years of teaching experience'
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        {statItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box color="primary.main" mr={1}>
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
    </Box>
  );
};

export default StatisticsSection;