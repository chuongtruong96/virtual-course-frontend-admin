import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CourseService from '../services/courseService';
import AdminService from '../services/adminService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useCourses = (type = 'all') => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch courses based on type
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['courses', type],
    queryFn: async () => {
      console.log(`Fetching courses with type: ${type}`);
      try {
        let result;
        switch (type) {
          case 'pending':
            // Use the admin endpoint specifically for pending courses
            result = await AdminService.getPendingCourses();
            console.log('Pending courses result:', result);
            return result;
          case 'all':
            result = await CourseService.fetchAll();
            return result;
          default:
            result = await CourseService.fetchCoursesByStatus(type);
            return result;
        }
      } catch (err) {
        console.error(`Error fetching ${type} courses:`, err);
        throw err;
      }
    },
    onError: (err) => {
      console.error('Error in useCourses hook:', err);
      addNotification('Failed to fetch courses. Please try again.', 'error');
    },
  });

  // Approve course mutation
  const approveMutation = useMutation({
    mutationFn: ({ courseId, notes }) => {
      console.log('Approving course with ID:', courseId, 'and notes:', notes);
      return AdminService.approveCourse(courseId, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      addNotification('Course approved successfully!', 'success');
    },
    onError: (error) => {
      console.error('Error approving course:', error);
      addNotification('Failed to approve course. Please try again.', 'error');
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
      addNotification('Course rejected successfully.', 'success');
    },
    onError: (error) => {
      console.error('Error rejecting course:', error);
      addNotification('Failed to reject course. Please try again.', 'error');
    }
  });

  return {
    courses: data,
    pendingCourses: type === 'pending' ? data : undefined,
    isLoading,
    isError,
    error,
    refetch,
    approveCourse: approveMutation.mutate,
    rejectCourse: rejectMutation.mutate,
  };
};

export default useCourses;