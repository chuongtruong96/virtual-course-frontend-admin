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

const InstructorList = () => {
  const navigate = useNavigate();
  const { instructors, isLoading, isError, error, approveInstructor, rejectInstructor } = useInstructors('all'); // Changed from pendingInstructors to instructors
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rejectDialog, setRejectDialog] = useState({ open: false, instructor: null });
  const [rejectReason, setRejectReason] = useState('');

  const filteredInstructors = instructors?.filter(instructor =>
    (instructor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || instructor.status === statusFilter)
  ) || [];

  const handleApprove = (instructor) => {
    approveInstructor(instructor.id);
  };

  const handleReject = () => {
    if (rejectDialog.instructor) {
      rejectInstructor({
        instructorId: rejectDialog.instructor.id,
        reason: rejectReason
      });
      setRejectDialog({ open: false, instructor: null });
      setRejectReason('');
    }
  };

  const openRejectDialog = (instructor) => {
    setRejectDialog({ open: true, instructor });
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
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <Filter size={20} />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {filteredInstructors.length === 0 ? (
          <Alert severity="info">
            No instructors found matching your criteria
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredInstructors.map((instructor) => (
              <Grid item xs={12} md={6} key={instructor.id}>
                <InstructorCard
                  instructor={instructor}
                  onApprove={() => handleApprove(instructor)}
                  onReject={() => openRejectDialog(instructor)}
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

export default InstructorList;