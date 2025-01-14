// src/hooks/useReviews.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReviewService from '../services/reviewService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useReviews = (courseId) => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch reviews for a course
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['reviews', 'course', courseId],
    queryFn: () => ReviewService.fetchReviewsByCourse({ courseId, signal: undefined }),
    enabled: !!courseId,
    onError: (err) => {
      console.error('Error fetching reviews:', err);
      addNotification('Không thể tải danh sách đánh giá.', 'danger');
    },
  });

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: ReviewService.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', 'course', courseId]);
      addNotification('Đánh giá đã được thêm thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to create review:', error);
      addNotification('Không thể thêm đánh giá. Vui lòng thử lại.', 'danger');
    },
  });

  // Update review mutation
  const updateReviewMutation = useMutation({
    mutationFn: ReviewService.updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', 'course', courseId]);
      addNotification('Đánh giá đã được cập nhật thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to update review:', error);
      addNotification('Không thể cập nhật đánh giá.', 'danger');
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: ReviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', 'course', courseId]);
      addNotification('Đánh giá đã được xóa thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete review:', error);
      addNotification('Không thể xóa đánh giá.', 'danger');
    },
  });

  return {
    reviews,
    isLoading,
    isError,
    error,

    createReview: createReviewMutation.mutate,
    updateReview: updateReviewMutation.mutate,
    deleteReview: deleteReviewMutation.mutate,

    createReviewStatus: createReviewMutation.status,
    updateReviewStatus: updateReviewMutation.status,
    deleteReviewStatus: deleteReviewMutation.status,
  };
};

export default useReviews;
