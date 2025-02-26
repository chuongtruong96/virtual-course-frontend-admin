// src/hooks/useCourses.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CourseService from '../services/courseService';
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
    queryFn: () => {
      switch (type) {
        case 'pending':
          return CourseService.fetchPendingCourses();
        case 'all':
          return CourseService.fetchAll();
        default:
          return CourseService.fetchCoursesByStatus(type);
      }
    },
    onError: (err) => {
      console.error('Error in useCourses hook:', err);
      addNotification('Failed to fetch courses. Please try again.', 'error');
    },
  });

  // Approve course mutation
  const approveMutation = useMutation({
    mutationFn: ({ courseId, notes }) => CourseService.approveCourse(courseId, notes),
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
    mutationFn: ({ courseId, reason }) => CourseService.rejectCourse(courseId, reason),
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
    courses: type === 'all' ? data : undefined,
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
