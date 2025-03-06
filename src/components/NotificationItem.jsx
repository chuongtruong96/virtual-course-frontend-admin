import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Bell,
  Calendar,
  CheckCircle,
  ExternalLink,
  User,
  BookOpen,
  DollarSign,
  AlertTriangle,
  MessageCircle,
  Award,
  Eye,
  Clock
} from 'lucide-react';

/**
 * NotificationItem Component
 * 
 * A component for displaying notification items in a list
 * 
 * @param {Object} props
 * @param {Object} props.notification - The notification data to display
 * @param {Function} props.onView - Function to call when viewing the notification
 * @param {Function} props.onMarkAsRead - Function to call when marking as read
 */
const NotificationItem = ({ 
  notification, 
  onView, 
  onMarkAsRead 
}) => {
  const theme = useTheme();
  const [isMarking, setIsMarking] = useState(false);
  
  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      // If it's today, show time
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // If it's within the last week, show day name
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      if (date > lastWeek) {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // Otherwise show full date
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Get icon based on notification type
  const getNotificationIcon = () => {
    if (!notification?.type) return <Bell size={20} />;
    
    const iconMap = {
      'course_approval': <BookOpen size={20} />,
      'instructor_approval': <User size={20} />,
      'payment': <DollarSign size={20} />,
      'review': <MessageCircle size={20} />,
      'achievement': <Award size={20} />,
      'warning': <AlertTriangle size={20} />,
      'system': <Bell size={20} />
    };
    
    return iconMap[notification.type] || <Bell size={20} />;
  };
  
  // Get color based on notification type
  const getNotificationColor = () => {
    if (!notification?.type) return theme.palette.primary;
    
    const colorMap = {
      'course_approval': theme.palette.success,
      'instructor_approval': theme.palette.info,
      'payment': theme.palette.success,
      'review': theme.palette.primary,
      'achievement': theme.palette.warning,
      'warning': theme.palette.error,
      'system': theme.palette.secondary
    };
    
    return colorMap[notification.type] || theme.palette.primary;
  };
  
  const color = getNotificationColor();
  
  // Handle view notification
  const handleView = () => {
    if (onView && notification?.id) {
      onView(notification.id);
    }
  };
  
  // Handle mark as read
  const handleMarkAsRead = async (e) => {
    e.stopPropagation();
    if (onMarkAsRead && notification?.id && !notification?.isRead) {
      setIsMarking(true);
      try {
        await onMarkAsRead(notification.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      } finally {
        setIsMarking(false);
      }
    }
  };
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        transition: 'all 0.2s',
        bgcolor: notification?.isRead ? 'transparent' : alpha(color.light || color.main, 0.05),
        borderLeft: notification?.isRead ? 
          `1px solid ${alpha(theme.palette.divider, 0.8)}` : 
          `3px solid ${color.main}`,
        '&:hover': {
          boxShadow: 2,
          cursor: 'pointer'
        }
      }}
      onClick={handleView}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box display="flex" alignItems="flex-start">
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: alpha(color.main, 0.1),
              color: color.main
            }}
          >
            {getNotificationIcon()}
          </Avatar>
          
          <Box ml={2}>
            <Typography variant="subtitle2" fontWeight="medium">
              {notification?.title || 'Notification'}
            </Typography>
            
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              {notification?.message || 'No message provided'}
            </Typography>
            
            <Box display="flex" alignItems="center" mt={1}>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <Calendar size={14} style={{ marginRight: 4 }} />
                {formatDate(notification?.createdAt)}
              </Typography>
              
              {notification?.sender && (
                <>
                  <Box component="span" sx={{ mx: 0.5, color: 'text.disabled' }}>•</Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <User size={14} style={{ marginRight: 4 }} />
                    {notification.sender}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>
        
        <Box display="flex" alignItems="center">
          {!notification?.isRead && (
            <Chip
              size="small"
              label="New"
              sx={{
                bgcolor: alpha(color.main, 0.1),
                color: color.main,
                fontWeight: 'medium',
                height: 24,
                mr: 1
              }}
            />
          )}
          
          <Box>
            <Tooltip title={notification?.isRead ? "Already read" : "Mark as read"}>
              <IconButton 
                size="small"
                onClick={handleMarkAsRead}
                disabled={notification?.isRead || isMarking}
                color={notification?.isRead ? "default" : "primary"}
              >
                {isMarking ? (
                  <CircularProgress size={16} color="inherit" />
                ) : notification?.isRead ? (
                  <CheckCircle size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      
      {notification?.actionUrl && (
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Tooltip title="View details">
            <IconButton 
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                window.open(notification.actionUrl, '_blank');
              }}
            >
              <ExternalLink size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Paper>
  );
};

export default NotificationItem;