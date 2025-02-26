// src/views/course/CourseDetail.jsx
import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Book,
  Clock,
  DollarSign,
  User,
  Calendar,
  Star,
  BarChart2,
  FileText,
  Award,
  ArrowLeft,
  Hash,
  Video,
  List,
  History
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import CourseService from '../../services/courseService';
import CourseApprovalHistory from './CourseApprovalHistory';
import { UPLOAD_PATH } from '../../config/endpoints';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);

  const {
    data: course,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['course', id],
    queryFn: () => CourseService.fetchById(id)
  });

  const {
    data: approvalHistory,
    isLoading: historyLoading
  } = useQuery({
    queryKey: ['course-approval-history', id],
    queryFn: () => CourseService.getApprovalHistory(id)
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error?.message || 'Failed to load course details'}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => navigate('/dashboard/course/list')}
        >
          Back to Courses
        </Button>
        <Button
          variant="outlined"
          startIcon={<History />}
          onClick={() => setShowHistory(true)}
        >
          View Approval History
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Info */}
        <Grid item xs={12}>
          <Card>
            <Box p={3}>
              <Box display="flex" alignItems="center" gap={3} mb={3}>
                <Avatar
                  src={course.imageCover ? `${UPLOAD_PATH.COURSE}/${course.imageCover}` : undefined}
                  variant="rounded"
                  sx={{ width: 120, height: 120 }}
                >
                  <Book size={40} />
                </Avatar>
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {course.titleCourse}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Chip
                      label={course.status}
                      color={course.status === 'ACTIVE' ? 'success' : 'warning'}
                    />
                    <Chip label={course.level} color="info" />
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Book size={20} />
                      <Typography>Category: {course.categoryName}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Clock size={20} />
                      <Typography>Duration: {course.duration} hours</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DollarSign size={20} />
                      <Typography>
                        Price: ${course.basePrice?.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Hash size={20} />
                      <Typography>Tags: {course.hashtag || 'None'}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <User size={20} />
                      <Typography>
                        Instructor: {course.instructorFirstName} {course.instructorLastName}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Video size={20} />
                      <Typography>
                        Preview Video: {course.urlVideo ? 'Available' : 'Not available'}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <List size={20} />
                      <Typography>
                        Sections: {course.sections?.length || 0}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Star size={20} />
                      <Typography>Progress: {course.progress || 0}%</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <Card>
            <Box p={3}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography>
                {course.description || 'No description available.'}
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Sections */}
        {course.sections?.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <Box p={3}>
                <Typography variant="h6" gutterBottom>
                  Course Content
                </Typography>
                <Box>
                  {course.sections.map((section, index) => (
                    <Box key={section.id} mb={3}>
                      <Typography variant="subtitle1" gutterBottom>
                        {index + 1}. {section.titleSection}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {section.numOfLectures} lectures • {section.sessionDuration} minutes
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Approval History Dialog */}
      <Dialog
        open={showHistory}
        onClose={() => setShowHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Course Approval History</DialogTitle>
        <DialogContent>
          {historyLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <CourseApprovalHistory history={approvalHistory || []} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CourseDetail;
