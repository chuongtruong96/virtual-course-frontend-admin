import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../contexts/NotificationContext';
import InstructorService from '../services/instructorService';

export const useInstructorReviews = (instructorId) => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();
  const [filters, setFilters] = useState({
    rating: '',
    page: 0,
    size: 10,
    sort: 'createdAt',
    direction: 'desc'
  });

  // Fetch reviews with pagination and filters
  const {
    data: reviewsData,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['instructor-reviews', instructorId, filters],
    () => InstructorService.getReviews(instructorId, filters),
    {
      enabled: !!instructorId,
      keepPreviousData: true,
      onError: (error) => {
        addNotification('Failed to load reviews', 'error');
        console.error('Error fetching reviews:', error);
      }
    }
  );

  // Reply to review mutation
  const replyToReview = useMutation(
    ({ reviewId, reply }) => InstructorService.replyToReview(reviewId, reply),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['instructor-reviews', instructorId]);
        addNotification('Reply posted successfully', 'success');
      },
      onError: (error) => {
        addNotification('Failed to post reply', 'error');
        console.error('Error posting reply:', error);
      }
    }
  );

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

  // Filter by rating
  const filterByRating = useCallback((rating) => {
    setFilters(prev => ({ ...prev, rating, page: 0 }));
  }, []);

  return {
    reviews: reviewsData?.content || [],
    totalElements: reviewsData?.totalElements || 0,
    totalPages: reviewsData?.totalPages || 0,
    currentPage: filters.page,
    pageSize: filters.size,
    isLoading,
    error,
    filters,
    updateFilters,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    filterByRating,
    replyToReview: replyToReview.mutate,
    refetchReviews: refetch
  };
};
