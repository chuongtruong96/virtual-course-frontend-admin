import { useQuery } from '@tanstack/react-query';
import AdminService from '../services/adminService';

const useCourseApproval = (courseId) => {
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

  return {
    approvalHistory,
    isLoadingHistory,
    isErrorHistory,
    historyError,
    refetchHistory
  };
};

export default useCourseApproval;