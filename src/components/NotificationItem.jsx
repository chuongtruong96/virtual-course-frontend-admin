import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Paper,
  Tooltip,
  Badge,
  Divider
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  BookOpen,
  DollarSign,
  Settings,
  Eye,
  CreditCard,
  Award,
  User,
  FileText,
  MessageCircle,
  Info
} from 'lucide-react';

/**
 * NotificationItem component displays a single notification with appropriate styling based on type
 * 
 * @param {Object} props
 * @param {Object} props.notification - The notification object containing all notification data
 * @param {Function} props.onMarkAsRead - Callback when mark as read button is clicked
 * @param {Function} props.onView - Callback when view button is clicked
 * @param {Function} props.onClick - Callback when the notification item is clicked
 */
const NotificationItem = ({
  notification,
  onMarkAsRead,
  onView,
  onClick
}) => {
  // Handle missing or malformed notification data
  if (!notification) {
    console.warn('NotificationItem received null or undefined notification');
    return null;
  }
  
  // Safely extract notification properties with fallbacks
  const {
    id = 'unknown',
    content = 'No content provided',
    type = 'SYSTEM',
    sentAt = new Date().toISOString(),
    isRead = false,
    courseId,
    paymentId,
    userId,
    actionUrl
  } = notification;
  
  // Format the date
  let formattedDate;
  try {
    formattedDate = formatDistanceToNow(new Date(sentAt), { addSuffix: true });
  } catch (error) {
    console.warn('Error formatting date:', error);
    formattedDate = 'Unknown date';
  }
  
  // Handle click events
  const handleClick = () => {
    if (onClick) onClick(id);
  };
  
  const handleMarkAsRead = (event) => {
    event.stopPropagation();
    if (onMarkAsRead) onMarkAsRead(id);
  };
  
  const handleView = (event) => {
    event.stopPropagation();
    if (onView) onView(id);
  };
  
  // Get icon based on notification type
  const getIcon = () => {
    const iconProps = { size: 20 };
    
    // Normalize type to uppercase for comparison
    const normalizedType = type?.toUpperCase() || 'SYSTEM';
    
    if (normalizedType.includes('COURSE') || normalizedType.includes('CRS')) {
      return <BookOpen {...iconProps} />;
    } else if (normalizedType.includes('PAYMENT') || normalizedType.includes('WALLET')) {
      return <DollarSign {...iconProps} />;
    } else if (normalizedType.includes('INST')) {
      return <Award {...iconProps} />;
    } else if (normalizedType.includes('ACC')) {
      return <User {...iconProps} />;
    } else if (normalizedType.includes('WITHDRAWAL')) {
      return <CreditCard {...iconProps} />;
    } else if (normalizedType.includes('ASSIGNMENT') || normalizedType.includes('TEST')) {
      return <FileText {...iconProps} />;
    } else if (normalizedType.includes('ENROLLMENT')) {
      return <BookOpen {...iconProps} />;
    } else if (normalizedType.includes('ALERT')) {
      return <AlertCircle {...iconProps} />;
    } else if (normalizedType.includes('MESSAGE')) {
      return <MessageCircle {...iconProps} />;
    } else {
      return <Bell {...iconProps} />;
    }
  };
  
  // Get color based on notification type
  const getColor = () => {
    // Normalize type to uppercase for comparison
    const normalizedType = type?.toUpperCase() || 'SYSTEM';
    
    if (normalizedType.includes('COURSE') || normalizedType.includes('CRS')) {
      return 'primary';
    } else if (normalizedType.includes('PAYMENT') || normalizedType.includes('WALLET')) {
      return 'success';
    } else if (normalizedType.includes('INST')) {
      return 'secondary';
    } else if (normalizedType.includes('ALERT') || normalizedType.includes('REJCT')) {
      return 'error';
    } else if (normalizedType.includes('APPRV')) {
      return 'success';
    } else if (normalizedType.includes('PENDING') || normalizedType.includes('SUBMT')) {
      return 'warning';
    } else {
      return 'info';
    }
  };
  
  // Get type display name
  const getTypeDisplayName = () => {
    // Normalize type for display
    const normalizedType = type || 'SYSTEM';
    
    // Convert from camelCase or snake_case to Title Case with spaces
    return normalizedType
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
      .trim();
  };
  
  return (
    <Paper
      elevation={isRead ? 0 : 1}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        borderLeft: (theme) => `4px solid ${theme.palette[getColor()].main}`,
        bgcolor: (theme) => isRead ? theme.palette.background.default : theme.palette.background.paper,
        '&:hover': {
          boxShadow: onClick ? 2 : isRead ? 0 : 1,
          bgcolor: (theme) => onClick ? theme.palette.action.hover : isRead ? theme.palette.background.default : theme.palette.background.paper
        }
      }}
      onClick={handleClick}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box display="flex" alignItems="center">
          <Badge
            color={getColor()}
            variant="dot"
            invisible={isRead}
            sx={{ mr: 2 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: (theme) => theme.palette[getColor()].light,
                color: (theme) => theme.palette[getColor()].main
              }}
            >
              {getIcon()}
            </Box>
          </Badge>
          
          <Box>
            <Box display="flex" alignItems="center" mb={0.5}>
              <Chip
                size="small"
                label={getTypeDisplayName()}
                color={getColor()}
                sx={{ mr: 1, fontSize: '0.7rem' }}
              />
              <Typography variant="caption" color="textSecondary">
                {formattedDate}
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {content}
            </Typography>
            
            {(courseId || paymentId || userId) && (
              <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                {courseId && (
                  <Chip
                    size="small"
                    label={`Course ID: ${courseId}`}
                    variant="outlined"
                    color="primary"
                  />
                )}
                
                {paymentId && (
                  <Chip
                    size="small"
                    label={`Payment ID: ${paymentId}`}
                    variant="outlined"
                    color="success"
                  />
                )}
                
                {userId && (
                  <Chip
                    size="small"
                    label={`User ID: ${userId}`}
                    variant="outlined"
                    color="info"
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>
        
        <Box display="flex">
          {!isRead && (
            <Tooltip title="Mark as read">
              <IconButton size="small" onClick={handleMarkAsRead} color="primary">
                <CheckCircle size={18} />
              </IconButton>
            </Tooltip>
          )}
          
          {(actionUrl || onView) && (
            <Tooltip title="View details">
              <IconButton size="small" onClick={handleView} color="primary">
                <Eye size={18} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default NotificationItem;