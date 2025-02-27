// src/hooks/useNotifications.js
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import NotificationService from '../services/notificationService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useNotifications = (userId, options = {}) => {
    const queryClient = useQueryClient();
    const { addNotification } = useContext(NotificationContext);
    
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
        enableInfiniteQuery = false
    } = options;

    // Determine the query function based on options
    const getQueryFn = () => {
        if (searchTerm) {
            return () => NotificationService.searchNotifications(userId, searchTerm);
        } else if (startDate && endDate) {
            return () => NotificationService.fetchNotificationsByDateRange(userId, startDate, endDate);
        } else if (courseId) {
            return () => NotificationService.fetchNotificationsByCourse(courseId);
        } else if (paymentId) {
            return () => NotificationService.fetchNotificationsByPayment(paymentId);
        } else if (type) {
            return () => NotificationService.fetchNotificationsByType(userId, type);
        } else if (unreadOnly) {
            return () => NotificationService.fetchUnreadNotifications(userId);
        } else if (recentOnly) {
            return () => NotificationService.fetchRecentNotifications(userId);
        } else {
            return () => NotificationService.fetchNotifications(userId);
        }
    };

    // Determine the paginated query function based on options
    const getPaginatedQueryFn = () => {
        if (searchTerm) {
            return ({ pageParam = page }) => NotificationService.searchNotificationsPaginated(userId, searchTerm, pageParam, size);
        } else if (courseId) {
            return ({ pageParam = page }) => NotificationService.fetchNotificationsByCoursePaginated(courseId, pageParam, size);
        } else if (type) {
            return ({ pageParam = page }) => NotificationService.fetchNotificationsByTypePaginated(userId, type, pageParam, size);
        } else if (unreadOnly) {
            return ({ pageParam = page }) => NotificationService.fetchUnreadNotificationsPaginated(userId, pageParam, size);
        } else if (recentOnly) {
            return ({ pageParam = page }) => NotificationService.fetchRecentNotificationsPaginated(userId, pageParam, size);
        } else {
            return ({ pageParam = page }) => NotificationService.fetchNotificationsPaginated(userId, pageParam, size);
        }
    };

    // Build query key based on options
    const getQueryKey = () => {
        const baseKey = ['notifications', userId];
        if (searchTerm) return [...baseKey, 'search', searchTerm];
        if (startDate && endDate) return [...baseKey, 'dateRange', startDate, endDate];
        if (courseId) return [...baseKey, 'course', courseId];
        if (paymentId) return [...baseKey, 'payment', paymentId];
        if (type) return [...baseKey, 'type', type];
        if (unreadOnly) return [...baseKey, 'unread'];
        if (recentOnly) return [...baseKey, 'recent'];
        return baseKey;
    };

    // Regular query for non-paginated data
    const notificationsQuery = useQuery({
        queryKey: getQueryKey(),
        queryFn: getQueryFn(),
        enabled: !!userId && !enablePagination && !enableInfiniteQuery,
        onError: (err) => {
            console.error('Error fetching notifications:', err);
            addNotification('Failed to load notifications.', 'danger');
        },
    });

    // Paginated query
    const paginatedQuery = useQuery({
        queryKey: [...getQueryKey(), 'paginated', page, size],
        queryFn: () => getPaginatedQueryFn()({ pageParam: page }),
        enabled: !!userId && enablePagination && !enableInfiniteQuery,
        onError: (err) => {
            console.error('Error fetching paginated notifications:', err);
            addNotification('Failed to load notifications.', 'danger');
        },
    });

    // Infinite query for infinite scrolling
    const infiniteQuery = useInfiniteQuery({
        queryKey: [...getQueryKey(), 'infinite'],
        queryFn: getPaginatedQueryFn(),
        getNextPageParam: (lastPage) => {
            // Assuming the API returns a page object with totalPages and number (current page)
            if (lastPage.number < lastPage.totalPages - 1) {
                return lastPage.number + 1;
            }
            return undefined; // No more pages
        },
        enabled: !!userId && enableInfiniteQuery,
        onError: (err) => {
            console.error('Error fetching infinite notifications:', err);
            addNotification('Failed to load more notifications.', 'danger');
        },
    });

    // Count unread notifications
    const unreadCountQuery = useQuery({
        queryKey: ['notifications', userId, 'unreadCount'],
        queryFn: () => NotificationService.countUnreadNotifications(userId),
        enabled: !!userId,
        onError: (err) => {
            console.error('Error counting unread notifications:', err);
        },
    });

    // Get notification statistics
    const statisticsQuery = useQuery({
        queryKey: ['notifications', userId, 'statistics'],
        queryFn: () => NotificationService.getNotificationStatistics(userId),
        enabled: !!userId,
        onError: (err) => {
            console.error('Error fetching notification statistics:', err);
        },
    });

    // Mutation: Create notification
    const createNotificationMutation = useMutation({
        mutationFn: NotificationService.createNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
            addNotification('Notification created successfully!', 'success');
        },
        onError: (error) => {
            console.error('Failed to create notification:', error);
            addNotification('Failed to create notification.', 'danger');
        },
    });

    // Mutation: Mark as read
    const markAsReadMutation = useMutation({
        mutationFn: NotificationService.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
            queryClient.invalidateQueries({ queryKey: ['notifications', userId, 'unreadCount'] });
            addNotification('Notification marked as read.', 'success');
        },
        onError: (error) => {
            console.error('Failed to mark notification as read:', error);
            addNotification('Failed to mark notification as read.', 'danger');
        },
    });

    // Mutation: Mark all as read
    const markAllAsReadMutation = useMutation({
        mutationFn: () => NotificationService.markAllAsRead(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
            queryClient.invalidateQueries({ queryKey: ['notifications', userId, 'unreadCount'] });
            addNotification('All notifications marked as read.', 'success');
        },
        onError: (error) => {
            console.error('Failed to mark all notifications as read:', error);
            addNotification('Failed to mark all notifications as read.', 'danger');
        },
    });

    // Mutation: Mark all as read by type
    const markAllAsReadByTypeMutation = useMutation({
        mutationFn: (type) => NotificationService.markAllAsReadByType(userId, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
            queryClient.invalidateQueries({ queryKey: ['notifications', userId, 'unreadCount'] });
            addNotification('All notifications of this type marked as read.', 'success');
        },
        onError: (error) => {
            console.error('Failed to mark notifications as read:', error);
            addNotification('Failed to mark notifications as read.', 'danger');
        },
    });

    // Mutation: Delete notification
    const deleteNotificationMutation = useMutation({
        mutationFn: NotificationService.deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
            addNotification('Notification deleted successfully!', 'success');
        },
        onError: (error) => {
            console.error('Failed to delete notification:', error);
            addNotification('Failed to delete notification.', 'danger');
        },
    });

    // Mutation: Delete all read notifications
    const deleteAllReadMutation = useMutation({
        mutationFn: () => NotificationService.deleteAllRead(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
            addNotification('All read notifications deleted.', 'success');
        },
        onError: (error) => {
            console.error('Failed to delete read notifications:', error);
            addNotification('Failed to delete read notifications.', 'danger');
        },
    });

    // Mutation: Send notification
    const sendNotificationMutation = useMutation({
        mutationFn: ({ targetUserId, content, type, courseId, paymentId }) => 
            NotificationService.sendNotification(targetUserId, content, type, courseId, paymentId),
        onSuccess: () => {
            addNotification('Notification sent successfully!', 'success');
        },
        onError: (error) => {
            console.error('Failed to send notification:', error);
            addNotification('Failed to send notification.', 'danger');
        },
    });

    // Mutation: Send notification to multiple users
    const sendNotificationToMultipleUsersMutation = useMutation({
        mutationFn: ({ userIds, content, type, courseId, paymentId }) => 
            NotificationService.sendNotificationToMultipleUsers(userIds, content, type, courseId, paymentId),
        onSuccess: () => {
            addNotification('Notifications sent successfully!', 'success');
        },
        onError: (error) => {
            console.error('Failed to send notifications:', error);
            addNotification('Failed to send notifications.', 'danger');
        },
    });

    // Mutation: Update notification content
    const updateNotificationContentMutation = useMutation({
        mutationFn: ({ id, content }) => NotificationService.updateNotificationContent(id, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
            addNotification('Notification updated successfully!', 'success');
        },
        onError: (error) => {
            console.error('Failed to update notification:', error);
            addNotification('Failed to update notification.', 'danger');
        },
    });

    return {
        // Queries
        notifications: notificationsQuery.data,
        paginatedNotifications: paginatedQuery.data,
        infiniteNotifications: infiniteQuery.data,
        unreadCount: unreadCountQuery.data,
        statistics: statisticsQuery.data,
        
        // Query states
        isLoading: notificationsQuery.isLoading || paginatedQuery.isLoading || infiniteQuery.isLoading,
        isError: notificationsQuery.isError || paginatedQuery.isError || infiniteQuery.isError,
        error: notificationsQuery.error || paginatedQuery.error || infiniteQuery.error,
        
        // Infinite query functions
        fetchNextPage: infiniteQuery.fetchNextPage,
        hasNextPage: infiniteQuery.hasNextPage,
        isFetchingNextPage: infiniteQuery.isFetchingNextPage,
        
        // Mutations
        createNotification: createNotificationMutation.mutate,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
        markAllAsReadByType: markAllAsReadByTypeMutation.mutate,
        deleteNotification: deleteNotificationMutation.mutate,
        deleteAllRead: deleteAllReadMutation.mutate,
        sendNotification: sendNotificationMutation.mutate,
        sendNotificationToMultipleUsers: sendNotificationToMultipleUsersMutation.mutate,
        updateNotificationContent: updateNotificationContentMutation.mutate,
        
        // Mutation states
        createNotificationStatus: createNotificationMutation.status,
        markAsReadStatus: markAsReadMutation.status,
        markAllAsReadStatus: markAllAsReadMutation.status,
        markAllAsReadByTypeStatus: markAllAsReadByTypeMutation.status,
        deleteNotificationStatus: deleteNotificationMutation.status,
        deleteAllReadStatus: deleteAllReadMutation.status,
        sendNotificationStatus: sendNotificationMutation.status,
        sendNotificationToMultipleUsersStatus: sendNotificationToMultipleUsersMutation.status,
        updateNotificationContentStatus: updateNotificationContentMutation.status,
    };
};

export default useNotifications;