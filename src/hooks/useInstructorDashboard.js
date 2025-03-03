import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNotification } from '../contexts/NotificationContext';
import InstructorService from '../services/instructorService';

export const useInstructorDashboard = (instructorId) => {
  const { addNotification } = useNotification();
  const [timeRange, setTimeRange] = useState('month');

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['instructor-dashboard', instructorId, timeRange],
    () => InstructorService.getInstructorDashboard(instructorId),
    {
      enabled: !!instructorId,
      onError: (error) => {
        addNotification('Failed to load dashboard data', 'error');
        console.error('Error fetching dashboard data:', error);
      }
    }
  );

  // Change time range
  const changeTimeRange = (newRange) => {
    setTimeRange(newRange);
  };

  return {
    dashboardData,
    isLoading,
    error,
    timeRange,
    changeTimeRange,
    refetchDashboard: refetch
  };
};