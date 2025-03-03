import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import NotificationService from '../services/notificationService';
import { useContext, useCallback } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { normalizeNotificationType } from '../constants/notificationTypes';

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
        enableInfiniteQuery = false,
        viewAllUsers = false
    } = options;
    console.log("useNotifications hook called with:", { userId, options, viewAllUsers: options.viewAllUsers });

    // Normalize the notification type to ensure backend compatibility
    const normalizedType = type ? normalizeNotificationType(type) : null;
    
    // Determine the query function based on options
    const getQueryFn = useCallback(() => {
        // Special case for admin viewing all notifications
        if (viewAllUsers) {
            console.log("Admin viewing all notifications - preparing query function");
            return () => {
                console.log("Executing getAllNotifications query function");
                return NotificationService.getAllNotifications().then(data => {
                    console.log("getAllNotifications response:", data);
                    return data;
                });
            };
        }
    
        if (!userId) {
            console.log("No userId provided, returning empty array");
            return () => Promise.resolve([]); // Return empty array if no userId
        }

        if (searchTerm) {
            return () => NotificationService.searchNotifications(userId, searchTerm);
        } else if (startDate && endDate) {
            return () => NotificationService.fetchNotificationsByDateRange(userId, startDate, endDate);
        } else if (courseId) {
            return () => NotificationService.fetchNotificationsByCourse(courseId);
        } else if (paymentId) {
            return () => NotificationService.fetchNotificationsByPayment(paymentId);
        } else if (normalizedType) {
            // Use normalized type when fetching by type
            return () => NotificationService.fetchNotificationsByType(userId, normalizedType);
        } else if (unreadOnly) {
            return () => NotificationService.fetchUnreadNotifications(userId);
        } else if (recentOnly) {
            return () => NotificationService.fetchRecentNotifications(userId);
        } else {
            return () => NotificationService.fetchNotifications(userId);
        }
    }, [viewAllUsers, userId, searchTerm, startDate, endDate, courseId, paymentId, normalizedType, unreadOnly, recentOnly]);

    // Determine the paginated query function based on options
    const getPaginatedQueryFn = useCallback(() => {
        // Special case for admin viewing all notifications
        if (viewAllUsers) {
            console.log("Admin viewing all notifications with pagination");
            return ({ pageParam = page }) => NotificationService.getAllNotificationsPaginated(pageParam, size);
        }

        if (!userId) {
            console.log("No userId provided, returning empty page");
            return () => Promise.resolve({ content: [], totalElements: 0, totalPages: 0 }); // Return empty page if no userId
        }
        
        if (searchTerm) {
            return ({ pageParam = page }) => NotificationService.searchNotificationsPaginated(userId, searchTerm, pageParam, size);
        } else if (courseId) {
            return ({ pageParam = page }) => NotificationService.fetchNotificationsByCoursePaginated(courseId, pageParam, size);
        } else if (normalizedType) {
            // Use normalized type when fetching by type with pagination
            return ({ pageParam = page }) => NotificationService.fetchNotificationsByTypePaginated(userId, normalizedType, pageParam, size);
        } else if (unreadOnly) {
            return ({ pageParam = page }) => NotificationService.fetchUnreadNotificationsPaginated(userId, pageParam, size);
        } else if (recentOnly) {
            return ({ pageParam = page }) => NotificationService.fetchRecentNotificationsPaginated(userId, pageParam, size);
        } else {
            return ({ pageParam = page }) => NotificationService.fetchNotificationsPaginated(userId, pageParam, size);
        }
    }, [viewAllUsers, userId, searchTerm, courseId, normalizedType, unreadOnly, recentOnly, page, size]);

    // Build query key based on options
    const getQueryKey = useCallback(() => {
        if (viewAllUsers) {
            console.log("Using 'all' query key for admin view");
            return ['notifications', 'all'];
        }

        if (!userId) {
            console.log("No userId, using empty query key");
            return ['notifications', 'empty'];
        }

        const baseKey = ['notifications', userId];
        if (searchTerm) return [...baseKey, 'search', searchTerm];
        if (startDate && endDate) return [...baseKey, 'dateRange', startDate, endDate];
        if (courseId) return [...baseKey, 'course', courseId];
        if (paymentId) return [...baseKey, 'payment', paymentId];
        if (normalizedType) return [...baseKey, 'type', normalizedType]; // Use normalized type in query key
        if (unreadOnly) return [...baseKey, 'unread'];
        if (recentOnly) return [...baseKey, 'recent'];
        return baseKey;
    }, [viewAllUsers, userId, searchTerm, startDate, endDate, courseId, paymentId, normalizedType, unreadOnly, recentOnly]);

    // Regular query for non-paginated data
    const notificationsQuery = useQuery({
        queryKey: getQueryKey(),
        queryFn: getQueryFn(),
        enabled: (!!userId || viewAllUsers) && !enablePagination && !enableInfiniteQuery,
        onSuccess: (data) => {
            console.log('Notifications loaded successfully:', data);
        },
        onError: (err) => {
            console.error('Error fetching notifications:', err);
            addNotification('Failed to load notifications.', 'danger');
        },
        retry: 2, // Retry failed requests up to 2 times
        staleTime: 60000, // Consider data fresh for 1 minute
    });

    // Paginated query
    const paginatedQuery = useQuery({
        queryKey: [...getQueryKey(), 'paginated', page, size],
        queryFn: () => {
            const fn = getPaginatedQueryFn();
            return fn({ pageParam: page });
        },
        enabled: (!!userId || viewAllUsers) && enablePagination && !enableInfiniteQuery,
        onSuccess: (data) => {
            console.log('Paginated notifications loaded:', data);
        },
        onError: (err) => {
            console.error('Error fetching paginated notifications:', err);
            addNotification('Failed to load notifications.', 'danger');
        },
        retry: 2,
        staleTime: 60000,
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
        enabled: (!!userId || viewAllUsers) && enableInfiniteQuery,
        onError: (err) => {
            console.error('Error fetching infinite notifications:', err);
            addNotification('Failed to load more notifications.', 'danger');
        },
        retry: 2,
    });

    // Count unread notifications
    const unreadCountQuery = useQuery({
        queryKey: ['notifications', userId, 'unreadCount'],
        queryFn: () => {
            if (!userId) return 0;
            return NotificationService.countUnreadNotifications(userId);
        },
        enabled: !!userId,
        onError: (err) => {
            console.error('Error counting unread notifications:', err);
        },
        retry: 2,
        staleTime: 60000,
    });

    // Get notification statistics
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
        onError: (err) => {
            console.error('Error fetching notification statistics:', err);
        },
        retry: 2,
        staleTime: 60000,
    });

    // Mutation: Create notification
    const createNotificationMutation = useMutation({
        mutationFn: NotificationService.createNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
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
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            addNotification('Notification marked as read.', 'success');
        },
        onError: (error) => {
            console.error('Failed to mark notification as read:', error);
            addNotification('Failed to mark notification as read.', 'danger');
        },
    });

    // Mutation: Mark all as read
    const markAllAsReadMutation = useMutation({
        mutationFn: () => {
            if (!userId) return Promise.resolve();
            return NotificationService.markAllAsRead(userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            addNotification('All notifications marked as read.', 'success');
        },
        onError: (error) => {
            console.error('Failed to mark all notifications as read:', error);
            addNotification('Failed to mark all notifications as read.', 'danger');
        },
    });

    // Mutation: Mark all as read by type
    const markAllAsReadByTypeMutation = useMutation({
        mutationFn: (type) => {
            if (!userId) return Promise.resolve();
            // Normalize the type before sending to the API
            const normalizedTypeValue = normalizeNotificationType(type);
            return NotificationService.markAllAsReadByType(userId, normalizedTypeValue);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
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
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            addNotification('Notification deleted successfully!', 'success');
        },
        onError: (error) => {
            console.error('Failed to delete notification:', error);
            addNotification('Failed to delete notification.', 'danger');
        },
    });

    // Mutation: Delete all read notifications
    const deleteAllReadMutation = useMutation({
        mutationFn: () => {
            if (!userId) return Promise.resolve();
            return NotificationService.deleteAllRead(userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            addNotification('All read notifications deleted.', 'success');
        },
        onError: (error) => {
            console.error('Failed to delete read notifications:', error);
            addNotification('Failed to delete read notifications.', 'danger');
        },
    });

    // Mutation: Send notification
    const sendNotificationMutation = useMutation({
        mutationFn: ({ targetUserId, content, type, courseId, paymentId }) => {
            // Normalize the type before sending to the API
            const normalizedTypeValue = type ? normalizeNotificationType(type) : null;
            console.log('Sending notification with:', { 
                targetUserId, 
                content, 
                type: normalizedTypeValue, 
                courseId, 
                paymentId 
            });
            return NotificationService.sendNotification(
                targetUserId, 
                content, 
                normalizedTypeValue, 
                courseId, 
                paymentId
            );
        },
        onSuccess: (data) => {
            console.log('Notification sent successfully:', data);
            addNotification('Notification sent successfully!', 'success');
            // Refresh notification list
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error) => {
            console.error('Failed to send notification:', error);
            addNotification('Failed to send notification.', 'danger');
        },
    });

    // Mutation: Send notification to multiple users
    const sendNotificationToMultipleUsersMutation = useMutation({
        mutationFn: ({ userIds, content, type, courseId, paymentId }) => {
            // Normalize the type before sending to the API
            const normalizedTypeValue = type ? normalizeNotificationType(type) : null;
            return NotificationService.sendNotificationToMultipleUsers(
                userIds, 
                content, 
                normalizedTypeValue, 
                courseId, 
                paymentId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
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
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            addNotification('Notification updated successfully!', 'success');
        },
        onError: (error) => {
            console.error('Failed to update notification:', error);
            addNotification('Failed to update notification.', 'danger');
        },
    });

    // Add a refresh function
    // Add a refresh function
    const refreshNotifications = useCallback(() => {
        console.log("Refreshing notifications");
        if (viewAllUsers) {
            queryClient.invalidateQueries({ queryKey: ['notifications', 'all'] });
        } else if (userId) {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        }
        
        // Also refresh unread count and statistics
        if (userId) {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId, 'unreadCount'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', userId, 'statistics'] });
        }
        
        // Add a small delay to ensure UI updates
        setTimeout(() => {
            console.log("Refresh completed");
        }, 300);
        
        return true;
    }, [queryClient, userId, viewAllUsers]);

    // Debug function to check API connectivity
    const checkApiConnection = useCallback(async () => {
        try {
            const result = await NotificationService.checkNotificationAPI();
            console.log("API connection check result:", result);
            return result;
        } catch (error) {
            console.error("API connection check failed:", error);
            return { status: 'error', message: error.message };
        }
    }, []);

    // Force refresh with retry logic
    const forceRefreshWithRetry = useCallback(async (maxRetries = 3) => {
        let retries = 0;
        let success = false;
        
        while (retries < maxRetries && !success) {
            try {
                console.log(`Attempt ${retries + 1} to force refresh notifications`);
                
                // Invalidate all notification queries
                queryClient.invalidateQueries({ queryKey: ['notifications'] });
                
                // Wait for queries to settle
                await new Promise(resolve => setTimeout(resolve, 500));
                
                success = true;
                console.log("Force refresh successful");
            } catch (error) {
                retries++;
                console.error(`Attempt ${retries} failed:`, error);
                
                if (retries >= maxRetries) {
                    console.error("Max retries reached, giving up");
                    return false;
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, retries * 1000));
            }
        }
        
        return success;
    }, [queryClient]);

    return {
        // Queries
        notifications: notificationsQuery.data || [],
        paginatedNotifications: paginatedQuery.data || { content: [], totalElements: 0, totalPages: 0 },
        infiniteNotifications: infiniteQuery.data,
        unreadCount: unreadCountQuery.data || 0,
        statistics: statisticsQuery.data || {
            totalCount: 0,
            unreadCount: 0,
            courseNotificationsCount: 0,
            paymentNotificationsCount: 0,
            systemNotificationsCount: 0
        },
        
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
        refreshNotifications,
        checkApiConnection,
        forceRefreshWithRetry,
        
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
        
        // Raw query objects for advanced usage
        queries: {
            notificationsQuery,
            paginatedQuery,
            infiniteQuery,
            unreadCountQuery,
            statisticsQuery
        }
    };
};

export default useNotifications;