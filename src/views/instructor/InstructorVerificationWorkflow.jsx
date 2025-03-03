import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  TextField,
  Alert,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Snackbar
} from '@mui/material';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Download,
  Eye,
  X,
  CheckCircle,
  XCircle,
  GraduationCap,
  Briefcase
} from 'lucide-react';

/**
 * Instructor Verification Workflow Component
 * 
 * A step-by-step process for verifying instructor credentials
 * 
 * @param {Object} props
 * @param {Object} props.instructor - The instructor object to verify
 * @param {Function} props.onVerificationComplete - Callback function when verification is complete
 */
const InstructorVerificationWorkflow = ({ instructor, onVerificationComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState({
    identityVerified: false,
    documentsVerified: false,
    qualificationsVerified: false,
    backgroundCheckComplete: false
  });
  
  // Verification code state
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  // Notes state
  const [documentNotes, setDocumentNotes] = useState('');
  const [qualificationNotes, setQualificationNotes] = useState('');
  const [finalNotes, setFinalNotes] = useState('');
  
  // Verification tracking
  const [verifiedEducation, setVerifiedEducation] = useState({});
  const [verifiedExperience, setVerifiedExperience] = useState({});
  const [backgroundChecks, setBackgroundChecks] = useState({
    references: false,
    employment: false,
    education: false,
    conflicts: false
  });
  
  // Final confirmation
  const [finalConfirmation, setFinalConfirmation] = useState(false);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleVerificationUpdate = (field, value) => {
    setVerificationStatus(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const steps = [
    {
      label: 'Identity Verification',
      description: 'Verify the instructor\'s identity information',
      content: (
        <Box>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Personal Information</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <User size={20} />
                  </ListItemIcon>
                  <ListItemText primary="Full Name" secondary={`${instructor?.firstName || ''} ${instructor?.lastName || ''}`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Mail size={20} />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={instructor?.email || instructor?.accountEmail || 'Not provided'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone size={20} />
                  </ListItemIcon>
                  <ListItemText primary="Phone" secondary={instructor?.phone || 'Not provided'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MapPin size={20} />
                  </ListItemIcon>
                  <ListItemText primary="Address" secondary={instructor?.address || 'Not provided'} />
                </ListItem>
              </List>
              <Box mt={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={verificationStatus.identityVerified}
                      onChange={(e) => handleVerificationUpdate('identityVerified', e.target.checked)}
                    />
                  }
                  label="I confirm that the instructor's identity information has been verified"
                />
              </Box>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Email & Phone Verification</Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="body2" sx={{ minWidth: 120 }}>Email Status:</Typography>
                <Chip 
                  label={instructor?.verifiedEmail ? "Verified" : "Not Verified"} 
                  color={instructor?.verifiedEmail ? "success" : "warning"}
                  size="small"
                />
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="body2" sx={{ minWidth: 120 }}>Phone Status:</Typography>
                <Chip 
                  label={instructor?.verifiedPhone ? "Verified" : "Not Verified"} 
                  color={instructor?.verifiedPhone ? "success" : "warning"}
                  size="small"
                />
                {!instructor?.verifiedPhone && (
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ ml: 2 }}
                    onClick={() => handleSendVerificationCode(instructor.id, 'phone')}
                  >
                    Send Verification Code
                  </Button>
                )}
              </Box>
              {!instructor?.verifiedPhone && verificationCodeSent && (
                <Box mt={2}>
                  <TextField
                    label="Verification Code"
                    size="small"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    sx={{ mr: 2 }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={() => handleVerifyPhone(instructor.id, verificationCode)}
                  >
                    Verify
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )
    },
    {
      label: 'Document Verification',
      description: 'Verify the instructor\'s identification documents',
      content: (
        <Box>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Identification Documents</Typography>
              {instructor?.documents?.length > 0 ? (
                <List>
                  {instructor.documents.map((doc, index) => (
                    <ListItem key={index} divider={index < instructor.documents.length - 1}>
                      <ListItemIcon>
                        <FileText size={20} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={doc.title || `Document ${index + 1}`} 
                        secondary={doc.documentType || 'Identification Document'} 
                      />
                      <Box>
                        <Tooltip title="View Document">
                          <IconButton size="small" onClick={() => handleViewDocument(doc)}>
                            <Eye size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Document">
                          <IconButton 
                            size="small" 
                            component="a" 
                            href={doc.fileUrl} 
                            download 
                            target="_blank"
                          >
                            <Download size={18} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="warning">
                  No identification documents have been uploaded by this instructor.
                </Alert>
              )}
              <Box mt={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={verificationStatus.documentsVerified}
                      onChange={(e) => handleVerificationUpdate('documentsVerified', e.target.checked)}
                      disabled={!instructor?.documents?.length}
                    />
                  }
                  label="I confirm that the instructor's identification documents have been verified"
                />
              </Box>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Document Verification Notes</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add notes about document verification (optional)"
                value={documentNotes}
                onChange={(e) => setDocumentNotes(e.target.value)}
              />
            </CardContent>
          </Card>
        </Box>
      )
    },
    {
      label: 'Qualification Check',
      description: 'Verify the instructor\'s educational and professional qualifications',
      content: (
        <Box>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Educational Background</Typography>
              {instructor?.education?.length > 0 ? (
                <List>
                  {instructor.education.map((edu, index) => (
                    <ListItem key={index} divider={index < instructor.education.length - 1}>
                      <ListItemIcon>
                        <GraduationCap size={20} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={edu.degree} 
                        secondary={`${edu.university} (${edu.startYear} - ${edu.endYear || 'Present'})`} 
                      />
                      <Checkbox
                        checked={verifiedEducation[index] || false}
                        onChange={(e) => {
                          setVerifiedEducation({
                            ...verifiedEducation,
                            [index]: e.target.checked
                          });
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="warning">
                  No educational information has been provided by this instructor.
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Professional Experience</Typography>
              {instructor?.experiences?.length > 0 ? (
                <List>
                  {instructor.experiences.map((exp, index) => (
                    <ListItem key={index} divider={index < instructor.experiences.length - 1}>
                      <ListItemIcon>
                        <Briefcase size={20} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${exp.position} at ${exp.company}`} 
                        secondary={`${exp.startYear} - ${exp.endYear || 'Present'}`} 
                      />
                      <Checkbox
                        checked={verifiedExperience[index] || false}
                        onChange={(e) => {
                          setVerifiedExperience({
                            ...verifiedExperience,
                            [index]: e.target.checked
                          });
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="warning">
                  No professional experience has been provided by this instructor.
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Qualification Verification</Typography>
              <Box mt={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={verificationStatus.qualificationsVerified}
                      onChange={(e) => handleVerificationUpdate('qualificationsVerified', e.target.checked)}
                      disabled={
                        (instructor?.education?.length > 0 && Object.keys(verifiedEducation).length === 0) ||
                        (instructor?.experiences?.length > 0 && Object.keys(verifiedExperience).length === 0)
                      }
                    />
                  }
                  label="I confirm that the instructor's qualifications have been verified"
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add notes about qualification verification (optional)"
                value={qualificationNotes}
                onChange={(e) => setQualificationNotes(e.target.value)}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Box>
      )
    },
    {
      label: 'Background Check',
      description: 'Complete background verification process',
      content: (
        <Box>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Background Check</Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                Please complete the background verification process for this instructor. This may include checking references, verifying previous employment, and ensuring there are no conflicts of interest.
              </Alert>
              
              <Typography variant="subtitle2" gutterBottom>Background Check Items</Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Checkbox
                      checked={backgroundChecks.references}
                      onChange={(e) => setBackgroundChecks({...backgroundChecks, references: e.target.checked})}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Reference Check" secondary="Verify professional references" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Checkbox
                      checked={backgroundChecks.employment}
                      onChange={(e) => setBackgroundChecks({...backgroundChecks, employment: e.target.checked})}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Employment Verification" secondary="Confirm previous employment history" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Checkbox
                      checked={backgroundChecks.education}
                      onChange={(e) => setBackgroundChecks({...backgroundChecks, education: e.target.checked})}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Education Verification" secondary="Confirm educational credentials" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Checkbox
                      checked={backgroundChecks.conflicts}
                      onChange={(e) => setBackgroundChecks({...backgroundChecks, conflicts: e.target.checked})}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Conflict of Interest" secondary="Check for potential conflicts" />
                </ListItem>
              </List>
              
              <Box mt={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={verificationStatus.backgroundCheckComplete}
                      onChange={(e) => handleVerificationUpdate('backgroundCheckComplete', e.target.checked)}
                      disabled={!Object.values(backgroundChecks).every(Boolean)}
                    />
                  }
                  label="I confirm that the background check has been completed"
                />
              </Box>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Final Verification Notes</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Add any final notes about the verification process"
                value={finalNotes}
                onChange={(e) => setFinalNotes(e.target.value)}
              />
            </CardContent>
          </Card>
        </Box>
      )
    },
    {
      label: 'Verification Summary',
      description: 'Review and complete the verification process',
      content: (
        <Box>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Verification Summary</Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    {verificationStatus.identityVerified ? (
                      <CheckCircle size={20} color="green" />
                    ) : (
                      <XCircle size={20} color="red" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Identity Verification" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {verificationStatus.documentsVerified ? (
                      <CheckCircle size={20} color="green" />
                    ) : (
                      <XCircle size={20} color="red" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Document Verification" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {verificationStatus.qualificationsVerified ? (
                      <CheckCircle size={20} color="green" />
                    ) : (
                      <XCircle size={20} color="red" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Qualification Check" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {verificationStatus.backgroundCheckComplete ? (
                      <CheckCircle size={20} color="green" />
                    ) : (
                      <XCircle size={20} color="red" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Background Check" />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>Verification Notes</Typography>
              <Typography variant="body2" paragraph>
                {documentNotes && (
                  <>
                    <strong>Document Verification:</strong> {documentNotes}<br />
                  </>
                )}
                {qualificationNotes && (
                  <>
                    <strong>Qualification Check:</strong> {qualificationNotes}<br />
                  </>
                )}
                {finalNotes && (
                  <>
                    <strong>Final Notes:</strong> {finalNotes}
                  </>
                )}
                {!documentNotes && !qualificationNotes && !finalNotes && (
                  "No additional notes provided."
                )}
              </Typography>
              
              <Alert 
                severity={Object.values(verificationStatus).every(Boolean) ? "success" : "warning"}
                sx={{ mt: 2 }}
              >
                {Object.values(verificationStatus).every(Boolean) 
                  ? "All verification steps have been completed. You can now approve this instructor."
                  : "Some verification steps are still incomplete. Please complete all steps before approving this instructor."}
              </Alert>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Complete Verification</Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={finalConfirmation}
                      onChange={(e) => setFinalConfirmation(e.target.checked)}
                      disabled={!Object.values(verificationStatus).every(Boolean)}
                    />
                  }
                  label="I confirm that all verification steps have been completed and the instructor's information is accurate"
                />
              </Box>
              
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!finalConfirmation || !Object.values(verificationStatus).every(Boolean)}
                  onClick={handleCompleteVerification}
                >
                  Complete Verification
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )
    }
  ];

  // Document preview dialog
  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    document: null
  });

  const handleViewDocument = (document) => {
    setPreviewDialog({
      open: true,
      document
    });
  };

  const handleClosePreview = () => {
    setPreviewDialog({
      open: false,
      document: null
    });
  };

  const handleSendVerificationCode = async (instructorId, type) => {
    try {
      await fetch(`/api/admin/instructors/${instructorId}/send-verification-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });
      setVerificationCodeSent(true);
    } catch (error) {
      console.error("Failed to send verification code:", error);
    }
  };

  const handleVerifyPhone = async (instructorId, code) => {
    try {
      const response = await fetch(`/api/admin/instructors/${instructorId}/verify-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      const result = await response.json();
      if (result.success) {
        // Update local state
        setVerificationStatus(prev => ({
          ...prev,
          phoneVerified: true
        }));
        
        // Update instructor object
        if (instructor) {
          setInstructor({
            ...instructor,
            verifiedPhone: true
          });
        }
      }
    } catch (error) {
      console.error("Failed to verify phone:", error);
    }
  };

  const handleCompleteVerification = async () => {
    try {
      await fetch(`/api/admin/instructors/${instructor.id}/complete-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationStatus,
          notes: {
            documentNotes,
            qualificationNotes,
            finalNotes
          }
        }),
      });
      
      // Call the callback function to update parent component
      if (onVerificationComplete) {
        onVerificationComplete(verificationStatus);
      }
      
      // Show success message
      setSnackbar({
        open: true,
        message: "Verification completed successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Failed to complete verification:", error);
      setSnackbar({
        open: true,
        message: "Failed to complete verification",
        severity: "error"
      });
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                <Typography variant="caption">{step.description}</Typography>
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              {step.content}
              <Box sx={{ mb: 2, mt: 3 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={
                      (index === 0 && !verificationStatus.identityVerified) ||
                      (index === 1 && !verificationStatus.documentsVerified) ||
                      (index === 2 && !verificationStatus.qualificationsVerified) ||
                      (index === 3 && !verificationStatus.backgroundCheckComplete)
                    }
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      
      {/* Document Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {previewDialog.document?.title || 'Document Preview'}
          <IconButton
            aria-label="close"
            onClick={handleClosePreview}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewDialog.document && (
            <Box sx={{ height: '70vh', width: '100%', overflow: 'auto' }}>
              {previewDialog.document.fileUrl.endsWith('.pdf') ? (
                <iframe
                  src={previewDialog.document.fileUrl}
                  width="100%"
                  height="100%"
                  title={previewDialog.document.title}
                  style={{ border: 'none' }}
                />
              ) : previewDialog.document.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                <Box
                  component="img"
                  src={previewDialog.document.fileUrl}
                  alt={previewDialog.document.title}
                  sx={{ maxWidth: '100%', maxHeight: '100%', display: 'block', margin: '0 auto' }}
                />
              ) : (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                  <FileText size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                  <Typography variant="body1" gutterBottom>
                    Preview not available for this file type
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Download size={16} />}
                    component="a"
                    href={previewDialog.document.fileUrl}
                    download
                    target="_blank"
                  >
                    Download File
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InstructorVerificationWorkflow;