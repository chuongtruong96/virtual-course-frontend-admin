import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Rating,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Paper
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import {
  MoreVertical,
  MessageCircle,
  Edit,
  Trash2,
  Flag,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

/**
 * ReviewItem component displays a single review with user information, rating, and content
 * 
 * @param {Object} props
 * @param {Object} props.review - The review object containing all review data
 * @param {boolean} props.showActions - Whether to show action buttons
 * @param {Function} props.onReply - Callback when reply button is clicked
 * @param {Function} props.onEdit - Callback when edit button is clicked
 * @param {Function} props.onDelete - Callback when delete button is clicked
 * @param {Function} props.onClick - Callback when the review item is clicked
 * @param {Function} props.onApprove - Callback when approve button is clicked
 * @param {Function} props.onReject - Callback when reject button is clicked
 * @param {Function} props.onReport - Callback when report button is clicked
 */
const ReviewItem = ({
  review,
  showActions = true,
  onReply,
  onEdit,
  onDelete,
  onClick,
  onApprove,
  onReject,
  onReport
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  // Handle missing or malformed review data
  if (!review) {
    console.warn('ReviewItem received null or undefined review');
    return null;
  }
  
  // Safely extract review properties with fallbacks
  const {
    id = 'unknown',
    content = 'No content provided',
    rating = 0,
    createdAt = new Date().toISOString(),
    status = 'PENDING',
    user = {},
    course = {}
  } = review;
  
  // Safely extract nested properties with fallbacks
  const userName = user?.name || 'Anonymous User';
  const userAvatar = user?.avatarUrl || '';
  const courseTitle = course?.title || 'Unknown Course';
  
  // Format the date
  let formattedDate;
  try {
    formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  } catch (error) {
    console.warn('Error formatting date:', error);
    formattedDate = 'Unknown date';
  }
  
  // Handle menu open/close
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };
  
  // Handle action clicks
  const handleReply = (event) => {
    event.stopPropagation();
    handleMenuClose();
    if (onReply) onReply(id);
  };
  
  const handleEdit = (event) => {
    event.stopPropagation();
    handleMenuClose();
    if (onEdit) onEdit(id);
  };
  
  const handleDelete = (event) => {
    event.stopPropagation();
    handleMenuClose();
    if (onDelete) onDelete(id);
  };
  
  const handleApprove = (event) => {
    event.stopPropagation();
    handleMenuClose();
    if (onApprove) onApprove(id);
  };
  
  const handleReject = (event) => {
    event.stopPropagation();
    handleMenuClose();
    if (onReject) onReject(id);
  };
  
  const handleReport = (event) => {
    event.stopPropagation();
    handleMenuClose();
    if (onReport) onReport(id);
  };
  
  const handleClick = () => {
    if (onClick) onClick(id);
  };
  
  // Determine status color
  const getStatusColor = () => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: onClick ? 3 : 1,
          bgcolor: (theme) => onClick ? theme.palette.action.hover : 'inherit'
        }
      }}
      onClick={handleClick}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box display="flex" alignItems="center">
          <Avatar
            src={userAvatar}
            alt={userName}
            sx={{ width: 40, height: 40, mr: 1.5 }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="medium">
              {userName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {courseTitle}
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" alignItems="center">
          <Chip
            size="small"
            label={status || 'PENDING'}
            color={getStatusColor()}
            sx={{ mr: 1, textTransform: 'capitalize' }}
          />
          
          {showActions && (
            <>
              <Tooltip title="Actions">
                <IconButton
                  size="small"
                  onClick={handleMenuClick}
                  aria-controls={open ? 'review-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <MoreVertical size={18} />
                </IconButton>
              </Tooltip>
              
              <Menu
                id="review-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {onReply && (
                  <MenuItem onClick={handleReply}>
                    <ListItemIcon>
                      <MessageCircle size={18} />
                    </ListItemIcon>
                    <ListItemText>Reply</ListItemText>
                  </MenuItem>
                )}
                
                {onEdit && (
                  <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                      <Edit size={18} />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                )}
                
                {onDelete && (
                  <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                      <Trash2 size={18} />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                )}
                
                {onApprove && (
                  <MenuItem onClick={handleApprove}>
                    <ListItemIcon>
                      <CheckCircle size={18} />
                    </ListItemIcon>
                    <ListItemText>Approve</ListItemText>
                  </MenuItem>
                )}
                
                {onReject && (
                  <MenuItem onClick={handleReject}>
                    <ListItemIcon>
                      <XCircle size={18} />
                    </ListItemIcon>
                    <ListItemText>Reject</ListItemText>
                  </MenuItem>
                )}
                
                {onReport && (
                  <MenuItem onClick={handleReport}>
                    <ListItemIcon>
                      <Flag size={18} />
                    </ListItemIcon>
                    <ListItemText>Report</ListItemText>
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </Box>
      </Box>
      
      <Box mt={2}>
        <Rating value={Number(rating) || 0} readOnly precision={0.5} />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
          {formattedDate}
        </Typography>
      </Box>
      
      <Typography variant="body1" sx={{ mt: 1.5, whiteSpace: 'pre-wrap' }}>
        {content || 'No review content provided.'}
      </Typography>
    </Paper>
  );
};

export default ReviewItem;