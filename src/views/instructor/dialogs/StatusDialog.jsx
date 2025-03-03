import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  UserCheck,
  UserX,
  UserCog
} from 'lucide-react';

/**
 * StatusDialog component for confirming instructor status changes
 * with optional notes and different visual treatments based on action type.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls dialog visibility
 * @param {string} props.action - The status action being performed (approve, reject, suspend, etc.)
 * @param {string} props.note - Note text for the status change
 * @param {Function} props.onNoteChange - Callback for note text changes
 * @param {Function} props.onClose - Callback when dialog is closed
 * @param {Function} props.onConfirm - Callback when action is confirmed
 * @returns {JSX.Element}
 */
const StatusDialog = ({ 
  open, 
  action, 
  note, 
  onNoteChange, 
  onClose, 
  onConfirm 
}) => {
  // Early return if no action is provided
  if (!action) return null;

  // Configuration for different status actions
  const actionConfig = {
    approve: {
      title: 'Approve Instructor',
      description: 'This will approve the instructor and grant them access to the platform. They will be able to create and manage courses.',
      icon: <UserCheck size={24} color="#4caf50" />,
      confirmText: 'Approve',
      confirmColor: 'success',
      alertType: 'success',
      noteLabel: 'Approval Note (Optional)'
    },
    reject: {
      title: 'Reject Instructor',
      description: 'This will reject the instructor application. They will not be able to access the platform or create courses.',
      icon: <UserX size={24} color="#f44336" />,
      confirmText: 'Reject',
      confirmColor: 'error',
      alertType: 'error',
      noteLabel: 'Rejection Reason (Required)',
      noteRequired: true
    },
    suspend: {
      title: 'Suspend Instructor',
      description: 'This will temporarily suspend the instructor. They will not be able to access the platform until reinstated.',
      icon: <Clock size={24} color="#ff9800" />,
      confirmText: 'Suspend',
      confirmColor: 'warning',
      alertType: 'warning',
      noteLabel: 'Suspension Reason (Required)',
      noteRequired: true
    },
    reinstate: {
      title: 'Reinstate Instructor',
      description: 'This will reinstate the instructor and restore their access to the platform and their courses.',
      icon: <CheckCircle size={24} color="#4caf50" />,
      confirmText: 'Reinstate',
      confirmColor: 'success',
      alertType: 'success',
      noteLabel: 'Reinstatement Note (Optional)'
    },
    terminate: {
      title: 'Terminate Instructor',
      description: 'This will permanently terminate the instructor account. This action cannot be undone.',
      icon: <XCircle size={24} color="#f44336" />,
      confirmText: 'Terminate',
      confirmColor: 'error',
      alertType: 'error',
      noteLabel: 'Termination Reason (Required)',
      noteRequired: true
    },
    review: {
      title: 'Flag for Review',
      description: 'This will flag the instructor account for administrative review. The instructor will maintain current access until review is complete.',
      icon: <AlertTriangle size={24} color="#ff9800" />,
      confirmText: 'Flag for Review',
      confirmColor: 'warning',
      alertType: 'warning',
      noteLabel: 'Review Reason (Required)',
      noteRequired: true
    },
    update: {
      title: 'Update Status',
      description: 'Update the instructor\'s status with additional information or requirements.',
      icon: <UserCog size={24} color="#2196f3" />,
      confirmText: 'Update Status',
      confirmColor: 'primary',
      alertType: 'info',
      noteLabel: 'Status Update Note (Required)',
      noteRequired: true
    }
  };

  // Get configuration for current action, or use default
  const config = actionConfig[action] || {
    title: 'Update Status',
    description: 'Update the instructor status.',
    icon: <UserCog size={24} />,
    confirmText: 'Confirm',
    confirmColor: 'primary',
    alertType: 'info',
    noteLabel: 'Note'
  };

  // Check if form is valid for submission
  const isValid = !config.noteRequired || (note && note.trim().length > 0);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            {config.icon}
            <Typography variant="h6" component="span" ml={1}>
              {config.title}
            </Typography>
          </Box>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        <Alert severity={config.alertType} sx={{ mb: 3 }}>
          {config.description}
        </Alert>
        
        <TextField
          autoFocus
          margin="dense"
          id="note"
          label={config.noteLabel}
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          required={config.noteRequired}
          error={config.noteRequired && (!note || note.trim().length === 0)}
          helperText={config.noteRequired && (!note || note.trim().length === 0) 
            ? "This field is required" 
            : ""}
        />
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={config.confirmColor}
          disabled={!isValid}
        >
          {config.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusDialog;