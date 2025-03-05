import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  Box,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Link,
  Paper
} from '@mui/material';
import {
  GraduationCap,
  Briefcase,
  Code,
  User,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Facebook,
  Linkedin,
  Instagram,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

const ProfileTab = ({ instructor }) => {
  if (!instructor) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="text.secondary">
          Instructor information not available
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Bio Section */}
      <Grid item xs={12}>
        <Card variant="outlined">
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              <User size={20} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
              Biography
            </Typography>
            <Typography variant="body1">
              {instructor.bio || 'No biography provided.'}
            </Typography>
          </Box>
        </Card>
      </Grid>

      {/* Education Section */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              <GraduationCap size={20} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
              Education
            </Typography>
            
            {instructor.educations && instructor.educations.length > 0 ? (
              <List>
                {instructor.educations.map((education, index) => (
                  <React.Fragment key={education.id || index}>
                    {index > 0 && <Divider component="li" variant="inset" />}
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <GraduationCap size={20} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {education.degree}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" component="span">
                              {education.university}
                            </Typography>
                            {education.startYear && education.endYear && (
                              <Typography variant="body2" color="text.secondary">
                                {education.startYear} - {education.endYear}
                              </Typography>
                            )}
                            {education.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {education.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No education information provided.</Typography>
            )}
          </Box>
        </Card>
      </Grid>

      {/* Work Experience Section */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              <Briefcase size={20} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
              Work Experience
            </Typography>
            
            {instructor.experiences && instructor.experiences.length > 0 ? (
              <List>
                {instructor.experiences.map((experience, index) => (
                  <React.Fragment key={experience.id || index}>
                    {index > 0 && <Divider component="li" variant="inset" />}
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          <Briefcase size={20} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {experience.position}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" component="span">
                              {experience.company}
                            </Typography>
                            {experience.startYear && experience.endYear && (
                              <Typography variant="body2" color="text.secondary">
                                {experience.startYear} - {experience.endYear}
                              </Typography>
                            )}
                            {experience.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {experience.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No work experience information provided.</Typography>
            )}
          </Box>
        </Card>
      </Grid>

      {/* Skills Section */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              <Code size={20} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
              Skills
            </Typography>
            
            {instructor.skills && instructor.skills.length > 0 ? (
              <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                {instructor.skills.map((skill, index) => (
                  <Chip
                    key={skill.id || index}
                    label={skill.skillName}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No skills information provided.</Typography>
            )}
          </Box>
        </Card>
      </Grid>

      {/* Social Links Section */}
      <Grid item xs={12} md={6}>
        <Card variant="outlined">
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              <Globe size={20} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
              Social Links
            </Typography>
            
            {instructor.social ? (
              <List>
                {instructor.social.facebookUrl && (
                  <ListItem>
                    <ListItemIcon>
                      <Facebook size={20} color="#1877F2" />
                    </ListItemIcon>
                    <ListItemText>
                      <Link href={instructor.social.facebookUrl} target="_blank" rel="noopener noreferrer">
                        Facebook Profile
                      </Link>
                    </ListItemText>
                  </ListItem>
                )}
                
                {instructor.social.linkedinUrl && (
                  <ListItem>
                    <ListItemIcon>
                      <Linkedin size={20} color="#0A66C2" />
                    </ListItemIcon>
                    <ListItemText>
                      <Link href={instructor.social.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        LinkedIn Profile
                      </Link>
                    </ListItemText>
                  </ListItem>
                )}
                
                {instructor.social.instagramUrl && (
                  <ListItem>
                    <ListItemIcon>
                      <Instagram size={20} color="#E4405F" />
                    </ListItemIcon>
                    <ListItemText>
                      <Link href={instructor.social.instagramUrl} target="_blank" rel="noopener noreferrer">
                        Instagram Profile
                      </Link>
                    </ListItemText>
                  </ListItem>
                )}
                
                {instructor.social.googleUrl && (
                  <ListItem>
                    <ListItemIcon>
                      <Globe size={20} color="#4285F4" />
                    </ListItemIcon>
                    <ListItemText>
                      <Link href={instructor.social.googleUrl} target="_blank" rel="noopener noreferrer">
                        Website
                      </Link>
                    </ListItemText>
                  </ListItem>
                )}
              </List>
            ) : (
              <Typography color="text.secondary">No social links provided.</Typography>
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

ProfileTab.propTypes = {
  instructor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    bio: PropTypes.string,
    educations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        degree: PropTypes.string,
        university: PropTypes.string,
        startYear: PropTypes.number,
        endYear: PropTypes.number,
        description: PropTypes.string
      })
    ),
    experiences: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        position: PropTypes.string,
        company: PropTypes.string,
        startYear: PropTypes.number,
        endYear: PropTypes.number,
        description: PropTypes.string
      })
    ),
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        skillName: PropTypes.string
      })
    ),
    social: PropTypes.shape({
      facebookUrl: PropTypes.string,
      googleUrl: PropTypes.string,
      instagramUrl: PropTypes.string,
      linkedinUrl: PropTypes.string
    })
  })
};

export default React.memo(ProfileTab);