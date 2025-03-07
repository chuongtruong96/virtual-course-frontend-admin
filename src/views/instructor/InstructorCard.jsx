import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  Collapse,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Eye,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Star,
  Briefcase,
  GraduationCap,
  Code,
  Facebook,
  Linkedin,
  Instagram,
  Globe
} from 'lucide-react';
import { UPLOAD_PATH, DEFAULT_IMAGES } from '../../config/endpoints';
import { format } from 'date-fns';
import { useInstructorDetail } from '../../hooks/useInstructorDetail';

// This is a wrapper component that uses the hook to fetch instructor details
export const InstructorCardWithDetails = ({ 
  instructorId, 
  onApprove, 
  onReject, 
  onViewDetail,
  showMetrics = true
}) => {
  const { 
    instructor, 
    statistics, 
    educations, 
    experiences, 
    skills, 
    social,
    isLoading, 
    isError 
  } = useInstructorDetail(instructorId);

  if (isLoading) {
    return (
      <Card sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={40} />
      </Card>
    );
  }

  if (isError || !instructor) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">Error loading instructor details</Typography>
      </Card>
    );
  }

  // Combine all the data into a single instructor object
  const instructorWithDetails = {
    ...instructor,
    educations: educations || [],
    experiences: experiences || [],
    skills: skills || [],
    social: social || null
  };

  // Create metrics object from statistics
  const metrics = showMetrics ? {
    totalStudents: statistics?.totalStudents || 0,
    averageRating: statistics?.averageRating || 0,
    completionRate: statistics?.completionRate || 0
  } : null;

  return (
    <InstructorCard
      instructor={instructorWithDetails}
      metrics={metrics}
      onApprove={onApprove}
      onReject={onReject}
      onViewDetail={onViewDetail}
    />
  );
};

InstructorCardWithDetails.propTypes = {
  instructorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onViewDetail: PropTypes.func.isRequired,
  showMetrics: PropTypes.bool
};

// The original InstructorCard component remains mostly unchanged
const InstructorCard = React.memo(({
  instructor,
  onApprove,
  onReject,
  onViewDetail,
  metrics
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  // Default image path
  const defaultImagePath = '/images/instructor/default-instructor.jpg';
  
  // Check if default image exists
  useEffect(() => {
    const img = new Image();
    img.src = defaultImagePath;
    img.onload = () => {
      console.log("Default image exists and loaded successfully");
    };
    img.onerror = () => {
      console.error("Default image does not exist or failed to load");
    };
  }, []);

  const [imageError, setImageError] = useState(false);
  
  // Determine image URL with fallback logic
  const getImageUrl = () => {
    if (imageError || !instructor.photo) {
      return DEFAULT_IMAGES.INSTRUCTOR;
    }
    return instructor.photo.startsWith('http')
      ? instructor.photo
      : `${UPLOAD_PATH.INSTRUCTOR}/${instructor.photo}`;
  };

  // Handle image loading errors
  const handleImageError = () => {
    console.log("Default image does not exist or failed to load");
    setImageError(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'INACTIVE': return 'default';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ p: 2, position: 'relative' }}>
      {instructor.verifiedPhone && (
        <Badge
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'success.light',
            color: 'success.dark',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircle size={16} />
        </Badge>
      )}

      {/* Header Section */}
      <Box display="flex" gap={2}>
        <Avatar
          src={getImageUrl()}
          alt={`${instructor.firstName} ${instructor.lastName}`}
          sx={{ width: 80, height: 80 }}
          onError={handleImageError}
        >
          {instructor.firstName?.[0]}
        </Avatar>
        <Box flex={1}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6">
                {instructor.firstName} {instructor.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {instructor.title || 'Instructor'}
              </Typography>
              <Chip
                label={instructor.status}
                color={getStatusColor(instructor.status)}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
            {/* Course Count */}
            {instructor.courseCount > 0 && (
              <Tooltip title={`${instructor.courseCount} courses`}>
                <Chip
                  icon={<BookOpen size={14} />}
                  label={instructor.courseCount}
                  variant="outlined"
                  size="small"
                />
              </Tooltip>
            )}
          </Box>

          {/* Contact Info */}
          <Box display="flex" flexDirection="column" gap={1} mt={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Mail size={16} />
              <Typography variant="body2">
                {instructor.email || instructor.accountEmail}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Phone size={16} />
              <Typography variant="body2">
                {instructor.phone || 'Not provided'}
              </Typography>
            </Box>
            {instructor.address && (
              <Box display="flex" alignItems="center" gap={1}>
                <MapPin size={16} />
                <Typography variant="body2" noWrap>
                  {instructor.address}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Metrics Section */}
      {metrics && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-around" mb={2}>
            <Box textAlign="center">
              <Tooltip title="Total Students">
                <Box>
                  <Users size={20} />
                  <Typography variant="h6">{metrics.totalStudents}</Typography>
                  <Typography variant="caption">Students</Typography>
                </Box>
              </Tooltip>
            </Box>
            <Box textAlign="center">
              <Tooltip title="Average Rating">
                <Box>
                  <Star size={20} />
                  <Typography variant="h6">
                    {metrics.averageRating?.toFixed(1) || '0.0'}
                  </Typography>
                  <Typography variant="caption">Rating</Typography>
                </Box>
              </Tooltip>
            </Box>
            <Box textAlign="center">
              <Tooltip title="Course Completion Rate">
                <Box>
                  <BookOpen size={20} />
                  <Typography variant="h6">
                    {metrics.completionRate?.toFixed(0) || '0'}%
                  </Typography>
                  <Typography variant="caption">Completion</Typography>
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </>
      )}

      {/* Bio Section */}
      {instructor.bio && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {instructor.bio}
          </Typography>
        </>
      )}

      {/* Expandable Section for Education, Experience, Skills */}
      <Button 
        size="small" 
        onClick={toggleExpanded} 
        sx={{ mt: 1, textTransform: 'none' }}
      >
        {expanded ? 'Show Less' : 'Show More'}
      </Button>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ my: 1 }} />
        
        {/* Education Section */}
        {instructor.educations && instructor.educations.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" display="flex" alignItems="center" gutterBottom>
              <GraduationCap size={16} style={{ marginRight: 8 }} />
              Education
            </Typography>
            <List dense disablePadding>
              {instructor.educations.slice(0, 2).map((edu, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={edu.degree}
                    secondary={
                      <>
                        {edu.university}
                        {edu.startYear && edu.endYear && (
                          <span> • {edu.startYear} - {edu.endYear === new Date().getFullYear() + 1 ? 'Present' : edu.endYear}</span>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {/* Experience Section */}
        {instructor.experiences && instructor.experiences.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" display="flex" alignItems="center" gutterBottom>
              <Briefcase size={16} style={{ marginRight: 8 }} />
              Experience
            </Typography>
            <List dense disablePadding>
              {instructor.experiences.slice(0, 2).map((exp, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={exp.position}
                    secondary={
                      <>
                        {exp.company}
                        {exp.startYear && exp.endYear && (
                          <span> • {exp.startYear} - {exp.endYear === new Date().getFullYear() + 1 ? 'Present' : exp.endYear}</span>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {/* Skills Section */}
        {instructor.skills && instructor.skills.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" display="flex" alignItems="center" gutterBottom>
              <Code size={16} style={{ marginRight: 8 }} />
              Skills
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {instructor.skills.map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill.skillName} 
                  size="small" 
                  variant="outlined" 
                />
              ))}
            </Box>
          </Box>
        )}
        
        {/* Social Links */}
        {instructor.social && (
          <Box mt={2} display="flex" gap={1} justifyContent="center">
            {instructor.social.facebookUrl && (
              <Tooltip title="Facebook">
                <IconButton 
                  size="small" 
                  component="a" 
                  href={instructor.social.facebookUrl} 
                  target="_blank"
                >
                  <Facebook size={20} />
                </IconButton>
              </Tooltip>
            )}
            {instructor.social.linkedinUrl && (
              <Tooltip title="LinkedIn">
                <IconButton 
                  size="small" 
                  component="a" 
                  href={instructor.social.linkedinUrl} 
                  target="_blank"
                >
                  <Linkedin size={20} />
                </IconButton>
              </Tooltip>
            )}
            {instructor.social.instagramUrl && (
              <Tooltip title="Instagram">
                <IconButton 
                  size="small" 
                  component="a" 
                  href={instructor.social.instagramUrl} 
                  target="_blank"
                >
                  <Instagram size={20} />
                </IconButton>
              </Tooltip>
            )}
            {instructor.social.googleUrl && (
              <Tooltip title="Website">
                <IconButton 
                  size="small" 
                  component="a" 
                  href={instructor.social.googleUrl} 
                  target="_blank"
                >
                  <Globe size={20} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Collapse>

      {/* Actions Section */}
      <Box
        display="flex"
        gap={1}
        mt={3}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="caption"
          color="text.secondary"
          display="flex"
          alignItems="center"
        >
          <Calendar size={14} style={{ marginRight: 4 }} />
          {instructor.createdAt ?
            format(new Date(instructor.createdAt), 'MMM dd, yyyy') :
            'N/A'
          }
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Eye size={16} />}
            onClick={onViewDetail}
          >
            View
          </Button>
          {instructor.status === 'PENDING' && (
            <>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<CheckCircle size={16} />}
                onClick={onApprove}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<XCircle size={16} />}
                onClick={onReject}
              >
                Reject
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
});

InstructorCard.propTypes = {
  instructor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    title: PropTypes.string,
    email: PropTypes.string,
    accountEmail: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    photo: PropTypes.string,
    bio: PropTypes.string,
    status: PropTypes.string.isRequired,
    verifiedPhone: PropTypes.bool,
    courseCount: PropTypes.number,
    createdAt: PropTypes.string,
    // New props
    educations: PropTypes.arrayOf(
      PropTypes.shape({
        degree: PropTypes.string,
        university: PropTypes.string,
        startYear: PropTypes.number,
        endYear: PropTypes.number,
        description: PropTypes.string
      })
    ),
    experiences: PropTypes.arrayOf(
      PropTypes.shape({
        position: PropTypes.string,
        company: PropTypes.string,
        startYear: PropTypes.number,
        endYear: PropTypes.number,
        description: PropTypes.string
      })
    ),
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        skillName: PropTypes.string
      })
    ),
    social: PropTypes.shape({
      facebookUrl: PropTypes.string,
      googleUrl: PropTypes.string,
      instagramUrl: PropTypes.string,
      linkedinUrl: PropTypes.string
    })
  }).isRequired,
  metrics: PropTypes.shape({
    totalStudents: PropTypes.number,
    averageRating: PropTypes.number,
    completionRate: PropTypes.number
  }),
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onViewDetail: PropTypes.func.isRequired
};

export default InstructorCard;