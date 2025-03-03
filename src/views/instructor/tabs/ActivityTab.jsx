import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { 
  Search, 
  Clock, 
  LogIn, 
  LogOut, 
  Edit, 
  FileText, 
  BookOpen,
  UserCheck,
  AlertTriangle,
  Calendar,
  Mail,
  Phone,
  Award,
  Settings
} from 'lucide-react';

/**
 * ActivityTab component displays a chronological log of instructor activities
 * with filtering and categorization.
 * 
 * @param {Object} props
 * @param {Array} props.activityLog - Array of activity log objects
 * @returns {JSX.Element}
 */
const ActivityTab = ({ activityLog = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Activity type icon mapping
  const activityIcons = {
    login: <LogIn size={20} color="#2196f3" />,
    logout: <LogOut size={20} color="#757575" />,
    profile_update: <Edit size={20} color="#ff9800" />,
    document_upload: <FileText size={20} color="#4caf50" />,
    course_created: <BookOpen size={20} color="#9c27b0" />,
    course_updated: <Edit size={20} color="#9c27b0" />,
    status_change: <UserCheck size={20} color="#f44336" />,
    certification_added: <Award size={20} color="#2196f3" />,
    email_changed: <Mail size={20} color="#ff9800" />,
    phone_changed: <Phone size={20} color="#ff9800" />,
    system_notification: <AlertTriangle size={20} color="#f44336" />,
    settings_changed: <Settings size={20} color="#757575" />
  };

  // Filter activities based on search term and filter
  const filteredActivities = activityLog.filter(activity => {
    const matchesSearch = 
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || activity.type === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Get unique activity types for filter dropdown
  const activityTypes = ['all', ...new Set(activityLog.map(activity => activity.type))];

  // Format date with time
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  if (!activityLog || activityLog.length === 0) {
    return (
      <Box py={4} textAlign="center">
        <Typography color="textSecondary">
          No activity records found for this instructor.
        </Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box mb={3}>
          <Typography variant="h6" component="h2" gutterBottom>
            <Clock size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Activity History
          </Typography>
          
          <Box display="flex" gap={2} mt={2}>
            <TextField
              size="small"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filter}
                label="Filter by Type"
                onChange={(e) => setFilter(e.target.value)}
              >
                {activityTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type === 'all' ? 'All Activities' : type.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {filteredActivities.length === 0 ? (
          <Box py={4} textAlign="center">
            <Typography color="textSecondary">
              No matching activities found.
            </Typography>
          </Box>
        ) : (
          <Paper variant="outlined" sx={{ maxHeight: 500, overflow: 'auto' }}>
            <List>
              {filteredActivities.map((activity, index) => (
                <React.Fragment key={activity.id || index}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      {activityIcons[activity.type] || <Clock size={20} />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1" fontWeight="medium">
                            {activity.description}
                          </Typography>
                          <Chip
                            icon={<Calendar size={14} />}
                            label={formatDateTime(activity.timestamp)}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box mt={1}>
                          {activity.details && (
                            <Typography variant="body2" color="textSecondary" component="span">
                              {activity.details}
                            </Typography>
                          )}
                          {activity.ipAddress && (
                            <Typography variant="caption" display="block" color="textSecondary" mt={0.5}>
                              IP: {activity.ipAddress}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTab;