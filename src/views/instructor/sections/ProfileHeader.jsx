// src/components/instructor/sections/ProfileHeader.jsx
import React from 'react';
import {
  Card,
  Box,
  Avatar,
  Typography,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import {
  User,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe
} from 'lucide-react';
import { format } from 'date-fns';
import { UPLOAD_PATH } from '../../../config/endpoints';
import ContactInformation from './ContactInformation';

const ProfileHeader = ({ instructor }) => {
  const avatarUrl = instructor?.photo ? 
    (instructor.photo.startsWith('http') ? 
      instructor.photo : 
      `${UPLOAD_PATH.INSTRUCTOR}/${instructor.photo}`
    ) : undefined;

  return (
    <Card sx={{ mb: 3 }}>
      <Box p={3}>
        {/* Avatar and Basic Info */}
        <Box display="flex" alignItems="flex-start" mb={3}>
          <Avatar
            src={avatarUrl}
            alt={`${instructor.firstName} ${instructor.lastName}`}
            sx={{ width: 100, height: 100, mr: 3 }}
          >
            {instructor.firstName?.[0]}
          </Avatar>
          
          <Box flex={1}>
            {/* Name and Status */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4">
                  {instructor.firstName} {instructor.lastName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {instructor.title || 'Instructor'}
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  <StatusChip status={instructor.status} />
                  <GenderChip gender={instructor.gender} />
                  <VerificationChip verified={instructor.verifiedPhone} />
                </Box>
              </Box>
              
              {/* Dates */}
              <Box>
                <DateInfo
                  icon={<Calendar size={16} />}
                  label="Joined"
                  date={instructor.createdAt}
                />
                <DateInfo
                  icon={<Clock size={16} />}
                  label="Last updated"
                  date={instructor.updatedAt}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Contact and Social Info */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ContactInformation instructor={instructor} />
          </Grid>
          {instructor.social && (
            <Grid item xs={12} md={6}>
              <SocialLinks social={instructor.social} />
            </Grid>
          )}
        </Grid>
      </Box>
    </Card>
  );
};

// Helper Components
const StatusChip = React.memo(({ status }) => (
  <Chip
    label={status}
    color={
      status === 'ACTIVE' ? 'success' :
      status === 'PENDING' ? 'warning' :
      status === 'REJECTED' ? 'error' : 'default'
    }
  />
));

const GenderChip = React.memo(({ gender }) => (
  <Chip
    icon={<User size={16} />}
    label={gender || 'Not specified'}
    color="default"
    variant="outlined"
  />
));

const VerificationChip = React.memo(({ verified }) => (
  verified ? (
    <Chip
      icon={<CheckCircle size={16} />}
      label="Verified"
      color="success"
      variant="outlined"
    />
  ) : (
    <Chip
      icon={<XCircle size={16} />}
      label="Unverified"
      color="warning"
      variant="outlined"
    />
  )
));

const DateInfo = React.memo(({ icon, label, date }) => (
  <Typography variant="body2" color="text.secondary">
    {React.cloneElement(icon, { style: { verticalAlign: 'middle', marginRight: 4 } })}
    {label}: {date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A'}
  </Typography>
));

export default React.memo(ProfileHeader);
