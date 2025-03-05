import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import ReviewService from '../services/reviewService';

/**
 * Custom hook for admin review management
 * @param {Object} options - Configuration options
 * @param {number} options.courseId - Optional course ID filter
 * @param {number} options.studentId - Optional student ID filter
 * @param {number} options.rating - Optional rating filter
 * @param {number} options.page - Current page number
 * @param {number} options.size - Page size
 * @returns {Object} Review management functions and data
 */
const useAdminReviews = ({ courseId, studentId, rating, page = 0, size = 10 } = {}) => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);
  
  // Build query key based on filters
  const queryKey = ['admin', 'reviews', { courseId, studentId, rating, page, size }];
  
  // Fetch reviews with pagination and filters
  const {
    data: reviewsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('size', size);
      
      if (courseId) params.append('courseId', courseId);
      if (studentId) params.append('studentId', studentId);
      if (rating) params.append('rating', rating);
      
      return await ReviewService.fetchAllReviews(params);
    },
    keepPreviousData: true,
  });
  
  // Fetch review statistics
  const {
    data: statistics,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['admin', 'reviews', 'statistics', { courseId, studentId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (courseId) params.append('courseId', courseId);
      if (studentId) params.append('studentId', studentId);
      
      return await ReviewService.fetchReviewStatistics(params);
    },
  });
  
  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: ReviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(['admin', 'reviews', 'statistics']);
      addNotification('Review deleted successfully!', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete review:', error);
      addNotification('Failed to delete review. Please try again.', 'danger');
    },
  });
  
  // Moderate review mutation
  const moderateReviewMutation = useMutation({
    mutationFn: ({ reviewId, reviewData }) => 
      ReviewService.moderateReview(reviewId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'reviews']);
      addNotification('Review updated successfully!', 'success');
    },
    onError: (error) => {
      console.error('Failed to update review:', error);
      addNotification('Failed to update review. Please try again.', 'danger');
    },
  });
  
  return {
    // Data
    reviews: reviewsData?.content || [],
    totalPages: reviewsData?.totalPages || 0,
    totalElements: reviewsData?.totalElements || 0,
    statistics,
    
    // Loading states
    isLoading,
    isLoadingStats,
    isError,
    error,
    
    // Actions
    refetch,
    refetchStats,
    deleteReview: deleteReviewMutation.mutate,
    moderateReview: moderateReviewMutation.mutate,
    
    // Mutation states
    isDeleting: deleteReviewMutation.isLoading,
    isModerating: moderateReviewMutation.isLoading,
  };
};

export default useAdminReviews;