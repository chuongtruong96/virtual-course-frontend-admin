import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../contexts/NotificationContext';
import InstructorService from '../services/instructorService';

export const useInstructorTests = (instructorId) => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();
  const [filters, setFilters] = useState({
    status: '',
    page: 0,
    size: 10,
    sort: 'createdAt',
    direction: 'desc'
  });

  // Fetch tests with pagination and filters - Cập nhật theo cú pháp React Query v5
  const {
    data: testsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['instructor-tests', instructorId, filters],
    queryFn: () => InstructorService.getTests(instructorId, filters),
    enabled: !!instructorId,
    keepPreviousData: true,
    onError: (error) => {
      addNotification('Failed to load tests', 'error');
      console.error('Error fetching tests:', error);
    }
  });

  // Update test status mutation - Cập nhật theo cú pháp React Query v5
  const updateTestStatus = useMutation({
    mutationFn: ({ testId, status }) => InstructorService.updateTestStatus(testId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-tests', instructorId] });
      addNotification('Test status updated successfully', 'success');
    },
    onError: (error) => {
      addNotification('Failed to update test status', 'error');
      console.error('Error updating test status:', error);
    }
  });

  // Delete test mutation - Cập nhật theo cú pháp React Query v5
  const deleteTest = useMutation({
    mutationFn: (testId) => InstructorService.deleteTest(testId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-tests', instructorId] });
      addNotification('Test deleted successfully', 'success');
    },
    onError: (error) => {
      addNotification('Failed to delete test', 'error');
      console.error('Error deleting test:', error);
    }
  });

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((newSize) => {
    setFilters(prev => ({ ...prev, size: newSize, page: 0 }));
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((field, direction) => {
    setFilters(prev => ({ ...prev, sort: field, direction, page: 0 }));
  }, []);

  return {
    tests: testsData?.content || [],
    totalElements: testsData?.totalElements || 0,
    totalPages: testsData?.totalPages || 0,
    currentPage: filters.page,
    pageSize: filters.size,
    isLoading,
    error,
    filters,
    updateFilters,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    updateTestStatus: updateTestStatus.mutate,
    deleteTest: deleteTest.mutate,
    refetchTests: refetch
  };
};