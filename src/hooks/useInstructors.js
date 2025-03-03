import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import InstructorService from '../services/instructorService';

export const useInstructors = (type = 'all') => {
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

  const approveMutation = useMutation({
    mutationFn: ({ instructorId, notes, onSuccess }) =>
        InstructorService.approveInstructor(instructorId, notes),
    onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['instructors']);
        
        // Refresh danh sách thông báo
        queryClient.invalidateQueries(['notifications']);
        
        addNotification('Instructor approved successfully', 'success');
        
        // Gọi callback onSuccess nếu có
        if (variables.onSuccess) {
            variables.onSuccess(data);
        }
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
    instructors: data,
    isLoading,
    isError,
    error,
    refetch,
    approveInstructor: approveMutation.mutate,
    rejectInstructor: rejectMutation.mutate
  };
};