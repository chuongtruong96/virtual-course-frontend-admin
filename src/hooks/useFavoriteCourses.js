// src/hooks/useFavoriteCourses.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FavoriteCourseService from '../services/favoriteCourseService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useFavoriteCourses = (studentId) => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch favorite courses
  const {
    data: favoriteCourses,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['favoriteCourses', studentId],
    queryFn: () => FavoriteCourseService.getFavoriteCourses({ studentId, signal: undefined }),
    enabled: !!studentId,
    onError: (err) => {
      console.error('Error fetching favorite courses:', err);
      addNotification('Không thể tải danh sách khóa học yêu thích.', 'danger');
    },
  });

  // Add favorite course mutation
  const addFavoriteCourseMutation = useMutation({
    mutationFn: FavoriteCourseService.addFavoriteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(['favoriteCourses', studentId]);
      addNotification('Khóa học đã được thêm vào danh sách yêu thích!', 'success');
    },
    onError: (error) => {
      console.error('Failed to add favorite course:', error);
      addNotification('Không thể thêm khóa học vào danh sách yêu thích.', 'danger');
    },
  });

  // Remove favorite course mutation
  const removeFavoriteCourseMutation = useMutation({
    mutationFn: FavoriteCourseService.removeFavoriteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(['favoriteCourses', studentId]);
      addNotification('Khóa học đã được loại khỏi danh sách yêu thích!', 'success');
    },
    onError: (error) => {
      console.error('Failed to remove favorite course:', error);
      addNotification('Không thể loại khỏi danh sách yêu thích.', 'danger');
    },
  });

  return {
    favoriteCourses,
    isLoading,
    isError,
    error,

    addFavoriteCourse: addFavoriteCourseMutation.mutate,
    removeFavoriteCourse: removeFavoriteCourseMutation.mutate,

    addFavoriteCourseStatus: addFavoriteCourseMutation.status,
    removeFavoriteCourseStatus: removeFavoriteCourseMutation.status,
  };
};

export default useFavoriteCourses;
