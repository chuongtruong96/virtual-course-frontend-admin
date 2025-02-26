import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import AdminService from '../services/adminService';

const useAdminDashboard = (filter = 'allTime', model = 'all') => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch statistics
  const {
    data: statistics,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorData,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['admin-statistics', filter, model],
    queryFn: () => AdminService.getStatistics(filter, model),
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
    onError: (err) => {
      console.error('Error fetching statistics:', err);
      addNotification('Failed to load statistics', 'error');
    }
  });

  // Fetch trends
  const {
    data: trends,
    isLoading: trendsLoading,
    isError: trendsError,
    error: trendsErrorData
  } = useQuery({
    queryKey: ['admin-trends', filter],
    queryFn: () => AdminService.getTrends(filter),
    staleTime: 30000,
    cacheTime: 300000,
    onError: (err) => {
      console.error('Error fetching trends:', err);
      addNotification('Failed to load trends', 'error');
    }
  });

  // Fetch pending courses
  const {
    data: pendingCourses,
    isLoading: coursesLoading,
    isError: coursesError,
    error: coursesErrorData
  } = useQuery({
    queryKey: ['pending-courses'],
    queryFn: AdminService.getPendingCourses,
    staleTime: 30000,
    cacheTime: 300000,
    onError: (err) => {
      console.error('Error fetching pending courses:', err);
      addNotification('Failed to load pending courses', 'error');
    }
  });

  // Fetch pending instructors
  const {
    data: pendingInstructors,
    isLoading: instructorsLoading,
    isError: instructorsError,
    error: instructorsErrorData
  } = useQuery({
    queryKey: ['pending-instructors'],
    queryFn: AdminService.getPendingInstructors,
    staleTime: 30000,
    cacheTime: 300000,
    onError: (err) => {
      console.error('Error fetching pending instructors:', err);
      addNotification('Failed to load pending instructors', 'error');
    }
  });

  // Mutations
  const approveCourse = useMutation({
    mutationFn: ({ courseId, notes }) => AdminService.approveCourse(courseId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-courses']);
      queryClient.invalidateQueries(['admin-statistics']);
      addNotification('Course approved successfully', 'success');
    },
    onError: (err) => {
      console.error('Error approving course:', err);
      addNotification('Failed to approve course', 'error');
    }
  });

  const rejectCourse = useMutation({
    mutationFn: ({ courseId, reason }) => AdminService.rejectCourse(courseId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-courses']);
      queryClient.invalidateQueries(['admin-statistics']);
      addNotification('Course rejected successfully', 'success');
    },
    onError: (err) => {
      console.error('Error rejecting course:', err);
      addNotification('Failed to reject course', 'error');
    }
  });

  const approveInstructor = useMutation({
    mutationFn: (instructorId) => AdminService.approveInstructor(instructorId),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-instructors']);
      queryClient.invalidateQueries(['admin-statistics']);
      addNotification('Instructor approved successfully', 'success');
    },
    onError: (err) => {
      console.error('Error approving instructor:', err);
      addNotification('Failed to approve instructor', 'error');
    }
  });

  const rejectInstructor = useMutation({
    mutationFn: ({ instructorId, reason }) => AdminService.rejectInstructor(instructorId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-instructors']);
      queryClient.invalidateQueries(['admin-statistics']);
      addNotification('Instructor rejected successfully', 'success');
    },
    onError: (err) => {
      console.error('Error rejecting instructor:', err);
      addNotification('Failed to reject instructor', 'error');
    }
  });

  return {
    statistics: statistics ? JSON.parse(JSON.stringify(statistics)) : null,
    trends: trends ? JSON.parse(JSON.stringify(trends)) : null,
    pendingCourses: pendingCourses ? JSON.parse(JSON.stringify(pendingCourses)) : [],
    pendingInstructors: pendingInstructors ? JSON.parse(JSON.stringify(pendingInstructors)) : [],
    isLoading: statsLoading || trendsLoading || coursesLoading || instructorsLoading,
    isError: statsError || trendsError || coursesError || instructorsError,
    error: statsErrorData || trendsErrorData || coursesErrorData || instructorsErrorData,
    refetch: refetchStats,
    approveCourse: approveCourse.mutate,
    rejectCourse: rejectCourse.mutate,
    approveInstructor: approveInstructor.mutate,
    rejectInstructor: rejectInstructor.mutate
  };
};

export default useAdminDashboard;