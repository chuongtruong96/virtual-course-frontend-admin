import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Box,
  Avatar,
  Typography,
  Chip,
  Divider,
  Grid,
  IconButton,
  Tooltip
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
  Globe,
  Facebook,
  Linkedin,
  Instagram
} from 'lucide-react';
import { format } from 'date-fns';
import { UPLOAD_PATH } from '../../../config/endpoints';

const ProfileHeader = ({ instructor, statistics }) => {
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
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Contact Information
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Mail size={18} color="#1976d2" />
                  <Typography variant="body2">
                    {instructor.email || instructor.accountEmail || 'No email provided'}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone size={18} color="#4caf50" />
                  <Typography variant="body2">
                    {instructor.phone || 'No phone provided'}
                  </Typography>
                </Box>
                {instructor.address && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <MapPin size={18} color="#f44336" />
                    <Typography variant="body2">
                      {instructor.address}
                    </Typography>
                  </Box>
                )}
                {instructor.workplace && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Building size={18} color="#ff9800" />
                    <Typography variant="body2">
                      {instructor.workplace}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {instructor.social && (
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Social Links
                </Typography>
                <Box display="flex" gap={1}>
                  {instructor.social.facebookUrl && (
                    <Tooltip title="Facebook">
                      <IconButton 
                        color="primary" 
                        component="a" 
                        href={instructor.social.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook size={20} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {instructor.social.linkedinUrl && (
                    <Tooltip title="LinkedIn">
                      <IconButton 
                        color="primary" 
                        component="a" 
                        href={instructor.social.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin size={20} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {instructor.social.instagramUrl && (
                    <Tooltip title="Instagram">
                      <IconButton 
                        color="primary" 
                        component="a" 
                        href={instructor.social.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram size={20} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {instructor.social.googleUrl && (
                    <Tooltip title="Website">
                      <IconButton 
                        color="primary" 
                        component="a" 
                        href={instructor.social.googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe size={20} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Professional Summary */}
        {instructor.bio && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Professional Summary
              </Typography>
              <Typography variant="body2">
                {instructor.bio}
              </Typography>
            </Box>
          </>
        )}

        {/* Skills Preview */}
        {instructor.skills && instructor.skills.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Skills
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {instructor.skills.slice(0, 5).map((skill, index) => (
                  <Chip 
                    key={index} 
                    label={skill.skillName} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                ))}
                {instructor.skills.length > 5 && (
                  <Chip 
                    label={`+${instructor.skills.length - 5} more`} 
                    size="small" 
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </>
        )}
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

ProfileHeader.propTypes = {
  instructor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    title: PropTypes.string,
    email: PropTypes.string,
    accountEmail: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    workplace: PropTypes.string,
    photo: PropTypes.string,
    bio: PropTypes.string,
    status: PropTypes.string,
    gender: PropTypes.string,
    verifiedPhone: PropTypes.bool,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
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
  }),
  statistics: PropTypes.object
};

export default React.memo(ProfileHeader);