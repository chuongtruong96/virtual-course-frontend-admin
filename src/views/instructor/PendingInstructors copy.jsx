import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';
import useInstructors from '../../hooks/useInstructors';
import InstructorCard from './InstructorCard';

const PendingInstructors = () => {
  const navigate = useNavigate();
  const { pendingInstructors, isLoading, isError, error, approveInstructor, rejectInstructor } = useInstructors('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectDialog, setRejectDialog] = useState({ open: false, instructor: null });
  const [rejectReason, setRejectReason] = useState('');
  const [approvalChecklist, setApprovalChecklist] = useState({
    credentialsVerified: false,
    qualificationsChecked: false,
    backgroundVerified: false,
    documentsComplete: false
  });

  const filteredInstructors = pendingInstructors?.filter(instructor =>
    instructor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleApprove = (instructor) => {
    if (!Object.values(approvalChecklist).every(Boolean)) {
      alert('Please complete all checklist items before approving');
      return;
    }
    approveInstructor(instructor.id);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (rejectDialog.instructor) {
      rejectInstructor({
        instructorId: rejectDialog.instructor.id,
        reason: rejectReason
      });
      setRejectDialog({ open: false, instructor: null });
      setRejectReason('');
    }
  };

  const handleChecklistChange = (field) => {
    setApprovalChecklist(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        <AlertTriangle size={16} className="me-2" />
        {error?.message || 'Failed to load instructors'}
      </Alert>
    );
  }

  return (
    <Card>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            Pending Instructors
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              placeholder="Search instructors..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {filteredInstructors.length === 0 ? (
          <Alert severity="info">
            No pending instructors found
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredInstructors.map((instructor) => (
              <Grid item xs={12} md={6} key={instructor.id}>
                <InstructorCard
                  instructor={instructor}
                  onApprove={() => handleApprove(instructor)}
                  onReject={() => setRejectDialog({ open: true, instructor })}
                  onViewDetail={() => navigate(`/dashboard/instructor/detail/${instructor.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Reject Dialog */}
        <Dialog
          open={rejectDialog.open}
          onClose={() => setRejectDialog({ open: false, instructor: null })}
        >
          <DialogTitle>Reject Instructor Application</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please provide a reason for rejecting {rejectDialog.instructor?.firstName} {rejectDialog.instructor?.lastName}'s application.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Rejection Reason"
              fullWidth
              multiline
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectDialog({ open: false, instructor: null })}>
              Cancel
            </Button>
            <Button onClick={handleReject} color="error" disabled={!rejectReason.trim()}>
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Card>
  );
};

export default PendingInstructors;