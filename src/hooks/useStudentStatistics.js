import { useState, useEffect, useCallback } from 'react';
import StudentStatisticsService from '../services/StudentStatisticsService';

/**
 * Custom hook for managing student statistics
 * @returns {Object} Student statistics state and methods
 */
const useStudentStatistics = () => {
  const [studentStatistics, setStudentStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch student statistics data
   */
  const fetchStudentStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await StudentStatisticsService.getStudentPerformanceStatistics();
      setStudentStatistics(data);
    } catch (err) {
      console.error('Error fetching student statistics:', err);
      setError(err.message || 'Failed to fetch student statistics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh student statistics data
   */
  const refreshStudentStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await StudentStatisticsService.refreshStudentPerformanceData();
      setStudentStatistics(data);
      return true;
    } catch (err) {
      console.error('Error refreshing student statistics:', err);
      setError(err.message || 'Failed to refresh student statistics');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Export student statistics data
   */
  const exportStudentStatistics = useCallback(async () => {
    try {
      await StudentStatisticsService.exportStudentPerformanceData();
      return true;
    } catch (err) {
      console.error('Error exporting student statistics:', err);
      return false;
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchStudentStatistics();
  }, [fetchStudentStatistics]);

  return {
    studentStatistics,
    isLoading,
    error,
    fetchStudentStatistics,
    refreshStudentStatistics,
    exportStudentStatistics
  };
};

export default useStudentStatistics;