import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import NotificationService from '../services/notificationService';
import { normalizeNotificationType } from '../constants/notificationTypes';

/**
 * Custom hook để quản lý thông báo với React Query
 * 
 * @param {number|null} userId - ID của người dùng, null nếu xem tất cả (admin)
 * @param {Object} options - Các tùy chọn cho hook
 * @returns {Object} - Các phương thức và dữ liệu thông báo
 */
const useNotifications = (userId, options = {}) => {
  const queryClient = useQueryClient();
  
  const {
    type,
    page = 0,
    size = 10,
    searchTerm,
    startDate,
    endDate,
    courseId,
    paymentId,
    unreadOnly = false,
    recentOnly = false,
    enablePagination = false,
    viewAllUsers = false,
    isAdmin = false
  } = options;

  // Chuẩn hóa loại thông báo
  const normalizedType = useMemo(() => 
    type ? normalizeNotificationType(type) : null
  , [type]);
  
  // Xây dựng query key dựa trên các tùy chọn
  // Modify the getQueryKey function to ensure unique keys for different filters
const getQueryKey = useCallback(() => {
  if (isAdmin && viewAllUsers) {
    return ['notifications', 'admin', 'all', page, size];
  }
  
  const baseKey = ['notifications', userId];
  
  // Create a more specific key based on active filters
  if (searchTerm) {
    return [...baseKey, 'search', searchTerm, page, size];
  }
  
  if (startDate && endDate) {
    return [...baseKey, 'dateRange', startDate, endDate, page, size];
  }
  
  if (courseId) {
    return [...baseKey, 'course', courseId, page, size];
  }
  
  if (paymentId) {
    return [...baseKey, 'payment', paymentId, page, size];
  }
  
  if (normalizedType) {
    return [...baseKey, 'type', normalizedType, page, size];
  }
  
  if (unreadOnly) {
    return [...baseKey, 'unread', page, size];
  }
  
  if (recentOnly) {
    return [...baseKey, 'recent', page, size];
  }
  
  return [...baseKey, page, size];
}, [isAdmin, viewAllUsers, userId, searchTerm, startDate, endDate, courseId, paymentId, normalizedType, unreadOnly, recentOnly, page, size]);// Xác định hàm query dựa trên các tùy chọn
  const getQueryFn = useCallback(() => {
    if (viewAllUsers) {
      console.log("Admin viewing all notifications");
      return NotificationService.getAllNotifications();
    }
    
    if (!userId) {
      console.log("No userId provided, returning empty array");
      return Promise.resolve([]);
    }
    
    if (searchTerm) {
      return NotificationService.searchNotifications(userId, searchTerm);
    } else if (startDate && endDate) {
      return NotificationService.getNotificationsByDateRange(userId, startDate, endDate);
    } else if (courseId) {
      return NotificationService.getNotificationsByCourse(courseId);
    } else if (paymentId) {
      return NotificationService.getNotificationsByPayment(paymentId);
    } else if (normalizedType) {
      return NotificationService.getNotificationsByUserAndType(userId, normalizedType);
    } else if (unreadOnly) {
      return NotificationService.getUnreadNotifications(userId);
    } else if (recentOnly) {
      return NotificationService.getRecentNotifications(userId);
    } else {
      return NotificationService.getNotificationsByUser(userId);
    }
  }, [viewAllUsers, userId, searchTerm, startDate, endDate, courseId, paymentId, normalizedType, unreadOnly, recentOnly]);

  // Xác định hàm query phân trang dựa trên các tùy chọn
  // Modify the getPaginatedQueryFn function to handle date range properly
const getPaginatedQueryFn = useCallback(() => {
  if (isAdmin && viewAllUsers) {
    console.log("Admin viewing all notifications with pagination");
    return NotificationService.getAllNotificationsPaginated(page, size);
  }
  
  if (!userId) {
    console.log("No userId provided, returning empty page");
    return Promise.resolve({ content: [], totalElements: 0, totalPages: 0 });
  }
  
  try {
    if (searchTerm) {
      console.log(`Searching for "${searchTerm}" in user ${userId} notifications, page=${page}, size=${size}`);
      return NotificationService.searchNotificationsPaginated(userId, searchTerm, page, size);
    } else if (startDate && endDate) {
      console.log(`Fetching notifications for date range ${startDate} to ${endDate}, page=${page}, size=${size}`);
      // Note: You need to implement this method in NotificationService if it doesn't exist
      return NotificationService.getNotificationsByDateRangePaginated(userId, startDate, endDate, page, size);
    } else if (courseId) {
      return NotificationService.getNotificationsByCoursePaginated(courseId, page, size);
    } else if (normalizedType) {
      console.log(`Fetching notifications by type: ${normalizedType} for user ${userId}, page=${page}, size=${size}`);
      return NotificationService.getNotificationsByUserAndTypePaginated(userId, normalizedType, page, size);
    } else if (unreadOnly) {
      return NotificationService.getUnreadNotificationsPaginated(userId, page, size);
    } else if (recentOnly) {
      return NotificationService.getRecentNotificationsPaginated(userId, page, size);
    } else {
      return NotificationService.getNotificationsByUserPaginated(userId, page, size);
    }
  } catch (error) {
    console.error('Error in getPaginatedQueryFn:', error);
    return Promise.resolve({ content: [], totalElements: 0, totalPages: 0 });
  }
}, [isAdmin, viewAllUsers, userId, searchTerm, startDate, endDate, courseId, normalizedType, unreadOnly, recentOnly, page, size]);
  // Query thông thường (không phân trang)
  const notificationsQuery = useQuery({
    queryKey: getQueryKey(),
    queryFn: () => getQueryFn(),
    enabled: (!!userId || viewAllUsers) && !enablePagination,
    staleTime: 60000, // 1 phút
  });

  // Query phân trang
  const paginatedQuery = useQuery({
    queryKey: [...getQueryKey(), 'paginated', page, size],
    queryFn: () => getPaginatedQueryFn(),
    enabled: enablePagination && (!!userId || (isAdmin && viewAllUsers)),
    staleTime: 30000, // 30 giây
    retry: 2,
    onError: (error) => {
      console.error('Pagination query error:', error);
    }
  });

  // Query tất cả thông báo (cho admin)
  const allNotificationsQuery = useQuery({
    queryKey: ['notifications', 'all'],
    queryFn: () => NotificationService.getAllNotifications(),
    enabled: isAdmin && viewAllUsers && !enablePagination
  });

  // Query tất cả thông báo phân trang (cho admin)
  const allNotificationsPaginatedQuery = useQuery({
    queryKey: ['notifications', 'all', 'paginated', page, size],
    queryFn: () => NotificationService.getAllNotificationsPaginated(page, size),
    enabled: isAdmin && viewAllUsers && enablePagination
  });

  // Đếm số thông báo chưa đọc
  const unreadCountQuery = useQuery({
    queryKey: ['notifications', userId, 'unreadCount'],
    queryFn: () => {
      if (!userId) return 0;
      return NotificationService.countUnreadNotifications(userId);
    },
    enabled: !!userId,
    staleTime: 60000, // 1 phút
  });

  // Lấy thống kê thông báo
  const statisticsQuery = useQuery({
    queryKey: ['notifications', userId, 'statistics'],
    queryFn: () => {
      if (!userId) return {
        totalCount: 0,
        unreadCount: 0,
        courseNotificationsCount: 0,
        paymentNotificationsCount: 0,
        systemNotificationsCount: 0
      };
      return NotificationService.getNotificationStatistics(userId);
    },
    enabled: !!userId,
    staleTime: 60000, // 1 phút
  });
  // Mutation: Đánh dấu đã đọc
  const markAsReadMutation = useMutation({
    mutationFn: NotificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Mutation: Đánh dấu tất cả đã đọc
  const markAllAsReadMutation = useMutation({
    mutationFn: () => {
      if (!userId) return Promise.resolve();
      return NotificationService.markAllAsRead(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Mutation: Đánh dấu tất cả đã đọc theo loại
  const markAllAsReadByTypeMutation = useMutation({
    mutationFn: (type) => {
      if (!userId) return Promise.resolve();
      return NotificationService.markAllAsReadByType(userId, type);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Mutation: Xóa thông báo
  const deleteNotificationMutation = useMutation({
    mutationFn: NotificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Mutation: Xóa tất cả thông báo đã đọc
  const deleteAllReadMutation = useMutation({
    mutationFn: () => {
      if (!userId) return Promise.resolve();
      return NotificationService.deleteAllRead(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Mutation: Cập nhật nội dung thông báo
  const updateNotificationContentMutation = useMutation({
    mutationFn: ({ id, content }) => NotificationService.updateNotificationContent(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Mutation: Gửi thông báo
  const sendNotificationMutation = useMutation({
    mutationFn: ({ targetUserId, content, type, courseId, paymentId }) => {
      return NotificationService.sendNotification(
        targetUserId,
        content,
        type,
        courseId,
        paymentId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Mutation: Gửi thông báo cho nhiều người dùng
  const sendNotificationToMultipleUsersMutation = useMutation({
    mutationFn: ({ userIds, content, type, courseId, paymentId }) => {
      return NotificationService.sendNotificationToMultipleUsers(
        userIds,
        content,
        type,
        courseId,
        paymentId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Hàm làm mới thông báo
  // Hàm làm mới thông báo
const refreshNotifications = useCallback(() => {
  console.log("Refreshing notifications with filters:", {
    type: normalizedType,
    searchTerm: searchTerm,
    dateRange: startDate && endDate ? `${startDate} to ${endDate}` : 'none',
    unreadOnly: unreadOnly,
    recentOnly: recentOnly
  });
  
  if (isAdmin && viewAllUsers) {
    queryClient.invalidateQueries({ queryKey: ['notifications', 'admin', 'all'] });
  } else if (userId) {
    if (normalizedType) {
      // Specifically invalidate type-filtered queries
      queryClient.invalidateQueries({ 
        queryKey: ['notifications', userId, 'type', normalizedType]
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    }
  }
  
  // Làm mới số lượng chưa đọc và thống kê
  if (userId) {
    queryClient.invalidateQueries({ queryKey: ['notifications', userId, 'unreadCount'] });
    queryClient.invalidateQueries({ queryKey: ['notifications', userId, 'statistics'] });
  }
}, [queryClient, isAdmin, viewAllUsers, userId, normalizedType, searchTerm, startDate, endDate, unreadOnly, recentOnly]);

  return {
    // Thêm 2 properties mới này
    allNotifications: allNotificationsQuery.data || [],
    allNotificationsPaginated: allNotificationsPaginatedQuery.data || { 
      content: [], 
      totalElements: 0, 
      totalPages: 0 
    },
  
    // Các properties hiện tại
    notifications: notificationsQuery.data || [],
    paginatedNotifications: paginatedQuery.data || { content: [], totalElements: 0, totalPages: 0 },
    unreadCount: unreadCountQuery.data || 0,
    statistics: statisticsQuery.data || {
      totalCount: 0,
      unreadCount: 0,
      courseNotificationsCount: 0,
      paymentNotificationsCount: 0,
      systemNotificationsCount: 0
    },
    
    // Trạng thái
    isLoading: notificationsQuery.isLoading || paginatedQuery.isLoading || 
               allNotificationsQuery.isLoading || allNotificationsPaginatedQuery.isLoading,
    isError: notificationsQuery.isError || paginatedQuery.isError || 
             allNotificationsQuery.isError || allNotificationsPaginatedQuery.isError,
    error: notificationsQuery.error || paginatedQuery.error || 
           allNotificationsQuery.error || allNotificationsPaginatedQuery.error,
    
    // Các hàm mutation
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    markAllAsReadByType: markAllAsReadByTypeMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    deleteAllRead: deleteAllReadMutation.mutate,
    updateNotificationContent: updateNotificationContentMutation.mutate,
    sendNotification: sendNotificationMutation.mutate,
    sendNotificationToMultipleUsers: sendNotificationToMultipleUsersMutation.mutate,
    refreshNotifications,
  };
};

export default useNotifications;