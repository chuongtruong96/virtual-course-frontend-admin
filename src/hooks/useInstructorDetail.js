import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import InstructorService from '../services/instructorService';

export const useInstructorDetail = (instructorId) => {
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [statusDialog, setStatusDialog] = useState({ open: false, action: null });
  const [statusNote, setStatusNote] = useState('');
  const [documentPreview, setDocumentPreview] = useState({ open: false, url: '', title: '' });

  // Queries - Cập nhật theo cú pháp React Query v5
  const {
    data: instructor,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['instructor', instructorId],
    queryFn: () => InstructorService.fetchById(instructorId)
  });

  const { data: statistics } = useQuery({
    queryKey: ['instructor-statistics', instructorId],
    queryFn: () => InstructorService.getInstructorStatistics(instructorId),
    enabled: !!instructorId
  });

  const { data: courses } = useQuery({
    queryKey: ['instructor-courses', instructorId],
    queryFn: () => InstructorService.getInstructorCourses(instructorId),
    enabled: !!instructorId
  });

  const { data: documents } = useQuery({
    queryKey: ['instructor-documents', instructorId],
    queryFn: () => InstructorService.getInstructorDocuments(instructorId),
    enabled: !!instructorId
  });

  // Thêm query để lấy tests của instructor
  const { data: tests } = useQuery({
    queryKey: ['instructor-tests', instructorId],
    queryFn: () => InstructorService.getTests(instructorId),
    enabled: !!instructorId
  });

  // Mutations - Cập nhật theo cú pháp React Query v5
  const updateStatusMutation = useMutation({
    mutationFn: (data) => {
      switch (data.action) {
        case 'approve':
          return InstructorService.approveInstructor(instructorId, data.notes);
        case 'reject':
          return InstructorService.rejectInstructor(instructorId, data.notes);
        case 'deactivate':
          return InstructorService.updateInstructorStatus(instructorId, 'INACTIVE', data.notes);
        case 'activate':
          return InstructorService.updateInstructorStatus(instructorId, 'ACTIVE', data.notes);
        default:
          throw new Error('Invalid action');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', instructorId] });
      setStatusDialog({ open: false, action: null });
      setStatusNote('');
    }
  });

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusAction = (action) => {
    setStatusDialog({ open: !!action, action });
  };

  const handleStatusConfirm = () => {
    updateStatusMutation.mutate({
      action: statusDialog.action,
      notes: statusNote
    });
  };

  const handleDocumentPreview = (url, title) => {
    setDocumentPreview({ open: true, url, title });
  };

  return {
    instructor,
    statistics,
    courses,
    documents,
    tests, // Thêm tests vào return object
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
  };
};