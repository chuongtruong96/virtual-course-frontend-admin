import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  alpha,
  useTheme
} from '@mui/material';
import {
  CheckCircle,
  XCircle,
  User,
  BookOpen,
  Calendar,
  Clock,
  Info,
  AlertTriangle
} from 'lucide-react';

/**
 * ApprovalItem Component
 * 
 * A component for displaying items that need approval (courses, instructors, etc.)
 * with approve/reject actions
 * 
 * @param {Object} props
 * @param {Object} props.item - The item data to display
 * @param {Function} props.onApprove - Function to call when approving
 * @param {Function} props.onReject - Function to call when rejecting
 * @param {string} props.type - Type of item ('course' or 'instructor')
 */
const ApprovalItem = ({ 
  item, 
  onApprove, 
  onReject, 
  type = 'course' 
}) => {
  const theme = useTheme();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Handle approve action
  const handleApprove = async () => {
    if (!item?.id) return;
    
    setIsApproving(true);
    try {
      await onApprove(item.id);
    } catch (error) {
      console.error('Error approving item:', error);
    } finally {
      setIsApproving(false);
    }
  };
  
  // Handle reject action
  const handleReject = async () => {
    if (!item?.id) return;
    
    setIsRejecting(true);
    try {
      await onReject(item.id, rejectReason);
      setRejectDialogOpen(false);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting item:', error);
    } finally {
      setIsRejecting(false);
    }
  };
  
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
  
  // Get appropriate icon based on item type
  const getItemIcon = () => {
    return type === 'instructor' ? (
      <User size={20} />
    ) : (
      <BookOpen size={20} />
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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                bgcolor: type === 'instructor' 
                  ? alpha(theme.palette.info.main, 0.1) 
                  : alpha(theme.palette.success.main, 0.1),
                color: type === 'instructor' 
                  ? theme.palette.info.main 
                  : theme.palette.success.main,
                width: 40,
                height: 40,
                mr: 2
              }}
            >
              {getItemIcon()}
            </Avatar>
            
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {type === 'instructor' ? item?.name || 'Unnamed Instructor' : item?.title || 'Untitled Course'}
              </Typography>
              
              <Box display="flex" alignItems="center" mt={0.5}>
                {type === 'instructor' ? (
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <User size={14} style={{ marginRight: 4 }} />
                    {item?.email || 'No email provided'}
                  </Typography>
                ) : (
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <User size={14} style={{ marginRight: 4 }} />
                    {item?.instructor?.name || 'Unknown instructor'}
                  </Typography>
                )}
                
                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 14 }} />
                
                <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Calendar size={14} style={{ marginRight: 4 }} />
                  {formatDate(item?.createdAt || item?.submittedAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center">
            <Tooltip title="View details">
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => setDetailsDialogOpen(true)}
                sx={{ mr: 1 }}
              >
                <Info size={18} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Approve">
              <span>
                <IconButton
                  size="small"
                  color="success"
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting}
                  sx={{ mr: 1 }}
                >
                  {isApproving ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
            
            <Tooltip title="Reject">
              <span>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setRejectDialogOpen(true)}
                  disabled={isApproving || isRejecting}
                >
                  {isRejecting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <XCircle size={18} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Status chip */}
        <Box mt={1}>
          <Chip
            size="small"
            label="Pending Approval"
            icon={<Clock size={14} />}
            sx={{
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              color: theme.palette.warning.main,
              fontWeight: 'medium',
              '& .MuiChip-icon': {
                color: 'inherit'
              }
            }}
          />
        </Box>
      </Paper>
      
      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <AlertTriangle size={20} color={theme.palette.error.main} style={{ marginRight: 8 }} />
            Reject {type === 'instructor' ? 'Instructor' : 'Course'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Please provide a reason for rejecting this {type === 'instructor' ? 'instructor' : 'course'}.
            This will be sent to the {type === 'instructor' ? 'user' : 'instructor'}.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for rejection"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleReject} 
            color="error" 
            variant="contained"
            disabled={!rejectReason.trim() || isRejecting}
          >
            {isRejecting ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {type === 'instructor' ? 'Instructor Details' : 'Course Details'}
        </DialogTitle>
        <DialogContent>
          {type === 'instructor' ? (
            <Box>
              <Typography variant="h6">{item?.name || 'Unnamed Instructor'}</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {item?.email || 'No email provided'}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Qualifications
              </Typography>
              <Typography variant="body2" paragraph>
                {item?.qualifications || 'No qualifications provided'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Bio
              </Typography>
              <Typography variant="body2" paragraph>
                {item?.bio || 'No bio provided'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Experience
              </Typography>
              <Typography variant="body2" paragraph>
                {item?.experience || 'No experience information provided'}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6">{item?.title || 'Untitled Course'}</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                By {item?.instructor?.name || 'Unknown instructor'}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" paragraph>
                {item?.description || 'No description provided'}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Category
              </Typography>
              <Typography variant="body2" paragraph>
                {item?.category?.name || 'Uncategorized'}
              </Typography>
              
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Price
                  </Typography>
                  <Typography variant="body2">
                    {item?.price ? `${item.price.toLocaleString}VND` : 'Free'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Duration
                  </Typography>
                  <Typography variant="body2">
                    {item?.duration || 'Not specified'}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Level
                  </Typography>
                  <Typography variant="body2">
                    {item?.level || 'Not specified'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)} color="primary">
            Close
          </Button>
          <Button 
            onClick={handleApprove} 
            color="success" 
            variant="contained"
            disabled={isApproving}
            startIcon={isApproving ? <CircularProgress size={16} /> : <CheckCircle size={16} />}
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApprovalItem;