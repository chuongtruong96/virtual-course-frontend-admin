export const useInstructorMetrics = (instructorId) => {
  const { addNotification } = useContext(NotificationContext);

  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    error: metricsError,
    refetch: refetchMetrics
  } = useQuery(
    ['instructor-metrics', instructorId],
    () => InstructorService.getPerformanceMetrics(instructorId),
    {
      enabled: !!instructorId,
      onError: (error) => {
        addNotification('Failed to load performance metrics', 'error');
        console.error('Error fetching metrics:', error);
      }
    }
  );

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