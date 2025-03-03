import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Code
} from 'lucide-react';

import EnhancedInstructorStatistics from './EnhancedInstructorStatistics';
import InstructorVerificationWorkflow from './InstructorVerificationWorkflow';
import InstructorPerformanceMetrics from './InstructorPerformanceMetrics';
import InstructorCourseManagement from './InstructorCourseManagement';
import InstructorTestManagement from './InstructorTestManagement';
import InstructorReviewManagement from './InstructorReviewManagement';

const InstructorManagementDashboard = () => {
  const { instructorId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [instructor, setInstructor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/instructors/${instructorId}`);
        const data = await response.json();
        setInstructor(data);
      } catch (error) {
        console.error("Failed to fetch instructor details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructorDetails();
  }, [instructorId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (isLoading) return <CircularProgress />;

  if (!instructor) {
    return (
      <Alert severity="error">
        Instructor not found or you don't have permission to view this page.
      </Alert>
    );
  }

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              src={instructor.photo}
              alt={`${instructor.firstName} ${instructor.lastName}`}
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <Box>
              <Typography variant="h5">
                {instructor.firstName} {instructor.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {instructor.title || 'Instructor'}
              </Typography>
              <Box display="flex" alignItems="center" mt={0.5}>
                <Chip
                  label={instructor.status}
                  color={
                    instructor.status === 'ACTIVE' ? 'success' :
                    instructor.status === 'PENDING' ? 'warning' :
                    'error'
                  }
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  ID: {instructor.id}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="instructor management tabs">
          <Tab label="Overview" />
          <Tab label="Courses" />
          <Tab label="Tests & Quizzes" />
          <Tab label="Reviews" />
          <Tab label="Performance" />
          <Tab label="Verification" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <EnhancedInstructorStatistics instructorId={instructorId} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Mail size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email"
                        secondary={instructor.email || instructor.accountEmail}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Phone size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone"
                        secondary={instructor.phone || 'Not provided'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <MapPin size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Address"
                        secondary={instructor.address || 'Not provided'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Calendar size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Joined"
                        secondary={instructor.createdAt ? new Date(instructor.createdAt).toLocaleDateString() : 'N/A'}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Professional Information</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Briefcase size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Workplace"
                        secondary={instructor.workplace || 'Not provided'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <GraduationCap size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Education"
                        secondary={
                          instructor.education && instructor.education.length > 0
                            ? `${instructor.education[0].degree} from ${instructor.education[0].university}`
                            : 'Not provided'
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Award size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Experience"
                        secondary={
                          instructor.experiences && instructor.experiences.length > 0
                            ? `${instructor.experiences[0].position} at ${instructor.experiences[0].company}`
                            : 'Not provided'
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Code size={20} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Skills"
                        secondary={
                          instructor.skills && instructor.skills.length > 0
                            ? instructor.skills.map(skill => skill.skillName).join(', ')
                            : 'Not provided'
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Biography</Typography>
                  <Typography variant="body1">
                    {instructor.bio || 'No biography provided.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        {activeTab === 1 && (
          <InstructorCourseManagement instructorId={instructorId} />
        )}
        {activeTab === 2 && (
          <InstructorTestManagement instructorId={instructorId} />
        )}
        {activeTab === 3 && (
          <InstructorReviewManagement instructorId={instructorId} />
        )}
        {activeTab === 4 && (
          <InstructorPerformanceMetrics instructorId={instructorId} />
        )}
        {activeTab === 5 && (
          <InstructorVerificationWorkflow
            instructor={instructor}
            onVerificationComplete={(status) => {
              // Update instructor status in parent component
              setInstructor(prev => ({
                ...prev,
                verifiedPhone: status.identityVerified,
                status: Object.values(status).every(Boolean) ? 'ACTIVE' : prev.status
              }));
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default InstructorManagementDashboard;