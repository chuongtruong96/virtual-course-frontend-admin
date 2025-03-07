import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormHelperText
} from '@mui/material';

const RejectionDialog = ({ open, onClose, onReject, title, content }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    
    onReject(reason);
    setReason('');
    setError('');
  };

  const handleClose = () => {
    onClose();
    setReason('');
    setError('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          {content}
        </Typography>
        <TextField
          label="Reason for Rejection"
          multiline
          rows={4}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (e.target.value.trim()) setError('');
          }}
          fullWidth
          margin="normal"
          placeholder="Explain why this instructor application is being rejected..."
          error={!!error}
          required
        />
        {error && <FormHelperText error>{error}</FormHelperText>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="error">
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
};

RejectionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
};

export default RejectionDialog;