// src/services/notificationService.js
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const NotificationService = {
    // Basic CRUD operations
    fetchNotifications: async (userId) => {
        if (!userId) {
            throw new Error('User ID is required to fetch notifications');
        }
        console.log("Fetching notifications for userId:", userId);
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_USER(userId));
        return response.data;
    },

    fetchNotificationsPaginated: async (userId, page = 0, size = 10) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_USER_PAGINATED(userId, page, size));
        return response.data;
    },

    fetchNotificationById: async (id) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_ID(id));
        return response.data;
    },

    createNotification: async (notificationData) => {
        const response = await api.post(ENDPOINTS.NOTIFICATIONS.BASE, notificationData);
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id));
        return response.data;
    },

    markAllAsRead: async (userId) => {
        const response = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ(userId));
        return response.data;
    },

    markAllAsReadByType: async (userId, type) => {
        const response = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ_BY_TYPE(userId, type));
        return response.data;
    },

    deleteNotification: async (id) => {
        await api.delete(ENDPOINTS.NOTIFICATIONS.BY_ID(id));
    },

    deleteAllRead: async (userId) => {
        const response = await api.delete(ENDPOINTS.NOTIFICATIONS.DELETE_ALL_READ(userId));
        return response.data;
    },

    // Specialized fetching operations
    fetchUnreadNotifications: async (userId) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.UNREAD(userId));
        return response.data;
    },

    fetchUnreadNotificationsPaginated: async (userId, page = 0, size = 10) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.UNREAD_PAGINATED(userId, page, size));
        return response.data;
    },

    countUnreadNotifications: async (userId) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.COUNT_UNREAD(userId));
        return response.data;
    },

    fetchRecentNotifications: async (userId) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.RECENT(userId));
        return response.data;
    },

    fetchRecentNotificationsPaginated: async (userId, page = 0, size = 10) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.RECENT_PAGINATED(userId, page, size));
        return response.data;
    },

    fetchNotificationsByType: async (userId, type) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_TYPE(userId, type));
        return response.data;
    },

    fetchNotificationsByTypePaginated: async (userId, type, page = 0, size = 10) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_TYPE_PAGINATED(userId, type, page, size));
        return response.data;
    },

    fetchNotificationsByCourse: async (courseId) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_COURSE(courseId));
        return response.data;
    },

    fetchNotificationsByCoursePaginated: async (courseId, page = 0, size = 10) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_COURSE_PAGINATED(courseId, page, size));
        return response.data;
    },

    fetchNotificationsByPayment: async (paymentId) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_PAYMENT(paymentId));
        return response.data;
    },

    searchNotifications: async (userId, searchTerm) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.SEARCH(userId, searchTerm));
        return response.data;
    },

    searchNotificationsPaginated: async (userId, searchTerm, page = 0, size = 10) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.SEARCH_PAGINATED(userId, searchTerm, page, size));
        return response.data;
    },

    fetchNotificationsByDateRange: async (userId, startDate, endDate) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_DATE_RANGE(userId, startDate, endDate));
        return response.data;
    },

    getNotificationStatistics: async (userId) => {
        const response = await api.get(ENDPOINTS.NOTIFICATIONS.STATISTICS(userId));
        return response.data;
    },

    // Sending notifications
    sendNotification: async (userId, content, type, courseId = null, paymentId = null) => {
        const params = new URLSearchParams();
        params.append('userId', userId);
        params.append('content', content);
        params.append('type', type);
        if (courseId) params.append('courseId', courseId);
        if (paymentId) params.append('paymentId', paymentId);
        
        const response = await api.post(`${ENDPOINTS.NOTIFICATIONS.SEND}?${params.toString()}`);
        return response.data;
    },

    sendNotificationToMultipleUsers: async (userIds, content, type, courseId = null, paymentId = null) => {
        const params = new URLSearchParams();
        userIds.forEach(id => params.append('userIds', id));
        params.append('content', content);
        params.append('type', type);
        if (courseId) params.append('courseId', courseId);
        if (paymentId) params.append('paymentId', paymentId);
        
        const response = await api.post(`${ENDPOINTS.NOTIFICATIONS.SEND_MULTIPLE}?${params.toString()}`);
        return response.data;
    },

    sendNotificationToAllUsers: async (content, type) => {
        const params = new URLSearchParams();
        params.append('content', content);
        params.append('type', type);
        
        const response = await api.post(`${ENDPOINTS.NOTIFICATIONS.SEND_ALL}?${params.toString()}`);
        return response.data;
    },

    sendNotificationToCourseEnrollees: async (courseId, content, type) => {
        const params = new URLSearchParams();
        params.append('courseId', courseId);
        params.append('content', content);
        params.append('type', type);
        
        const response = await api.post(`${ENDPOINTS.NOTIFICATIONS.SEND_COURSE_ENROLLEES}?${params.toString()}`);
        return response.data;
    },

    scheduleNotification: async (userId, content, type, scheduledTime, courseId = null, paymentId = null) => {
        const params = new URLSearchParams();
        params.append('userId', userId);
        params.append('content', content);
        params.append('type', type);
        params.append('scheduledTime', scheduledTime.toISOString());
        if (courseId) params.append('courseId', courseId);
        if (paymentId) params.append('paymentId', paymentId);
        
        const response = await api.post(`${ENDPOINTS.NOTIFICATIONS.SCHEDULE}?${params.toString()}`);
        return response.data;
    },

    updateNotificationContent: async (id, content) => {
        const params = new URLSearchParams();
        params.append('content', content);
        
        const response = await api.put(`${ENDPOINTS.NOTIFICATIONS.UPDATE_CONTENT(id)}?${params.toString()}`);
        return response.data;
    }
};

export default NotificationService;