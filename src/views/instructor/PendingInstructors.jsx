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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControlLabel,
  Checkbox,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Chip,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Search,
  AlertTriangle,
  CheckCircle,
  X,
  Check,
  ChevronDown,
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  HelpCircle,
  Info
} from 'lucide-react';
import useInstructors from '../../hooks/useInstructors';
import InstructorCard from './InstructorCard';

// Approval criteria
const APPROVAL_CRITERIA = [
  {
    id: 'qualifications',
    label: 'Educational Qualifications and Certifications',
    description: 'Candidate must have relevant degrees or certifications in the teaching field',
    required: true,
    options: [
      { value: 'exceeds', label: 'Exceeds Requirements', description: 'Has advanced degrees and multiple professional certifications' },
      { value: 'meets', label: 'Meets Requirements', description: 'Has appropriate degrees or certifications' },
      { value: 'below', label: 'Below Requirements', description: 'Lacks relevant degrees or certifications' }
    ]
  },
  {
    id: 'experience',
    label: 'Professional Experience',
    description: 'Candidate needs practical experience in the teaching field',
    required: true,
    options: [
      { value: 'exceeds', label: 'Exceeds Requirements', description: 'Over 5 years of professional experience' },
      { value: 'meets', label: 'Meets Requirements', description: '2-5 years of professional experience' },
      { value: 'below', label: 'Below Requirements', description: 'Less than 2 years of professional experience' }
    ]
  },
  {
    id: 'teachingSkills',
    label: 'Teaching Skills',
    description: 'Evaluation of the candidate\'s ability to convey knowledge',
    required: true,
    options: [
      { value: 'exceeds', label: 'Exceeds Requirements', description: 'Has teaching experience and excellent methodology' },
      { value: 'meets', label: 'Meets Requirements', description: 'Can clearly communicate knowledge' },
      { value: 'below', label: 'Below Requirements', description: 'Lacks necessary teaching skills' }
    ]
  },
  {
    id: 'courseQuality',
    label: 'Course Content Quality',
    description: 'Evaluation of sample course content or detailed syllabus',
    required: true,
    options: [
      { value: 'exceeds', label: 'Exceeds Requirements', description: 'Rich, up-to-date content with high practical application' },
      { value: 'meets', label: 'Meets Requirements', description: 'Complete content that aligns with course objectives' },
      { value: 'below', label: 'Below Requirements', description: 'Incomplete or outdated content' }
    ]
  },
  {
    id: 'profileCompleteness',
    label: 'Profile Completeness',
    description: 'Evaluation of the completeness and quality of profile information',
    required: false,
    options: [
      { value: 'exceeds', label: 'Exceeds Requirements', description: 'Complete, detailed, and professional profile' },
      { value: 'meets', label: 'Meets Requirements', description: 'Profile with all basic information' },
      { value: 'below', label: 'Below Requirements', description: 'Profile missing important information' }
    ]
  }
];

// Common rejection reasons
const COMMON_REJECTION_REASONS = [
  {
    category: 'Professional Qualifications',
    reasons: [
      'Lack of appropriate degrees or certifications for the teaching field',
      'Insufficient professional experience to ensure teaching quality',
      'No evidence of in-depth knowledge in the field'
    ]
  },
  {
    category: 'Teaching Skills',
    reasons: [
      'Lack of teaching or training experience',
      'Teaching methodology not suitable for online learning model',
      'Ability to convey knowledge is not clear or understandable'
    ]
  },
  {
    category: 'Course Content',
    reasons: [
      'Course syllabus lacks detail or is incomplete',
      'Course content is not up-to-date with current trends',
      'Lack of practical application in proposed content'
    ]
  },
  {
    category: 'Incomplete Profile',
    reasons: [
      'Missing important personal or contact information',
      'Insufficient documentation to prove professional qualifications',
      'Incomplete profile, missing many required details'
    ]
  }
];

const PendingInstructors = () => {
  const navigate = useNavigate();
  const { pendingInstructors, isLoading, isError, error, approveInstructor, rejectInstructor } = useInstructors('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectDialog, setRejectDialog] = useState({ open: false, instructor: null });
  const [approveDialog, setApproveDialog] = useState({ open: false, instructor: null });
  const [rejectReason, setRejectReason] = useState('');
  const [customRejectReason, setCustomRejectReason] = useState('');
  const [selectedRejectCategory, setSelectedRejectCategory] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [evaluations, setEvaluations] = useState({});
  const [overallRating, setOverallRating] = useState(0);

  const filteredInstructors = pendingInstructors?.filter(instructor =>
    instructor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleApproveClick = (instructor) => {
    setApproveDialog({ open: true, instructor });
    setActiveStep(0);
    setEvaluations({});
    setOverallRating(0);
    setApprovalNotes('');
  };

  const handleRejectClick = (instructor) => {
    setRejectDialog({ open: true, instructor });
    setRejectReason('');
    setCustomRejectReason('');
    setSelectedRejectCategory('');
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleEvaluationChange = (criteriaId, value) => {
    setEvaluations(prev => ({
      ...prev,
      [criteriaId]: value
    }));
  };

  const handleApprove = () => {
    // Check if all required criteria have been evaluated
    const requiredCriteria = APPROVAL_CRITERIA.filter(criteria => criteria.required);
    const allRequiredEvaluated = requiredCriteria.every(criteria => 
      evaluations[criteria.id] && evaluations[criteria.id] !== 'below'
    );

    if (!allRequiredEvaluated) {
      alert('Please evaluate all required criteria and ensure the candidate meets minimum requirements');
      return;
    }

    if (overallRating < 3) {
      alert('Overall rating must be at least 3 stars for approval');
      return;
    }

    if (approveDialog.instructor) {
      // Create detailed approval notes
      const detailedNotes = `
Overall Rating: ${overallRating}/5 stars
${Object.entries(evaluations).map(([key, value]) => {
  const criteria = APPROVAL_CRITERIA.find(c => c.id === key);
  const option = criteria?.options.find(o => o.value === value);
  return `${criteria?.label}: ${option?.label}`;
}).join('\n')}

Additional Notes: ${approvalNotes}
      `.trim();

      approveInstructor({
        instructorId: approveDialog.instructor.id,
        notes: detailedNotes
      });
      setApproveDialog({ open: false, instructor: null });
    }
  };

  const handleReject = () => {
    let finalReason = '';

    if (selectedRejectCategory && rejectReason) {
      finalReason = `${selectedRejectCategory}: ${rejectReason}`;
    } else if (customRejectReason) {
      finalReason = customRejectReason;
    } else {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!finalReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (rejectDialog.instructor) {
      rejectInstructor({
        instructorId: rejectDialog.instructor.id,
        reason: finalReason
      });
      setRejectDialog({ open: false, instructor: null });
    }
  };

  const isStepComplete = (step) => {
    if (step === 0) {
      // Check if all required criteria have been evaluated
      const requiredCriteria = APPROVAL_CRITERIA.filter(criteria => criteria.required);
      return requiredCriteria.every(criteria => evaluations[criteria.id]);
    }
    if (step === 1) {
      return overallRating > 0;
    }
    return true;
  };

  const canApprove = () => {
    // Check if all required criteria have been evaluated and meet requirements
    const requiredCriteria = APPROVAL_CRITERIA.filter(criteria => criteria.required);
    const allRequiredMet = requiredCriteria.every(criteria => 
      evaluations[criteria.id] && evaluations[criteria.id] !== 'below'
    );
    
    return allRequiredMet && overallRating >= 3 && approvalNotes.trim().length > 0;
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
            Instructor Approval
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
          open={approveDialog.open}
          onClose={() => setApproveDialog({ open: false, instructor: null })}
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
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                {approveDialog.instructor?.firstName} {approveDialog.instructor?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {approveDialog.instructor?.accountEmail}
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
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

            {activeStep === 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Evaluate by Criteria
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Please evaluate the candidate according to each criterion below. Criteria marked with (*) are required.
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
                      value={evaluations[criteria.id] || ''}
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

            {activeStep === 1 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Overall Assessment
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Based on the criteria evaluation, please provide an overall assessment of the candidate.
                  A minimum of 3 stars is required for approval.
                </Typography>

                <Box display="flex" alignItems="center" mb={3}>
                  <Rating
                    value={overallRating}
                    onChange={(event, newValue) => {
                      setOverallRating(newValue);
                    }}
                    size="large"
                    precision={0.5}
                  />
                  <Typography variant="body2" ml={2}>
                    {overallRating === 0 && 'Not rated'}
                    {overallRating > 0 && overallRating < 3 && 'Below requirements'}
                    {overallRating >= 3 && overallRating < 4 && 'Meets requirements'}
                    {overallRating >= 4 && 'Excellent'}
                  </Typography>
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Evaluation Summary
                </Typography>
                <Paper sx={{ p: 2 }}>
                  {Object.entries(evaluations).map(([key, value]) => {
                    const criteria = APPROVAL_CRITERIA.find(c => c.id === key);
                    const option = criteria?.options.find(o => o.value === value);
                    return (
                      <Box key={key} display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">{criteria?.label}:</Typography>
                        <Chip 
                          label={option?.label} 
                          size="small" 
                          color={
                            value === 'exceeds' ? 'success' : 
                            value === 'meets' ? 'primary' : 
                            'error'
                          }
                        />
                      </Box>
                    );
                  })}
                </Paper>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Notes & Confirmation
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Please provide additional notes about your approval decision.
                  This information will be saved in the record and may be shared with the instructor.
                </Typography>

                <TextField
                  label="Approval Notes"
                  fullWidth
                  multiline
                  rows={4}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Enter notes about your approval decision..."
                  required
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Approval Confirmation
                </Typography>
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
                    Overall Rating: {overallRating}/5 stars
                  </Typography>
                </Paper>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApproveDialog({ open: false, instructor: null })}>
              Cancel
            </Button>
            {activeStep > 0 && (
              <Button onClick={handleBack}>
                Back
              </Button>
            )}
            {activeStep < 2 ? (
              <Button 
                onClick={handleNext}
                variant="contained" 
                color="primary"
                disabled={!isStepComplete(activeStep)}
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
          open={rejectDialog.open}
          onClose={() => setRejectDialog({ open: false, instructor: null })}
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
                {rejectDialog.instructor?.firstName} {rejectDialog.instructor?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {rejectDialog.instructor?.accountEmail}
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
                value={selectedRejectCategory}
                onChange={(e) => setSelectedRejectCategory(e.target.value)}
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

            {selectedRejectCategory && selectedRejectCategory !== 'custom' && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel>Select Specific Reason</FormLabel>
                <RadioGroup
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                >
                  {COMMON_REJECTION_REASONS
                    .find(cat => cat.category === selectedRejectCategory)
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

            {selectedRejectCategory === 'custom' && (
              <TextField
                label="Custom Rejection Reason"
                fullWidth
                multiline
                rows={4}
                value={customRejectReason}
                onChange={(e) => setCustomRejectReason(e.target.value)}
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
            <Button onClick={() => setRejectDialog({ open: false, instructor: null })}>
              Cancel
            </Button>
            <Button 
              onClick={handleReject}
              variant="contained" 
              color="error"
              disabled={
                (selectedRejectCategory !== 'custom' && !rejectReason) ||
                (selectedRejectCategory === 'custom' && !customRejectReason.trim()) ||
                !selectedRejectCategory
              }
            >
              Reject Application
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Card>
  );
};

export default PendingInstructors;