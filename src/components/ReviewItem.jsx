import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Rating,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  alpha,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Star,
  MessageCircle,
  Calendar,
  User,
  Flag,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash,
  ExternalLink
} from 'lucide-react';

/**
 * ReviewItem Component
 * 
 * A component for displaying course reviews with admin actions
 * 
 * @param {Object} props
 * @param {Object} props.review - The review data to display
 * @param {Function} props.onDelete - Function to call when deleting a review
 * @param {Function} props.onFlag - Function to call when flagging a review
 * @param {Function} props.onApprove - Function to call when approving a review
 * @param {boolean} props.isAdmin - Whether the current user is an admin
 */
const ReviewItem = ({ 
  review, 
  onDelete, 
  onFlag, 
  onApprove,
  isAdmin = true
}) => {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  
  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Handle delete action
  const handleDelete = async () => {
    if (!review?.id || !onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(review.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle flag action
  const handleFlag = async () => {
    if (!review?.id || !onFlag) return;
    
    setIsFlagging(true);
    try {
      await onFlag(review.id, flagReason);
      setFlagDialogOpen(false);
      setFlagReason('');
    } catch (error) {
      console.error('Error flagging review:', error);
    } finally {
      setIsFlagging(false);
    }
  };
  
  // Handle approve action
  const handleApprove = async () => {
    if (!review?.id || !onApprove) return;
    
    setIsApproving(true);
    try {
      await onApprove(review.id);
    } catch (error) {
      console.error('Error approving review:', error);
    } finally {
      setIsApproving(false);
    }
  };
  
  // Get status chip based on review status
  const getStatusChip = () => {
    if (!review) return null;
    
    if (review.isApproved) {
      return (
        <Chip
          size="small"
          label="Approved"
          icon={<CheckCircle size={14} />}
          sx={{
            bgcolor: alpha(theme.palette.success.main, 0.1),
            color: theme.palette.success.main,
            fontWeight: 'medium',
            '& .MuiChip-icon': {
              color: 'inherit'
            }
          }}
        />
      );
    }
    
    if (review.isFlagged) {
      return (
        <Chip
          size="small"
          label="Flagged"
          icon={<Flag size={14} />}
          sx={{
            bgcolor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
            fontWeight: 'medium',
            '& .MuiChip-icon': {
              color: 'inherit'
            }
          }}
        />
      );
    }
    
    return (
      <Chip
        size="small"
        label="Pending"
        icon={<MessageCircle size={14} />}
        sx={{
          bgcolor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main,
          fontWeight: 'medium',
          '& .MuiChip-icon': {
            color: 'inherit'
          }
        }}
      />
    );
  };
  
  // Get user avatar
  const getUserAvatar = () => {
    const userName = review?.user?.name || 'User';
    const userInitial = userName.charAt(0).toUpperCase();
    
    return (
      <Avatar
        src={review?.user?.avatar || ''}
        alt={userName}
        sx={{
          width: 40,
          height: 40,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText
        }}
      >
        {userInitial}
      </Avatar>
    );
  };
  
  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: 2,
            borderColor: theme.palette.primary.main
          }
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex" alignItems="flex-start">
            {getUserAvatar()}
            
            <Box ml={2}>
              <Typography variant="subtitle1" fontWeight="medium">
                {review?.user?.name || 'Anonymous User'}
              </Typography>
              
              <Box display="flex" alignItems="center" mt={0.5}>
              <Rating 
                  value={review?.rating || 0} 
                  readOnly 
                  size="small" 
                  precision={0.5}
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="textSecondary">
                  {review?.rating?.toFixed(1) || '0.0'}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" mt={0.5}>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Calendar size={14} style={{ marginRight: 4 }} />
                  {formatDate(review?.createdAt)}
                </Typography>
                
                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 14 }} />
                
                <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <MessageCircle size={14} style={{ marginRight: 4 }} />
                  {review?.course?.title || 'Unknown Course'}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center">
            {getStatusChip()}
            
            {isAdmin && (
              <Box ml={1}>
                <Tooltip title="Actions">
                  <IconButton 
                    size="small"
                    onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                  >
                    <MoreVertical size={18} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>
        
        <Box mt={2}>
          <Typography variant="body2">
            {review?.content || 'No review content provided.'}
          </Typography>
        </Box>
        
        {isAdmin && (
          <Box display="flex" justifyContent="flex-end" mt={2}>
            {!review?.isApproved && (
              <Tooltip title="Approve Review">
                <IconButton 
                  size="small" 
                  color="success"
                  onClick={handleApprove}
                  disabled={isApproving}
                  sx={{ mr: 1 }}
                >
                  {isApproving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                </IconButton>
              </Tooltip>
            )}
            
            <Tooltip title="Flag Review">
              <IconButton 
                size="small" 
                color="warning"
                onClick={() => setFlagDialogOpen(true)}
                disabled={isFlagging}
                sx={{ mr: 1 }}
              >
                <Flag size={18} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Delete Review">
              <IconButton 
                size="small" 
                color="error"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <Trash size={18} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Paper>
      
      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Trash size={20} color={theme.palette.error.main} style={{ marginRight: 8 }} />
            Delete Review
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Flag Dialog */}
      <Dialog
        open={flagDialogOpen}
        onClose={() => setFlagDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Flag size={20} color={theme.palette.warning.main} style={{ marginRight: 8 }} />
            Flag Review
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Please provide a reason for flagging this review.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for flagging"
            fullWidth
            multiline
            rows={4}
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFlagDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleFlag} 
            color="warning" 
            variant="contained"
            disabled={!flagReason.trim() || isFlagging}
          >
            {isFlagging ? 'Flagging...' : 'Flag Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewItem;