// src/components/course/CourseApprovalHistory.jsx
import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { Typography, Box, Chip } from '@mui/material';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const CourseApprovalHistory = ({ history }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle size={16} />;
      case 'REJECTED':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Timeline>
      {history.map((item, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot color={getStatusColor(item.status)}>
              {getStatusIcon(item.status)}
            </TimelineDot>
            {index < history.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Box sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Chip
                  label={item.status}
                  color={getStatusColor(item.status)}
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(item.createdAt)}
                </Typography>
              </Box>
              <Typography variant="subtitle2">
                Reviewer: {item.reviewer?.username || 'System'}
              </Typography>
              {item.notes && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Notes: {item.notes}
                </Typography>
              )}
              {item.rejectionReason && (
                <Typography variant="body2" color="error" mt={1}>
                  Reason for rejection: {item.rejectionReason}
                </Typography>
              )}
            </Box>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default CourseApprovalHistory;
