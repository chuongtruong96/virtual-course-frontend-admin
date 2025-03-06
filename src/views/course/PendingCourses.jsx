import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Rating,
  IconButton,
  Tooltip,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ChevronDown,
  Info,
  Search,
  BookOpen,
  DollarSign,
  User,
  Calendar,
  FileText,
  Award
} from 'lucide-react';
import useCourseApproval from '../../hooks/useCourseApproval';
import useCourses from '../../hooks/useCourses';

// Approval criteria for courses
const APPROVAL_CRITERIA = [
  {
    id: 'contentQuality',
    label: 'Content Quality',
    description: 'Evaluate the quality, accuracy, and relevance of the course content',
    required: true,
    options: [
      { value: 'exceeds', label: 'Exceeds Requirements', description: 'Content is comprehensive, up-to-date, and highly relevant' },
      { value: 'meets', label: 'Meets Requirements', description: 'Content is accurate and covers all necessary topics' },
      { value: 'below', label: 'Below Requirements', description: 'Content has significant gaps or inaccuracies' }
    ]
  },
  {
    id: 'structureOrganization',
    label: 'Structure and Organization',
    description: 'Evaluate how well the course is structured and organized',
    required: true,
    options: [
      { value: 'exceeds', label: 'Exceeds Requirements', description: 'Exceptionally well-structured with clear progression' },
      { value: 'meets', label: 'Meets Requirements', description: 'Logically organized with reasonable flow' },
      { value: 'below', label: 'Below Requirements', description: 'Poorly organized or difficult to follow' }
    ]
  },
  {
    id: 'presentationQuality',
    label: 'Presentation Quality',
    description: 'Evaluate the quality of videos, audio, and visual materials',
    required: true,
    options: [
      { value: 'exceeds', label: 'Exceeds Requirements', description: 'High-quality production with excellent visuals and audio' },
      { value: 'meets', label: 'Meets Requirements', description: 'Clear presentation with acceptable quality' },
      { value: 'below', label: 'Below Requirements', description: 'Poor quality that hinders learning' }
    ]
  },
  {
    id: 'pricingValue',
    label: 'Pricing and Value',
    description: 'Evaluate if the course pricing is appropriate for the content provided',
    required: true,
    options: [
      { value: 'exceeds', label: 'Exceeds Requirements', description: 'Excellent value for the price' },
      { value: 'meets', label: 'Meets Requirements', description: 'Fair pricing for the content offered' },
      { value: 'below', label: 'Below Requirements', description: 'Overpriced for the quality and quantity of content' }
    ]
  },
  {
    id: 'technicalRequirements',
    label: 'Technical Requirements',
    description: 'Evaluate if the course meets platform technical standards',
    required: false,
    options: [
      { value: 'exceeds', label: 'Exceeds Requirements', description: 'Exceeds all technical requirements with additional features' },
      { value: 'meets', label: 'Meets Requirements', description: 'Meets all required technical specifications' },
      { value: 'below', label: 'Below Requirements', description: 'Fails to meet one or more technical requirements' }
    ]
  }
];

// Common rejection reasons
const COMMON_REJECTION_REASONS = [
  {
    category: 'Content Issues',
    reasons: [
      'Content contains factual errors or outdated information',
      'Content lacks depth or is too superficial for the topic',
      'Content does not match the course description or objectives'
    ]
  },
  {
    category: 'Quality Issues',
    reasons: [
      'Poor video/audio quality that impacts learning experience',
      'Presentation is unclear or difficult to follow',
      'Materials contain spelling, grammar, or formatting errors'
    ]
  },
  {
    category: 'Structure Issues',
    reasons: [
      'Course structure is illogical or poorly organized',
      'Missing important sections or modules',
      'Inadequate assessments or practice opportunities'
    ]
  },
  {
    category: 'Pricing Issues',
    reasons: [
      'Course is significantly overpriced for the content provided',
      'Length of course does not justify the price point',
      'Similar content is available at a much lower price point'
    ]
  }
];

const PendingCourses = () => {
  const navigate = useNavigate();
  const { pendingCourses, isLoading, isError, error, refetch } = useCourses('pending');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { approvalHistory, approveCourse, rejectCourse, isApproving, isRejecting } = useCourseApproval(selectedCourse?.id);

  // Dialog states
  const [approveDialog, setApproveDialog] = useState({ open: false, course: null });
  const [rejectDialog, setRejectDialog] = useState({ open: false, course: null });
  const [historyDialog, setHistoryDialog] = useState({ open: false, course: null });

  // Form states
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [customRejectionReason, setCustomRejectionReason] = useState('');
  const [selectedRejectCategory, setSelectedRejectCategory] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [evaluations, setEvaluations] = useState({});
  const [overallRating, setOverallRating] = useState(0);

  // Debug the pendingCourses data when it changes
  useEffect(() => {
    if (pendingCourses) {
      console.log('Pending courses data:', pendingCourses);
    }
  }, [pendingCourses]);

  const renderInstructorName = (instructor) => {
    if (!instructor) return 'N/A';
    // Check for different property structures that might exist
    if (instructor.firstName || instructor.lastName) {
      return `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || 'N/A';
    } else if (instructor.account && (instructor.account.firstName || instructor.account.lastName)) {
      return `${instructor.account.firstName || ''} ${instructor.account.lastName || ''}`.trim() || 'N/A';
    } else if (instructor.username) {
      return instructor.username;
    } else if (instructor.name) {
      return instructor.name;
    }
    return 'N/A';
  };

  const renderCategory = (category) => {
    if (!category) return 'N/A';
    // Check for different property structures
    if (typeof category === 'string') return category;
    return category.name || category.categoryName || 'N/A';
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatSubmissionDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLevelColor = (level) => {
    if (!level) return 'default';

    switch (level.toLowerCase()) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'primary';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleApproveClick = (course) => {
    setSelectedCourse(course);
    setApproveDialog({ open: true, course });
    setActiveStep(0);
    setEvaluations({});
    setOverallRating(0);
    setApprovalNotes('');
  };

  const handleRejectClick = (course) => {
    setSelectedCourse(course);
    setRejectDialog({ open: true, course });
    setRejectionReason('');
    setCustomRejectionReason('');
    setSelectedRejectCategory('');
  };

  const handleHistoryClick = (course) => {
    setSelectedCourse(course);
    setHistoryDialog({ open: true, course });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleEvaluationChange = (criteriaId, value) => {
    setEvaluations((prev) => ({
      ...prev,
      [criteriaId]: value
    }));
  };

  const handleApprove = () => {
    // Check if all required criteria have been evaluated
    const requiredCriteria = APPROVAL_CRITERIA.filter((criteria) => criteria.required);
    const allRequiredEvaluated = requiredCriteria.every((criteria) => evaluations[criteria.id] && evaluations[criteria.id] !== 'below');

    if (!allRequiredEvaluated) {
      alert('Please evaluate all required criteria and ensure the course meets minimum requirements');
      return;
    }

    if (overallRating < 3) {
      alert('Overall rating must be at least 3 stars for approval');
      return;
    }

    if (approveDialog.course) {
      // Create detailed approval notes
      const detailedNotes = `
Overall Rating: ${overallRating}/5 stars
${Object.entries(evaluations)
  .map(([key, value]) => {
    const criteria = APPROVAL_CRITERIA.find((c) => c.id === key);
    const option = criteria?.options.find((o) => o.value === value);
    return `${criteria?.label}: ${option?.label}`;
  })
  .join('\n')}

Additional Notes: ${approvalNotes}
      `.trim();

      approveCourse({
        courseId: approveDialog.course.id,
        notes: detailedNotes
      });

      setApproveDialog({ open: false, course: null });

      // Reset form state after successful submission
      setTimeout(() => {
        setSelectedCourse(null);
        setEvaluations({});
        setOverallRating(0);
        setApprovalNotes('');
        refetch(); // Refresh the course list
      }, 500);
    }
  };

  const handleReject = () => {
    let finalReason = '';

    if (selectedRejectCategory && rejectionReason) {
      finalReason = `${selectedRejectCategory}: ${rejectionReason}`;
    } else if (customRejectionReason) {
      finalReason = customRejectionReason;
    } else {
      alert('Please provide a reason for rejection');
      return;
    }

    if (!finalReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    if (rejectDialog.course) {
      rejectCourse({
        courseId: rejectDialog.course.id,
        reason: finalReason
      });

      setRejectDialog({ open: false, course: null });

      // Reset form state after successful submission
      setTimeout(() => {
        setSelectedCourse(null);
        setRejectionReason('');
        setCustomRejectionReason('');
        setSelectedRejectCategory('');
        refetch(); // Refresh the course list
      }, 500);
    }
  };

  const isStepComplete = (step) => {
    if (step === 0) {
      // Check if all required criteria have been evaluated
      const requiredCriteria = APPROVAL_CRITERIA.filter((criteria) => criteria.required);
      return requiredCriteria.every((criteria) => evaluations[criteria.id]);
    }
    if (step === 1) {
      return overallRating > 0;
    }
    return true;
  };

  const canApprove = () => {
    // Check if all required criteria have been evaluated and meet requirements
    const requiredCriteria = APPROVAL_CRITERIA.filter((criteria) => criteria.required);
    const allRequiredMet = requiredCriteria.every((criteria) => evaluations[criteria.id] && evaluations[criteria.id] !== 'below');

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
      <Alert severity="error" sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <AlertTriangle size={20} style={{ marginRight: 8 }} />
          <Typography variant="h6">Error Loading Courses</Typography>
        </Box>
        <Typography>{error?.message || 'An unknown error occurred'}</Typography>
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardHeader title="Pending Courses" subheader={`${pendingCourses?.length || 0} courses awaiting review`} />
        <CardContent>
          {!pendingCourses || !Array.isArray(pendingCourses) || pendingCourses.length === 0 ? (
            <Alert severity="info">
              <Typography>No pending courses found</Typography>
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Instructor</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Submitted Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(pendingCourses) &&
                    pendingCourses.map((course) => (
                      <TableRow key={course.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {course.titleCourse || course.title || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>{renderInstructorName(course.instructor)}</TableCell>
                        <TableCell>{renderCategory(course.category || course.categoryName)}</TableCell>
                        <TableCell>
                          <Chip label={course.level || 'N/A'} size="small" color={getLevelColor(course.level)} />
                        </TableCell>
                        <TableCell>{course.duration ? `${course.duration} hrs` : 'N/A'}</TableCell>
                        <TableCell>{formatPrice(course.basePrice || course.price)}</TableCell>
                        <TableCell>{formatSubmissionDate(course.createdAt || course.submittedAt)}</TableCell>
                        <TableCell>
                          <Box display="flex" justifyContent="center" gap={1}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle size={16} />}
                              onClick={() => handleApproveClick(course)}
                              disabled={isApproving}
                            >
                              {isApproving ? 'Approving...' : 'Approve'}
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<XCircle size={16} />}
                              onClick={() => handleRejectClick(course)}
                              disabled={isRejecting}
                            >
                              {isRejecting ? 'Rejecting...' : 'Reject'}
                            </Button>
                            <Button
                              variant="outlined"
                              color="info"
                              size="small"
                              startIcon={<Clock size={16} />}
                              onClick={() => handleHistoryClick(course)}
                            >
                              History
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={approveDialog.open} onClose={() => setApproveDialog({ open: false, course: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <CheckCircle color="success" size={24} style={{ marginRight: 8 }} />
            Approve Course
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              {approveDialog.course?.titleCourse || approveDialog.course?.title}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <User size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    Instructor: {approveDialog.course && renderInstructorName(approveDialog.course.instructor)}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <BookOpen size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    Category: {approveDialog.course && renderCategory(approveDialog.course.category || approveDialog.course.categoryName)}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Award size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    Level: {approveDialog.course?.level || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Clock size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    Duration: {approveDialog.course?.duration ? `${approveDialog.course.duration} hours` : 'N/A'}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <DollarSign size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    Price: {formatPrice(approveDialog.course?.basePrice || approveDialog.course?.price)}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Calendar size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    Submitted: {formatSubmissionDate(approveDialog.course?.createdAt || approveDialog.course?.submittedAt)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

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
                Please evaluate the course according to each criterion below. Criteria marked with (*) are required.
              </Typography>

              {APPROVAL_CRITERIA.map((criteria) => (
                <Paper key={criteria.id} sx={{ p: 2, mb: 2 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {criteria.label} {criteria.required && <span style={{ color: 'red' }}>*</span>}
                    </Typography>
                    <Tooltip title={criteria.description}>
                      <IconButton size="small">
                        <Info size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <RadioGroup value={evaluations[criteria.id] || ''} onChange={(e) => handleEvaluationChange(criteria.id, e.target.value)}>
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
                Based on the criteria evaluation, please provide an overall assessment of the course. A minimum of 3 stars is required for
                approval.
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
                  const criteria = APPROVAL_CRITERIA.find((c) => c.id === key);
                  const option = criteria?.options.find((o) => o.value === value);
                  return (
                    <Box key={key} display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{criteria?.label}:</Typography>
                      <Chip
                        label={option?.label}
                        size="small"
                        color={value === 'exceeds' ? 'success' : value === 'meets' ? 'primary' : 'error'}
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
                Please provide additional notes about your approval decision. This information will be saved in the record and may be shared
                with the instructor.
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
                  When approved, the course will be published and available to students. Ensure that you have thoroughly evaluated all
                  criteria.
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
          <Button onClick={() => setApproveDialog({ open: false, course: null })}>Cancel</Button>
          {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
          {activeStep < 2 ? (
            <Button onClick={handleNext} variant="contained" color="primary" disabled={!isStepComplete(activeStep)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleApprove} variant="contained" color="success" disabled={!canApprove() || isApproving}>
              {isApproving ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Approving...
                </Box>
              ) : (
                'Approve Course'
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, course: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <XCircle color="error" size={24} style={{ marginRight: 8 }} />
            Reject Course
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              {rejectDialog.course?.titleCourse || rejectDialog.course?.title}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <User size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    Instructor: {rejectDialog.course && renderInstructorName(rejectDialog.course.instructor)}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <BookOpen size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    Category: {rejectDialog.course && renderCategory(rejectDialog.course.category || rejectDialog.course.categoryName)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Clock size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    Duration: {rejectDialog.course?.duration ? `${rejectDialog.course.duration} hours` : 'N/A'}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <DollarSign size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" color="text.secondary">
                    Price: {formatPrice(rejectDialog.course?.basePrice || rejectDialog.course?.price)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Rejection Reason
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Please select a category and reason for rejection or provide a custom reason. This information will be sent to the instructor.
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel>Select Category</FormLabel>
            <RadioGroup value={selectedRejectCategory} onChange={(e) => setSelectedRejectCategory(e.target.value)}>
              {COMMON_REJECTION_REASONS.map((category) => (
                <FormControlLabel key={category.category} value={category.category} control={<Radio />} label={category.category} />
              ))}
              <FormControlLabel value="custom" control={<Radio />} label="Other Reason" />
            </RadioGroup>
          </FormControl>

          {selectedRejectCategory && selectedRejectCategory !== 'custom' && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel>Select Specific Reason</FormLabel>
              <RadioGroup value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}>
                {COMMON_REJECTION_REASONS.find((cat) => cat.category === selectedRejectCategory)?.reasons.map((reason, index) => (
                  <FormControlLabel key={index} value={reason} control={<Radio />} label={reason} />
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
              value={customRejectionReason}
              onChange={(e) => setCustomRejectionReason(e.target.value)}
              placeholder="Enter detailed rejection reason..."
              required
              variant="outlined"
              sx={{ mb: 3 }}
            />
          )}

          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Rejecting the course will change its status to "REJECTED". The instructor will receive a notification with the rejection
              reason. They will be able to make changes and resubmit the course.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, course: null })}>Cancel</Button>
          <Button 
  onClick={handleReject}
  variant="contained" 
  color="error"
  disabled={
    (selectedRejectCategory !== 'custom' && !rejectionReason) ||
    (selectedRejectCategory === 'custom' && !customRejectionReason.trim()) ||
    !selectedRejectCategory ||
    isRejecting
  }
>
  {isRejecting ? (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
      Rejecting...
    </Box>
  ) : (
    'Reject Course'
  )}
</Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialog.open} onClose={() => setHistoryDialog({ open: false, course: null })} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Clock size={24} style={{ marginRight: 8 }} />
            Course Approval History
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {historyDialog.course?.titleCourse || historyDialog.course?.title}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {approvalHistory?.length > 0 ? (
            <Box>
              {approvalHistory.map((history, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: history.status === 'APPROVED' ? 'success.light' : history.status === 'REJECTED' ? 'error.light' : 'info.light'
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center">
                      {history.status === 'APPROVED' && <CheckCircle color="success" size={20} style={{ marginRight: 8 }} />}
                      {history.status === 'REJECTED' && <XCircle color="error" size={20} style={{ marginRight: 8 }} />}
                      {history.status !== 'APPROVED' && history.status !== 'REJECTED' && <Info size={20} style={{ marginRight: 8 }} />}
                      <Typography variant="subtitle1" fontWeight="bold">
                        {history.status}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatSubmissionDate(history.createdAt)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" mb={1}>
                    <strong>Reviewer:</strong> {history.reviewer?.username || 'N/A'}
                  </Typography>

                  {history.notes && (
                    <Box mt={1}>
                      <Typography variant="body2" fontWeight="medium">
                        Notes:
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {history.notes}
                      </Typography>
                    </Box>
                  )}

                  {history.rejectionReason && (
                    <Box mt={1}>
                      <Typography variant="body2" fontWeight="medium" color="error.main">
                        Rejection Reason:
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {history.rejectionReason}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          ) : (
            <Alert severity="info">
              <Typography>No approval history available for this course</Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialog({ open: false, course: null })}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PendingCourses;
