// src/hooks/useNotifications.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import NotificationService from '../services/notificationService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useNotifications = (userId) => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch notifications for a user
  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => NotificationService.fetchNotifications({ userId, signal: undefined }),
    enabled: !!userId,
    onError: (err) => {
      console.error('Error fetching notifications:', err);
      addNotification('Không thể tải thông tin thông báo.', 'danger');
    },
  });

  // Mutation: Create notification
  const createNotificationMutation = useMutation({
    mutationFn: NotificationService.createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
      addNotification('Thông báo đã được tạo thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to create notification:', error);
      addNotification('Không thể tạo thông báo. Vui lòng thử lại.', 'danger');
    },
  });

  // Mutation: Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: NotificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
      addNotification('Thông báo đã được đánh dấu là đã đọc.', 'success');
    },
    onError: (error) => {
      console.error('Failed to mark notification as read:', error);
      addNotification('Không thể đánh dấu thông báo.', 'danger');
    },
  });

  // Mutation: Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: NotificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
      addNotification('Thông báo đã được xóa thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete notification:', error);
      addNotification('Không thể xóa thông báo.', 'danger');
    },
  });

  return {
    notifications,
    isLoading,
    isError,
    error,
    createNotification: createNotificationMutation.mutate,
    markAsRead: markAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    createNotificationStatus: createNotificationMutation.status,
    markAsReadStatus: markAsReadMutation.status,
    deleteNotificationStatus: deleteNotificationMutation.status,
  };
};

export default useNotifications;
