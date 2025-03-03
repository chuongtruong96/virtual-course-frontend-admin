// src/components/instructor/InstructorDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { ArrowLeft, AlertTriangle, BarChart2 } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

import { useInstructorDetail } from '../../hooks/useInstructorDetail';
import TabPanel from './TabPanel';
import ProfileHeader from './sections/ProfileHeader';
import StatisticsSection from './sections/StatisticsSection';
import ProfileTab from './tabs/ProfileTab';
import CoursesTab from './tabs/CoursesTab';
import PerformanceTab from './tabs/PerformanceTab';
import DocumentsTab from './tabs/DocumentsTab';
import ActivityTab from './tabs/ActivityTab';
import StatusActions from './StatusActions';
import StatusDialog from './dialogs/StatusDialog';
import DocumentPreviewDialog from './dialogs/DocumentPreviewDialog';

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

const InstructorDetail = () => {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const {
    instructor,
    statistics,
    courses,
    documents,
    isLoading,
    isError,
    error,
    tabValue,
    statusDialog,
    statusNote,
    documentPreview,
    handleTabChange,
    handleStatusAction,
    handleStatusConfirm,
    handleDocumentPreview,
    setStatusNote,
    setDocumentPreview
  } = useInstructorDetail(instructorId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <ErrorFallback error={error} />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div>
        {/* Header Actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/dashboard/instructor/list')}
          >
            Back to Instructors
          </Button>
          <StatusActions 
            status={instructor.status}
            onAction={handleStatusAction}
          />
        </Box>

        {/* Profile Overview */}
        <ProfileHeader 
          instructor={instructor}
          statistics={statistics}
        />

        {/* Statistics Section */}
        <StatisticsSection statistics={statistics} />

        {/* Tabs Section */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="instructor detail tabs"
            >
              <Tab label="Profile" />
              <Tab label="Courses" />
              <Tab label="Performance" icon={<BarChart2 size={16} />} iconPosition="start" />
              <Tab label="Documents" />
              <Tab label="Activity Log" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <ProfileTab instructor={instructor} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <CoursesTab 
              courses={courses}
              isLoading={isLoading}
              onViewCourse={(courseId) => navigate(`/dashboard/course/detail/${courseId}`)}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <PerformanceTab 
              instructor={instructor}
              instructorId={instructorId}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <DocumentsTab
              documents={documents}
              isLoading={isLoading}
              onPreview={handleDocumentPreview}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <ActivityTab activityLog={instructor.activityLog} />
          </TabPanel>
        </Card>

        {/* Dialogs */}
        <StatusDialog
          open={statusDialog.open}
          action={statusDialog.action}
          note={statusNote}
          onNoteChange={setStatusNote}
          onClose={() => handleStatusAction(null)}
          onConfirm={handleStatusConfirm}
        />

        <DocumentPreviewDialog
          {...documentPreview}
          onClose={() => setDocumentPreview({ open: false, url: '', title: '' })}
        />
      </div>
    </ErrorBoundary>
  );
};

export default InstructorDetail;