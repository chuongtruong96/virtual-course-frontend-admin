import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import CourseService from '../services/courseService';

const useCourseApproval = (courseId) => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch approval history
  const {
    data: approvalHistory,
    isLoading: isLoadingHistory,
    error: historyError
  } = useQuery({
    queryKey: ['courseApprovalHistory', courseId],
    queryFn: () => CourseService.getApprovalHistory(courseId),
    enabled: !!courseId, // Only run query if courseId exists
    onError: (error) => {
      console.error('Error fetching approval history:', error);
      addNotification('Failed to load approval history', 'error');
    }
  });

  // Approve course mutation
  const approveMutation = useMutation({
    mutationFn: ({ courseId, notes }) => {
      if (!courseId) {
        throw new Error('Course ID is required');
      }
      return CourseService.approveCourse({ courseId, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      queryClient.invalidateQueries(['courseApprovalHistory']);
      addNotification('Course approved successfully', 'success');
    },
    onError: (error) => {
      console.error('Error approving course:', error);
      addNotification(error.message || 'Failed to approve course', 'error');
    }
  });

  // Reject course mutation
  const rejectMutation = useMutation({
    mutationFn: ({ courseId, reason }) => {
      if (!courseId) {
        throw new Error('Course ID is required');
      }
      return CourseService.rejectCourse({ courseId, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      queryClient.invalidateQueries(['courseApprovalHistory']);
      addNotification('Course rejected successfully', 'success');
    },
    onError: (error) => {
      console.error('Error rejecting course:', error);
      addNotification(error.message || 'Failed to reject course', 'error');
    }
  });

  return {
    approvalHistory,
    isLoadingHistory,
    historyError,
    approveCourse: approveMutation.mutate,
    rejectCourse: rejectMutation.mutate,
    isApproving: approveMutation.isLoading,
    isRejecting: rejectMutation.isLoading,
    approveError: approveMutation.error,
    rejectError: rejectMutation.error
  };
};

export default useCourseApproval;