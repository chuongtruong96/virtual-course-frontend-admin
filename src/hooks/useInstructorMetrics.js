import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NotificationContext } from '../contexts/NotificationContext';
import InstructorService from '../services/instructorService';

export const useInstructorMetrics = (instructorId) => {
  const { addNotification } = useContext(NotificationContext);
  
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    error: metricsError,
    refetch: refetchMetrics
  } = useQuery({
    queryKey: ['instructor-metrics', instructorId],
    queryFn: () => InstructorService.getPerformanceMetrics(instructorId),
    enabled: !!instructorId,
    onError: (error) => {
      addNotification('Failed to load performance metrics', 'error');
      console.error('Error fetching metrics:', error);
    }
  });

  const getDetailedStats = async (timeRange = 'month') => {
    try {
      const stats = await InstructorService.getStatistics(instructorId, timeRange);
      return stats;
    } catch (error) {
      addNotification('Failed to load detailed statistics', 'error');
      console.error('Error fetching detailed stats:', error);
      throw error;
    }
  };

  return {
    metrics,
    isLoadingMetrics,
    metricsError,
    refetchMetrics,
    getDetailedStats
  };
};