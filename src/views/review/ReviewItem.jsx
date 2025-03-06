import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
  Chip,
  IconButton,
  TextField,
  Button,
  Divider,
  Collapse,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  MessageCircle,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  Flag,
  CheckCircle,
  Clock,
  Reply,
  ChevronDown,
  ChevronUp,
  User,
  Book
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * ReviewItem Component - Displays a single review with user info, rating, and content
 * 
 * @param {Object} props
 * @param {Object} props.review - The review object containing all review data
 * @param {Function} props.onReply - Function to handle reply submission
 * @param {Function} props.onEdit - Function to handle edit action
 * @param {Function} props.onDelete - Function to handle delete action
 * @param {Function} props.onFlag - Function to handle flag/report action
 * @param {boolean} props.showActions - Whether to show action buttons (default: true)
 * @param {boolean} props.showCourse - Whether to show course info (default: true)
 * @param {boolean} props.compact - Whether to show in compact mode (default: false)
 * @param {Function} props.onClick - Function to handle click on the entire review
 */
const ReviewItem = ({
  review,
  onReply,
  onEdit,
  onDelete,
  onFlag,
  showActions = true,
  showCourse = true,
  compact = false,
  onClick
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(!compact);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Handle null or undefined review
  if (!review) {
    return null;
  }
  
  // Extract review data with fallbacks for missing properties
  const {
    id,
    content = 'No review content provided.',
    rating = 0,
    createdAt = new Date().toISOString(),
    user = { name: 'Anonymous User', avatarUrl: '' },
    course = { title: 'Unknown Course' },
    status = 'APPROVED',
    instructorReply
  } = review;
  
  // Format date to relative time (e.g., "2 days ago")
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  // Handle menu open/close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle reply submission
  const handleReplySubmit = () => {
    if (onReply && replyText.trim()) {
      onReply(id, replyText);
      setReplyText('');
      setReplyOpen(false);
    }
  };
  
  // Handle actions
  const handleEdit = () => {
    if (onEdit) onEdit(id);
    handleMenuClose();
  };
  
  const handleDelete = () => {
    if (onDelete) onDelete(id);
    handleMenuClose();
  };
  
  const handleFlag = () => {
    if (onFlag) onFlag(id);
    handleMenuClose();
  };
  
  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'APPROVED':
        return theme.palette.success.main;
      case 'PENDING':
        return theme.palette.warning.main;
      case 'REJECTED':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };
  
  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle size={16} />;
      case 'PENDING':
        return <Clock size={16} />;
      case 'REJECTED':
        return <Trash2 size={16} />;
      default:
        return null;
    }
  };
  
  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderRadius: 2,
        boxShadow: 1,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 3
        } : {}
      }}
      onClick={onClick ? () => onClick(id) : undefined}
    >
      <CardContent sx={{ p: compact ? 1.5 : 2 }}>
        {/* Header - User info, rating, and date */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center">
            <Avatar 
              src={user.avatarUrl} 
              alt={user.name}
              sx={{ 
                width: compact ? 32 : 40, 
                height: compact ? 32 : 40,
                mr: 1.5,
                bgcolor: theme.palette.primary.main
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
            </Avatar>
            <Box>
              <Typography variant={compact ? "body2" : "body1"} fontWeight="medium">
                {user.name}
              </Typography>
              {showCourse && (
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Book size={12} style={{ marginRight: 4 }} />
                  {course.title}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center">
            <Rating 
              value={rating} 
              readOnly 
              size={compact ? "small" : "medium"}
              icon={<Star filled style={{ color: theme.palette.warning.main }} />}
              emptyIcon={<Star style={{ color: theme.palette.grey[300] }} />}
              sx={{ mr: 1 }}
            />
            
            {status && (
              <Tooltip title={`Status: ${status}`}>
                <Chip
                  size="small"
                  label={status}
                  icon={getStatusIcon()}
                  sx={{
                    bgcolor: alpha(getStatusColor(), 0.1),
                    color: getStatusColor(),
                    borderRadius: 1,
                    mr: 1,
                    height: 24
                  }}
                />
              </Tooltip>
            )}
            
            {showActions && (
              <>
                <IconButton size="small" onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e);
                }}>
                  <MoreVertical size={16} />
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={(e) => e.stopPropagation()}
                >
                  {onEdit && (
                    <MenuItem onClick={handleEdit}>
                      <ListItemIcon>
                        <Edit size={16} />
                      </ListItemIcon>
                      <ListItemText>Edit Review</ListItemText>
                    </MenuItem>
                  )}
                  {onDelete && (
                    <MenuItem onClick={handleDelete}>
                      <ListItemIcon>
                        <Trash2 size={16} color={theme.palette.error.main} />
                      </ListItemIcon>
                      <ListItemText sx={{ color: theme.palette.error.main }}>Delete Review</ListItemText>
                    </MenuItem>
                  )}
                  {onFlag && (
                    <MenuItem onClick={handleFlag}>
                      <ListItemIcon>
                        <Flag size={16} color={theme.palette.warning.main} />
                      </ListItemIcon>
                      <ListItemText>Report Review</ListItemText>
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </Box>
        </Box>
        
        {/* Date */}
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ display: 'block', mb: 1 }}
        >
          {formattedDate}
        </Typography>
        
        {/* Review content */}
        <Collapse in={expanded} collapsedSize={compact ? 40 : 80}>
          <Typography 
            variant={compact ? "body2" : "body1"} 
            color="text.primary"
            sx={{ 
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: expanded ? 'unset' : (compact ? 2 : 3),
              WebkitBoxOrient: 'vertical',
            }}
          >
            {content}
          </Typography>
        </Collapse>
        
        {/* Expand/collapse button for long reviews */}
        {content.length > 150 && (
          <Button 
            size="small" 
            variant="text" 
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            startIcon={expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            sx={{ mb: 1, p: 0 }}
          >
            {expanded ? 'Show less' : 'Show more'}
          </Button>
        )}
        
        {/* Instructor reply */}
        {instructorReply && (
          <Box 
            sx={{ 
              mt: 2, 
              p: 1.5, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 1,
              borderLeft: `3px solid ${theme.palette.primary.main}`
            }}
          >
            <Typography variant="body2" fontWeight="medium" color="primary.main">
              Instructor Response:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {instructorReply}
            </Typography>
          </Box>
        )}
        
        {/* Reply section */}
        {showActions && onReply && !instructorReply && (
          <>
            {!replyOpen ? (
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<Reply size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setReplyOpen(true);
                }}
                sx={{ mt: 1 }}
              >
                Reply
              </Button>
            ) : (
              <Box 
                sx={{ mt: 2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Divider sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Write your reply..."
                  variant="outlined"
                  size="small"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => {
                      setReplyOpen(false);
                      setReplyText('');
                    }}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim()}
                  >
                    Submit Reply
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewItem;