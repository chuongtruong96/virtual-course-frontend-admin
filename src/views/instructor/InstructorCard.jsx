import React from 'react';
import { Card, Box, Typography, Button, Chip, Avatar } from '@mui/material';
import { Eye, CheckCircle, XCircle, Mail, Phone, MapPin } from 'lucide-react';
import { UPLOAD_PATH } from '../../config/endpoints';

const InstructorCard = ({ instructor, onApprove, onReject, onViewDetail }) => {
  // Construct the image URL
  const imageUrl = instructor.photo && !instructor.photo.startsWith('http') 
    ? `${UPLOAD_PATH.INSTRUCTOR}/${instructor.photo}` 
    : instructor.photo;

  return (
    <Card sx={{ p: 2 }}>
      <Box display="flex" gap={2}>
        <Avatar
          src={imageUrl}
          alt={`${instructor.firstName} ${instructor.lastName}`}
          sx={{ width: 80, height: 80 }}
        />
        <Box flex={1}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6">
                {instructor.firstName} {instructor.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {instructor.title || 'Instructor'}
              </Typography>
            </Box>
            <Chip
              label={instructor.status}
              color={instructor.status === 'ACTIVE' ? 'success' : 'warning'}
              size="small"
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1} mt={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Mail size={16} />
              <Typography variant="body2">{instructor.email}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Phone size={16} />
              <Typography variant="body2">{instructor.phone || 'Not provided'}</Typography>
            </Box>
            {instructor.address && (
              <Box display="flex" alignItems="center" gap={1}>
                <MapPin size={16} />
                <Typography variant="body2">{instructor.address}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box display="flex" gap={1} mt={3} justifyContent="flex-end">
        <Button
          variant="outlined"
          size="small"
          startIcon={<Eye size={16} />}
          onClick={onViewDetail}
        >
          View
        </Button>
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
      </Box>
    </Card>
  );
};

export default InstructorCard;