import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import AdminService from '../services/adminService';

const useCourseApproval = (courseId) => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch approval history for a course
  const {
    data: approvalHistory,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    error: historyError,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ['course-approval-history', courseId],
    queryFn: () => AdminService.getCourseApprovalHistory(courseId),
    enabled: !!courseId, // Only run if courseId is provided
    onError: (err) => {
      console.error('Error fetching course approval history:', err);
    }
  });

  // Approve course mutation
  // Approve course mutation
const approveMutation = useMutation({
  mutationFn: ({ courseId, notes }) => {
    console.log('In useCourseApproval - Approving course with ID:', courseId, 'and notes:', notes);
    return AdminService.approveCourse(courseId, notes);
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['courses']);
    queryClient.invalidateQueries(['course-approval-history', courseId]);
    addNotification('Course approved successfully! An email notification has been sent to the instructor.', 'success');
  },
  onError: (error) => {
    console.error('Error approving course:', error);
    addNotification(`Failed to approve course: ${error.message}`, 'danger');
  }
});

  // Reject course mutation
  const rejectMutation = useMutation({
    mutationFn: ({ courseId, reason }) => {
      console.log('Rejecting course with ID:', courseId, 'and reason:', reason);
      return AdminService.rejectCourse(courseId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      queryClient.invalidateQueries(['course-approval-history', courseId]);
      addNotification('Course rejected successfully. An email notification has been sent to the instructor.', 'success');
    },
    onError: (error) => {
      console.error('Error rejecting course:', error);
      addNotification(`Failed to reject course: ${error.message}`, 'danger');
    }
  });

  return {
    approvalHistory,
    isLoadingHistory,
    isErrorHistory,
    historyError,
    refetchHistory,
    approveCourse: approveMutation.mutate,
    isApproving: approveMutation.isLoading,
    rejectCourse: rejectMutation.mutate,
    isRejecting: rejectMutation.isLoading
  };
};

export default useCourseApproval;