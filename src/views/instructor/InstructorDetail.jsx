// src/views/instructor/InstructorDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Grid,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link
} from '@mui/material';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Star,
  Users,
  Award,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Facebook,
  Linkedin,
  Instagram,
  Building,
  Clock,
  User
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import InstructorService from '../../services/instructorService';
import { UPLOAD_PATH } from '../../config/endpoints';

const InstructorDetail = () => {
  const { instructorId } = useParams();
  const navigate = useNavigate();

  const {
    data: instructor,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['instructor', instructorId],
    queryFn: () => InstructorService.fetchById(instructorId)
  });

  const {
    data: statistics,
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['instructor-statistics', instructorId],
    queryFn: () => InstructorService.getStatistics(instructorId)
  });

  // Construct the avatar URL
  const avatarUrl = instructor?.photo ? 
    (instructor.photo.startsWith('http') ? 
      instructor.photo : 
      `${UPLOAD_PATH.INSTRUCTOR}/${instructor.photo}`
    ) : undefined;

  if (isLoading || statsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error?.message || 'Failed to load instructor details'}
      </Alert>
    );
  }

  const stats = [
    {
      icon: <BookOpen size={24} />,
      label: 'Total Courses',
      value: statistics?.totalCourses || 0,
      color: 'primary'
    },
    {
      icon: <Users size={24} />,
      label: 'Total Students',
      value: statistics?.totalStudents || 0,
      color: 'success'
    },
    {
      icon: <Star size={24} />,
      label: 'Average Rating',
      value: statistics?.averageRating?.toFixed(1) || 0,
      color: 'warning'
    },
    {
      icon: <Award size={24} />,
      label: 'Published Courses',
      value: statistics?.totalPublishedCourses || 0,
      color: 'info'
    }
  ];

  return (
    <div>
      <Button
        startIcon={<ArrowLeft />}
        onClick={() => navigate('/dashboard/instructor/list')}
        sx={{ mb: 3 }}
      >
        Back to Instructors
      </Button>

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12}>
          <Card>
            <Box p={3}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  src={avatarUrl}
                  alt={`${instructor.firstName} ${instructor.lastName}`}
                  sx={{ width: 100, height: 100, mr: 3 }}
                >
                  {instructor.firstName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h4">
                    {instructor.firstName} {instructor.lastName}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {instructor.title || 'Instructor'}
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <Chip
                      label={instructor.status}
                      color={instructor.status === 'ACTIVE' ? 'success' : 'warning'}
                    />
                    <Chip
                      icon={<User size={16} />}
                      label={instructor.gender || 'Not specified'}
                      color="default"
                    />
                    {instructor.verifiedPhone ? (
                      <Chip
                        icon={<CheckCircle size={16} />}
                        label="Verified"
                        color="success"
                      />
                    ) : (
                      <Chip
                        icon={<XCircle size={16} />}
                        label="Unverified"
                        color="warning"
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="center">
                      <Mail size={20} style={{ marginRight: 8 }} />
                      <Typography>{instructor.accountEmail}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Phone size={20} style={{ marginRight: 8 }} />
                      <Typography>{instructor.phone || 'Not provided'}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <MapPin size={20} style={{ marginRight: 8 }} />
                      <Typography>{instructor.address || 'Not provided'}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Building size={20} style={{ marginRight: 8 }} />
                      <Typography>{instructor.workplace || 'Not specified'}</Typography>
                    </Box>
                  </Box>
                </Grid>

                {instructor.social && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Social Links
                    </Typography>
                    <List>
                      {instructor.social.facebookUrl && (
                        <ListItem>
                          <ListItemIcon>
                            <Facebook size={20} />
                          </ListItemIcon>
                          <ListItemText>
                            <Link href={instructor.social.facebookUrl} target="_blank">
                              Facebook Profile
                            </Link>
                          </ListItemText>
                        </ListItem>
                      )}
                      {instructor.social.linkedinUrl && (
                        <ListItem>
                          <ListItemIcon>
                            <Linkedin size={20} />
                          </ListItemIcon>
                          <ListItemText>
                            <Link href={instructor.social.linkedinUrl} target="_blank">
                              LinkedIn Profile
                            </Link>
                          </ListItemText>
                        </ListItem>
                      )}
                      {instructor.social.instagramUrl && (
                        <ListItem>
                          <ListItemIcon>
                            <Instagram size={20} />
                          </ListItemIcon>
                          <ListItemText>
                            <Link href={instructor.social.instagramUrl} target="_blank">
                              Instagram Profile
                            </Link>
                          </ListItemText>
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: `${stat.color}.light`, color: `${stat.color}.main`, mr: 2 }}>
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h6" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography color="textSecondary" variant="body2">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Education & Experience */}
        <Grid item xs={12} md={6}>
          <Card>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                <GraduationCap size={20} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
                Education
              </Typography>
              {instructor.education?.map((edu, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1">{edu.degree}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.university}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.startYear} - {edu.endYear || 'Present'}
                  </Typography>
                  {edu.description && (
                    <Typography variant="body2" mt={1}>
                      {edu.description}
                    </Typography>
                  )}
                  {index < instructor.education.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                <Briefcase size={20} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
                Work Experience
              </Typography>
              {instructor.experiences?.map((exp, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1">{exp.position}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.company}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.startYear} - {exp.endYear || 'Present'}
                  </Typography>
                  {exp.description && (
                    <Typography variant="body2" mt={1}>
                      {exp.description}
                    </Typography>
                  )}
                  {index < instructor.experiences.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Skills */}
        {instructor.skills?.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <Box p={3}>
                <Typography variant="h6" gutterBottom>
                  <Code size={20} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
                  Skills & Expertise
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {instructor.skills.map((skill, index) => (
                    <Chip key={index} label={skill.skillName} />
                  ))}
                </Box>
              </Box>
            </Card>
          </Grid>
        )}

        {/* Bio */}
        <Grid item xs={12}>
          <Card>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                Biography
              </Typography>
              <Typography variant="body1">
                {instructor.bio || 'No biography provided.'}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default InstructorDetail;
