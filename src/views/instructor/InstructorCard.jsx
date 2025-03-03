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
  Tooltip
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
  Star
} from 'lucide-react';
import { UPLOAD_PATH, DEFAULT_IMAGES } from '../../config/endpoints';
import { format } from 'date-fns';

const InstructorCard = React.memo(({ 
  instructor, 
  onApprove, 
  onReject, 
  onViewDetail,
  props,
  metrics 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Đường dẫn đến hình ảnh mặc định
  const defaultImagePath = '/images/instructor/default-instructor.jpg';
  
  // Kiểm tra xem hình ảnh mặc định có tồn tại không
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

  // In InstructorCard.jsx, update the getImageUrl function:

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

// Add this to handle image loading errors
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

// In InstructorCard.jsx, update the PropTypes definition:

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
    createdAt: PropTypes.string
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