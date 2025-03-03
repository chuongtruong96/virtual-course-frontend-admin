// src/components/instructor/PendingInstructors.jsx
import React, { useState, useMemo, useContext } from 'react'; // Thêm useContext
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Tooltip,
  IconButton,
  Rating
} from '@mui/material';
import {
  Search,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  RefreshCw
} from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { useInstructors } from '../../hooks/useInstructors';
import InstructorCard from './InstructorCard';
import { APPROVAL_CRITERIA, COMMON_REJECTION_REASONS } from '../../constants/instructorApproval';
import { NotificationContext } from '../../contexts/NotificationContext';
import { useQueryClient } from '@tanstack/react-query';

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <Alert 
    severity="error" 
    action={
      <Button onClick={resetErrorBoundary}>Try again</Button>
    }
  >
    <AlertTriangle size={20} style={{ marginRight: 8 }} />
    {error.message}
  </Alert>
);

const PendingInstructors = () => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);
  const queryClient = useQueryClient();
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogs, setDialogs] = useState({
    approve: { open: false, instructor: null },
    reject: { open: false, instructor: null }
  });
  const [approvalData, setApprovalData] = useState({
    activeStep: 0,
    evaluations: {},
    overallRating: 0,
    notes: ''
  });
  const [rejectData, setRejectData] = useState({
    category: '',
    reason: '',
    customReason: ''
  });

  // Fetch pending instructors
  const {
    instructors: pendingInstructors,
    isLoading,
    isError,
    error,
    approveInstructor,
    rejectInstructor,
    refetch
  } = useInstructors('pending');

  // Filtered instructors based on search
  const filteredInstructors = useMemo(() => {
    if (!pendingInstructors) return [];
    
    return pendingInstructors.filter(instructor =>
      instructor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pendingInstructors, searchTerm]);

  // Dialog handlers
  const handleApproveClick = (instructor) => {
    setDialogs(prev => ({
      ...prev,
      approve: { open: true, instructor }
    }));
    setApprovalData({
      activeStep: 0,
      evaluations: {},
      overallRating: 0,
      notes: ''
    });
  };

  const handleRejectClick = (instructor) => {
    setDialogs(prev => ({
      ...prev,
      reject: { open: true, instructor }
    }));
    setRejectData({
      category: '',
      reason: '',
      customReason: ''
    });
  };

  // Approval process handlers
  const handleEvaluationChange = (criteriaId, value) => {
    setApprovalData(prev => ({
      ...prev,
      evaluations: {
        ...prev.evaluations,
        [criteriaId]: value
      }
    }));
  };

  const handleApprovalStepChange = (direction) => {
    setApprovalData(prev => ({
      ...prev,
      activeStep: prev.activeStep + (direction === 'next' ? 1 : -1)
    }));
  };

  const isStepComplete = (step) => {
    if (step === 0) {
      const requiredCriteria = APPROVAL_CRITERIA.filter(c => c.required);
      return requiredCriteria.every(c => approvalData.evaluations[c.id]);
    }
    if (step === 1) {
      return approvalData.overallRating > 0;
    }
    return true;
  };

  const canApprove = () => {
    const requiredCriteria = APPROVAL_CRITERIA.filter(c => c.required);
    const allRequiredMet = requiredCriteria.every(c =>
      approvalData.evaluations[c.id] && approvalData.evaluations[c.id] !== 'below'
    );
    return (
      allRequiredMet && 
      approvalData.overallRating >= 3 && 
      approvalData.notes.trim().length > 0
    );
  };

  // Submit handlers
  const handleApprove = () => {
    if (!canApprove()) return;
    
    const { instructor } = dialogs.approve;
    
    const detailedNotes = `
        Overall Rating: ${approvalData.overallRating}/5 stars
        ${Object.entries(approvalData.evaluations).map(([key, value]) => {
            const criteria = APPROVAL_CRITERIA.find(c => c.id === key);
            const option = criteria?.options.find(o => o.value === value);
            return `${criteria?.label}: ${option?.label}`;
        }).join('\n')}
        Additional Notes: ${approvalData.notes}
    `.trim();
    
    approveInstructor({
        instructorId: instructor.id,
        notes: detailedNotes,
        onSuccess: () => {
            // Chỉ đóng dialog và hiển thị thông báo khi approve thành công
            addNotification(`Instructor ${instructor.firstName} ${instructor.lastName} has been approved successfully!`, 'success');
            
            // Refresh danh sách thông báo
            queryClient.invalidateQueries(['notifications']);
            
            setDialogs(prev => ({
                ...prev,
                approve: { open: false, instructor: null }
            }));
        }
    });
  };

  const handleReject = () => {
    const { instructor } = dialogs.reject;
    const finalReason = rejectData.category === 'custom' 
      ? rejectData.customReason 
      : `${rejectData.category}: ${rejectData.reason}`;

    if (!finalReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    rejectInstructor({
      instructorId: instructor.id,
      reason: finalReason,
      onSuccess: () => {
        setDialogs(prev => ({
          ...prev,
          reject: {
            ...prev.reject,
            open: false
          }
        }));
        
        // Reset rejection data
        setRejectData({
          category: '',
          reason: '',
          customReason: ''
        });
        
        // Show success notification
        addNotification(`Instructor ${instructor.firstName} ${instructor.lastName} has been rejected`, 'error');
        
        // Refresh notification list
        queryClient.invalidateQueries(['notifications']);
        
        // Refresh instructor list
        refetch();
      },
      onError: (error) => {
        console.error('Error rejecting instructor:', error);
        addNotification('Failed to reject instructor. Please try again.', 'error');
      }
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={() => refetch()}
          >
            Retry
          </Button>
        }
      >
        <AlertTriangle size={20} style={{ marginRight: 8 }} />
        {error?.message || 'Failed to load pending instructors'}
      </Alert>
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setSearchTerm('');
        refetch();
      }}
    >
      <Card>
        <Box p={3}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2">
              Instructor Approval
            </Typography>
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

          {/* Instructor List */}
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
                    onApprove={() => handleApproveClick(instructor)}
                    onReject={() => handleRejectClick(instructor)}
                    onViewDetail={() => navigate(`/dashboard/instructor/detail/${instructor.id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Approve Dialog */}
          <Dialog
            open={dialogs.approve.open}
            onClose={() => setDialogs(prev => ({ ...prev, approve: { open: false, instructor: null } }))}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Box display="flex" alignItems="center">
                <CheckCircle color="success" size={24} style={{ marginRight: 8 }} />
                Approve Instructor Application
              </Box>
            </DialogTitle>
            <DialogContent>
              {/* Instructor Info */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  {dialogs.approve.instructor?.firstName} {dialogs.approve.instructor?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {dialogs.approve.instructor?.accountEmail}
                </Typography>
              </Box>

              {/* Stepper */}
              <Stepper activeStep={approvalData.activeStep} sx={{ mb: 4 }}>
                <Step key="evaluation">
                  <StepLabel>Criteria Evaluation</StepLabel>
                </Step>
                <Step key="overall">
                  <StepLabel>Overall Assessment</StepLabel>
                </Step>
                <Step key="notes">
                  <StepLabel>Notes & Confirmation</StepLabel>
                </Step>
              </Stepper>

              {/* Step Content */}
              {approvalData.activeStep === 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Evaluate by Criteria
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Please evaluate the candidate according to each criterion below.
                    Criteria marked with (*) are required.
                  </Typography>

                  {APPROVAL_CRITERIA.map((criteria) => (
                    <Paper key={criteria.id} sx={{ p: 2, mb: 2 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {criteria.label} {criteria.required && <span style={{ color: 'red' }}>*</span>}
                        </Typography>
                        <Tooltip title={criteria.description}>
                          <IconButton size="small">
                            <HelpCircle size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <RadioGroup
                        value={approvalData.evaluations[criteria.id] || ''}
                        onChange={(e) => handleEvaluationChange(criteria.id, e.target.value)}
                      >
                        {criteria.options.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="body2">{option.label}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.description}
                                </Typography>
                              </Box>
                            }
                          />
                        ))}
                      </RadioGroup>
                    </Paper>
                  ))}
                </Box>
              )}

              {approvalData.activeStep === 1 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Overall Assessment
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Based on the criteria evaluation, please provide an overall assessment.
                    A minimum of 3 stars is required for approval.
                  </Typography>

                  <Box display="flex" alignItems="center" mb={3}>
                    <Rating
                      value={approvalData.overallRating}
                      onChange={(event, newValue) => {
                        setApprovalData(prev => ({ ...prev, overallRating: newValue }));
                      }}
                      size="large"
                      precision={0.5}
                    />
                    <Typography variant="body2" ml={2}>
  {approvalData.overallRating === 0 && 'Not rated'}
  {approvalData.overallRating > 0 && approvalData.overallRating < 3 && 'Below requirements'}
  {approvalData.overallRating >= 3 && approvalData.overallRating < 4 && 'Meets requirements'}
  {approvalData.overallRating >= 4 && 'Excellent'}
</Typography>
</Box>

{/* Evaluation Summary */}
<Typography variant="subtitle1" fontWeight="bold" gutterBottom>
  Evaluation Summary
</Typography>
<Paper sx={{ p: 2 }}>
  {Object.entries(approvalData.evaluations).map(([key, value]) => {
    const criteria = APPROVAL_CRITERIA.find(c => c.id === key);
    const option = criteria?.options.find(o => o.value === value);
    return (
      <Box key={key} display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2">{criteria?.label}:</Typography>
        <Typography
          variant="body2"
          color={
            value === 'exceeds' ? 'success.main' :
            value === 'meets' ? 'primary.main' :
            'error.main'
          }
        >
          {option?.label}
        </Typography>
      </Box>
    );
  })}
</Paper>
</Box>
)}

{approvalData.activeStep === 2 && (
<Box>
  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
    Notes & Confirmation
  </Typography>
  <Typography variant="body2" color="text.secondary" paragraph>
    Please provide additional notes about your approval decision.
    This information will be saved and may be shared with the instructor.
  </Typography>

  <TextField
    label="Approval Notes"
    fullWidth
    multiline
    rows={4}
    value={approvalData.notes}
    onChange={(e) => setApprovalData(prev => ({ ...prev, notes: e.target.value }))}
    placeholder="Enter notes about your approval decision..."
    required
    variant="outlined"
    sx={{ mb: 3 }}
  />

  <Alert severity="info" sx={{ mb: 2 }}>
    <Typography variant="body2">
      When approved, the instructor account will be activated and they can begin creating courses.
      Ensure that you have thoroughly evaluated all criteria.
    </Typography>
  </Alert>

  <Paper sx={{ p: 2, bgcolor: 'success.light' }}>
    <Box display="flex" alignItems="center">
      <CheckCircle color="success" size={24} style={{ marginRight: 8 }} />
      <Typography variant="body1" fontWeight="bold">
        Ready for Approval
      </Typography>
    </Box>
    <Typography variant="body2" mt={1}>
      Overall Rating: {approvalData.overallRating}/5 stars
    </Typography>
  </Paper>
</Box>
)}
</DialogContent>
<DialogActions>
<Button 
  onClick={() => setDialogs(prev => ({ 
    ...prev, 
    approve: { open: false, instructor: null } 
  }))}
>
  Cancel
</Button>
{approvalData.activeStep > 0 && (
  <Button onClick={() => handleApprovalStepChange('back')}>
    Back
  </Button>
)}
{approvalData.activeStep < 2 ? (
  <Button
    onClick={() => handleApprovalStepChange('next')}
    variant="contained"
    color="primary"
    disabled={!isStepComplete(approvalData.activeStep)}
  >
    Next
  </Button>
) : (
  <Button
    onClick={handleApprove}
    variant="contained"
    color="success"
    disabled={!canApprove()}
  >
    Approve Instructor
  </Button>
)}
</DialogActions>
</Dialog>

{/* Reject Dialog */}
<Dialog
open={dialogs.reject.open}
onClose={() => setDialogs(prev => ({ ...prev, reject: { open: false, instructor: null } }))}
maxWidth="md"
fullWidth
>
<DialogTitle>
  <Box display="flex" alignItems="center">
    <AlertTriangle color="error" size={24} style={{ marginRight: 8 }} />
    Reject Instructor Application
  </Box>
</DialogTitle>
<DialogContent>
  <Box mb={3}>
    <Typography variant="h6" gutterBottom>
      {dialogs.reject.instructor?.firstName} {dialogs.reject.instructor?.lastName}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Email: {dialogs.reject.instructor?.accountEmail}
    </Typography>
  </Box>

  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
    Rejection Reason
  </Typography>
  <Typography variant="body2" color="text.secondary" paragraph>
    Please select a category and reason for rejection or provide a custom reason.
    This information will be sent to the applicant.
  </Typography>

  <FormControl fullWidth sx={{ mb: 3 }}>
    <FormLabel>Select Category</FormLabel>
    <RadioGroup
      value={rejectData.category}
      onChange={(e) => setRejectData(prev => ({ 
        ...prev, 
        category: e.target.value,
        reason: ''
      }))}
    >
      {COMMON_REJECTION_REASONS.map((category) => (
        <FormControlLabel
          key={category.category}
          value={category.category}
          control={<Radio />}
          label={category.category}
        />
      ))}
      <FormControlLabel
        value="custom"
        control={<Radio />}
        label="Other Reason"
      />
    </RadioGroup>
  </FormControl>

  {rejectData.category && rejectData.category !== 'custom' && (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <FormLabel>Select Specific Reason</FormLabel>
      <RadioGroup
        value={rejectData.reason}
        onChange={(e) => setRejectData(prev => ({ 
          ...prev, 
          reason: e.target.value 
        }))}
      >
        {COMMON_REJECTION_REASONS
          .find(cat => cat.category === rejectData.category)
          ?.reasons.map((reason, index) => (
            <FormControlLabel
              key={index}
              value={reason}
              control={<Radio />}
              label={reason}
            />
          ))}
      </RadioGroup>
    </FormControl>
  )}

  {rejectData.category === 'custom' && (
    <TextField
      label="Custom Rejection Reason"
      fullWidth
      multiline
      rows={4}
      value={rejectData.customReason}
      onChange={(e) => setRejectData(prev => ({ 
        ...prev, 
        customReason: e.target.value 
      }))}
      placeholder="Enter detailed rejection reason..."
      required
      variant="outlined"
      sx={{ mb: 3 }}
    />
  )}

  <Alert severity="warning">
    <Typography variant="body2">
      Rejecting the application will change the account status to "REJECTED".
      The applicant will receive a notification with the rejection reason.
    </Typography>
  </Alert>
</DialogContent>
<DialogActions>
  <Button 
    onClick={() => setDialogs(prev => ({ 
      ...prev, 
      reject: { open: false, instructor: null } 
    }))}
  >
    Cancel
  </Button>
  <Button
    onClick={handleReject}
    variant="contained"
    color="error"
    disabled={
      (rejectData.category !== 'custom' && !rejectData.reason) ||
      (rejectData.category === 'custom' && !rejectData.customReason.trim()) ||
      !rejectData.category
    }
  >
    Reject Application
  </Button>
</DialogActions>
</Dialog>
</Box>
</Card>
</ErrorBoundary>
);
};

export default PendingInstructors;