// src/hooks/useInstructors.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import InstructorService from '../services/instructorService';

const useInstructors = (type = 'all') => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['instructors', type],
    queryFn: () => {
      switch (type) {
        case 'pending':
          return InstructorService.getPendingInstructors();
        case 'all':
          return InstructorService.fetchAll();
        default:
          return InstructorService.fetchAll();
      }
    },
    onError: (err) => {
      console.error('Error fetching instructors:', err);
      addNotification('Failed to load instructors', 'error');
    }
  });

  // Mutations for instructor approval/rejection
  const approveMutation = useMutation({
    mutationFn: (instructorId) => InstructorService.approveInstructor(instructorId),
    onSuccess: () => {
      queryClient.invalidateQueries(['instructors']);
      addNotification('Instructor approved successfully', 'success');
    },
    onError: (err) => {
      console.error('Error approving instructor:', err);
      addNotification('Failed to approve instructor', 'error');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ instructorId, reason }) => 
      InstructorService.rejectInstructor(instructorId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['instructors']);
      addNotification('Instructor rejected successfully', 'success');
    },
    onError: (err) => {
      console.error('Error rejecting instructor:', err);
      addNotification('Failed to reject instructor', 'error');
    }
  });

  return {
    instructors: type === 'all' ? data : undefined,
    pendingInstructors: type === 'pending' ? data : undefined,
    isLoading,
    isError,
    error,
    refetch,
    approveInstructor: approveMutation.mutate,
    rejectInstructor: rejectMutation.mutate
  };
};

export default useInstructors;
