import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Briefcase,
  Copy,
  ExternalLink
} from 'lucide-react';

/**
 * ContactInformation component displays instructor contact details
 * in a structured list format with icons.
 * 
 * @param {Object} props
 * @param {Object} props.instructor - Instructor data object
 * @returns {JSX.Element}
 */
const ContactInformation = ({ instructor }) => {
  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Handle case when instructor is undefined or null
  if (!instructor) {
    return (
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Contact Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No contact information available
        </Typography>
      </Box>
    );
  }

  // Contact items with icons and actions
  const contactItems = [
    {
      icon: <Mail size={20} color="#1976d2" />,
      primary: 'Email',
      secondary: instructor.email || 'Not provided',
      action: instructor.email && (
        <Tooltip title="Copy email">
          <IconButton 
            size="small" 
            onClick={() => copyToClipboard(instructor.email)}
          >
            <Copy size={16} />
          </IconButton>
        </Tooltip>
      )
    },
    {
      icon: <Phone size={20} color="#4caf50" />,
      primary: 'Phone',
      secondary: instructor.phone || 'Not provided',
      action: instructor.phone && (
        <Tooltip title="Copy phone">
          <IconButton 
            size="small" 
            onClick={() => copyToClipboard(instructor.phone)}
          >
            <Copy size={16} />
          </IconButton>
        </Tooltip>
      )
    },
    {
      icon: <MapPin size={20} color="#f44336" />,
      primary: 'Location',
      secondary: instructor.location || 'Not specified',
      action: null
    },
    {
      icon: <Globe size={20} color="#9c27b0" />,
      primary: 'Website',
      secondary: instructor.website || 'Not provided',
      action: instructor.website && (
        <Tooltip title="Visit website">
          <IconButton 
            size="small" 
            component="a" 
            href={instructor.website} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink size={16} />
          </IconButton>
        </Tooltip>
      )
    },
    {
      icon: <Calendar size={20} color="#ff9800" />,
      primary: 'Joined',
      secondary: instructor.joinDate 
        ? new Date(instructor.joinDate).toLocaleDateString() 
        : 'Unknown',
      action: null
    },
    {
      icon: <Briefcase size={20} color="#607d8b" />,
      primary: 'Employment',
      secondary: instructor.employmentType || 'Not specified',
      action: null
    }
  ];

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Contact Information
      </Typography>
      
      <List dense disablePadding>
        {contactItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Divider component="li" variant="inset" />}
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" color="text.secondary">
                    {item.primary}
                  </Typography>
                }
                secondary={
                  item.secondary && typeof item.secondary === 'string' && item.secondary.includes('http') ? (
                    <Link 
                      href={item.secondary} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      {item.secondary}
                    </Link>
                  ) : (
                    <Typography variant="body1">
                      {item.secondary}
                    </Typography>
                  )
                }
              />
              {item.action}
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ContactInformation;