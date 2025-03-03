import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Tooltip, Paper, Grid } from '@mui/material';
import {
  Users,
  BookOpen,
  Award,
  Star,
  Clock,
  Briefcase,
  HelpCircle
} from 'lucide-react';

/**
 * Component to display instructor metrics in a grid layout
 *
 * @param {Object} props
 * @param {Object} props.instructor - Instructor data
 * @param {Object} props.metrics - Metrics data for the instructor
 * @returns {JSX.Element}
 */
const InstructorMetrics = ({ instructor, metrics }) => {
  // Calculate years of experience from experiences array
  const calculateExperience = () => {
    if (!instructor?.experiences || instructor.experiences.length === 0) {
      return 0;
    }

    const startYears = instructor.experiences
      .map(exp => exp.startYear)
      .filter(year => year !== null && year !== undefined);
    
    if (startYears.length === 0) return 0;
    
    const earliestYear = Math.min(...startYears);
    const currentYear = new Date().getFullYear();
    return currentYear - earliestYear;
  };

  // Format rating to display N/A if not available
  const formatRating = (rating) => {
    if (rating === undefined || rating === null) return 'N/A';
    return rating.toFixed(1);
  };

  // Calculate total teaching hours from courses
  const calculateTeachingHours = () => {
    if (!metrics?.courses || metrics.courses.length === 0) {
      return 0;
    }
    
    return metrics.courses.reduce((total, course) => {
      return total + (course.duration || 0);
    }, 0);
  };

  const metricsData = [
    {
      icon: <Users size={24} />,
      value: metrics?.totalStudents || 0,
      label: 'Total Students',
      tooltip: 'Total number of students enrolled in this instructor\'s courses'
    },
    {
      icon: <BookOpen size={24} />,
      value: metrics?.activeCourses || 0,
      label: 'Active Courses',
      tooltip: 'Number of active courses created by this instructor'
    },
    {
      icon: <Award size={24} />,
      value: metrics?.certifications || 0,
      label: 'Certifications',
      tooltip: 'Number of certifications issued for this instructor\'s courses'
    },
    {
      icon: <Star size={24} />,
      value: formatRating(metrics?.averageRating),
      label: 'Rating',
      tooltip: 'Average rating across all courses'
    },
    {
      icon: <Clock size={24} />,
      value: calculateTeachingHours(),
      label: 'Teaching Hours',
      tooltip: 'Total teaching hours across all courses'
    },
    {
      icon: <Briefcase size={24} />,
      value: calculateExperience() > 0 ? `${calculateExperience()} Years` : 'N/A',
      label: 'Experience',
      tooltip: 'Years of teaching experience'
    }
  ];

  return (
    <Grid container spacing={2}>
      {metricsData.map((metric, index) => (
        <Grid item xs={6} sm={4} md={2} key={index}>
          <Paper
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <Tooltip title={metric.tooltip}>
              <Box display="flex" alignItems="center" mb={1}>
                {metric.icon}
                <HelpCircle size={16} style={{ marginLeft: 4, opacity: 0.5 }} />
              </Box>
            </Tooltip>
            <Typography variant="h5" fontWeight="bold">
              {metric.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {metric.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

InstructorMetrics.propTypes = {
  instructor: PropTypes.object.isRequired,
  metrics: PropTypes.object
};

export default InstructorMetrics;