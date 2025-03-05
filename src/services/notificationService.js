import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';
import { normalizeNotificationType } from '../constants/notificationTypes';

/**
 * Service for handling notification-related API calls
 */
const NotificationService = {
  // Get all notifications (for admin)
  getAllNotifications: async () => {
    try {
      console.log('Fetching all notifications');
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.ALL);
      console.log('All notifications response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      return []; // Return empty array on error to prevent UI issues
    }
  },

  // Get all notifications with pagination (for admin)
  getAllNotificationsPaginated: async (page = 0, size = 20) => {
    try {
      console.log(`Fetching all notifications paginated: page=${page}, size=${size}`);
      const response = await api.get(
        `${ENDPOINTS.NOTIFICATIONS.ALL_PAGINATED}?page=${page}&size=${size}`
      );
      console.log('All notifications paginated response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all notifications paginated:', error);
      throw error; // Throw error for React Query to handle
    }
  },

  // Get notifications by user ID
  getNotificationsByUser: async (userId) => {
    try {
      console.log(`Fetching notifications for user: ${userId}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_USER(userId));
      console.log('User notifications response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error);
      return []; // Return empty array on error
    }
  },

  // Get notifications by user ID with pagination
  getNotificationsByUserPaginated: async (userId, page = 0, size = 10) => {
    try {
      console.log(`Fetching paginated notifications for user: ${userId}, page=${page}, size=${size}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_USER_PAGINATED(userId, page, size));
      console.log('User notifications paginated response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching paginated notifications for user ${userId}:`, error);
      return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
    }
  },

  // Get notification by ID
  getNotificationById: async (id) => {
    try {
      console.log(`Fetching notification by ID: ${id}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_ID(id));
      console.log('Notification by ID response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notification by ID ${id}:`, error);
      return null; // Return null on error
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      console.log(`Marking notification as read: ${id}`);
      const response = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id));
      console.log('Mark as read response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error; // Rethrow for mutation error handling
    }
  },

  // Mark all notifications for a user as read
  markAllAsRead: async (userId) => {
    try {
      console.log(`Marking all notifications as read for user: ${userId}`);
      const response = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ(userId));
      console.log('Mark all as read response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error marking all notifications as read for user ${userId}:`, error);
      throw error; // Rethrow for mutation error handling
    }
  },

  // Mark all notifications of a specific type for a user as read
  markAllAsReadByType: async (userId, type) => {
    try {
      const normalizedType = normalizeNotificationType(type);
      console.log(`Marking all notifications of type ${normalizedType} as read for user: ${userId}`);
      const response = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ_BY_TYPE(userId, normalizedType));
      console.log('Mark all as read by type response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error marking all notifications of type ${type} as read for user ${userId}:`, error);
      throw error; // Rethrow for mutation error handling
    }
  },

  // Delete notification
  deleteNotification: async (id) => {
    try {
      console.log(`Deleting notification: ${id}`);
      await api.delete(ENDPOINTS.NOTIFICATIONS.BY_ID(id));
      console.log('Notification deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error; // Rethrow for mutation error handling
    }
  },

  // Delete all read notifications for a user
  deleteAllRead: async (userId) => {
    try {
      console.log(`Deleting all read notifications for user: ${userId}`);
      const response = await api.delete(ENDPOINTS.NOTIFICATIONS.DELETE_ALL_READ(userId));
      console.log('Delete all read response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting all read notifications for user ${userId}:`, error);
      throw error; // Rethrow for mutation error handling
    }
  },

  // Get unread notifications for a user
  getUnreadNotifications: async (userId) => {
    try {
      console.log(`Fetching unread notifications for user: ${userId}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.UNREAD(userId));
      console.log('Unread notifications response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching unread notifications for user ${userId}:`, error);
      return []; // Return empty array on error
    }
  },

  // Get unread notifications for a user with pagination
  getUnreadNotificationsPaginated: async (userId, page = 0, size = 10) => {
    try {
      console.log(`Fetching unread paginated notifications for user: ${userId}, page=${page}, size=${size}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.UNREAD_PAGINATED(userId, page, size));
      console.log('Unread notifications paginated response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching unread paginated notifications for user ${userId}:`, error);
      return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
    }
  },

  // Count unread notifications for a user
  countUnreadNotifications: async (userId) => {
    try {
      console.log(`Counting unread notifications for user: ${userId}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.COUNT_UNREAD(userId));
      console.log('Count unread response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error counting unread notifications for user ${userId}:`, error);
      return 0; // Return 0 on error
    }
  },

  // Get recent notifications for a user
  getRecentNotifications: async (userId) => {
    try {
      console.log(`Fetching recent notifications for user: ${userId}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.RECENT(userId));
      console.log('Recent notifications response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recent notifications for user ${userId}:`, error);
      return []; // Return empty array on error
    }
  },

  // Get recent notifications for a user with pagination
  getRecentNotificationsPaginated: async (userId, page = 0, size = 10) => {
    try {
      console.log(`Fetching recent paginated notifications for user: ${userId}, page=${page}, size=${size}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.RECENT_PAGINATED(userId, page, size));
      console.log('Recent notifications paginated response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recent paginated notifications for user ${userId}:`, error);
      return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
    }
  },

  // Get notifications by type
  getNotificationsByType: async (type) => {
    try {
      const normalizedType = normalizeNotificationType(type);
      console.log(`Fetching notifications of type: ${normalizedType}`);
      const response = await api.get(`${ENDPOINTS.NOTIFICATIONS.BASE}/type/${normalizedType}`);
      console.log('Notifications by type response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notifications of type ${type}:`, error);
      return []; // Return empty array on error
    }
  },

  // Get notifications by type with pagination
  getNotificationsByTypePaginated: async (type, page = 0, size = 10) => {
    try {
      const normalizedType = normalizeNotificationType(type);
      console.log(`Fetching paginated notifications of type: ${normalizedType}, page=${page}, size=${size}`);
      const response = await api.get(`${ENDPOINTS.NOTIFICATIONS.BASE}/type/${normalizedType}/paginated?page=${page}&size=${size}`);
      console.log('Notifications by type paginated response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching paginated notifications of type ${type}:`, error);
      return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
    }
  },

  // Get notifications by user and type
  getNotificationsByUserAndType: async (userId, type) => {
    try {
      const normalizedType = normalizeNotificationType(type);
      console.log(`Fetching notifications for user ${userId} of type: ${normalizedType}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_TYPE(userId, normalizedType));
      console.log('Notifications by user and type response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId} of type ${type}:`, error);
      return []; // Return empty array on error
    }
  },

  // Get notifications by user and type with pagination
  // Get notifications by user and type with pagination
getNotificationsByUserAndTypePaginated: async (userId, type, page = 0, size = 10) => {
  try {
    const normalizedType = normalizeNotificationType(type);
    console.log(`Fetching paginated notifications for user ${userId} of type: ${normalizedType} (original: ${type}), page=${page}, size=${size}`);
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_TYPE_PAGINATED(userId, normalizedType, page, size));
    console.log('Notifications by user and type paginated response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching paginated notifications for user ${userId} of type ${type}:`, error);
    return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
  }
},

  // Get notifications by course
  getNotificationsByCourse: async (courseId) => {
    try {
      console.log(`Fetching notifications for course: ${courseId}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_COURSE(courseId));
      console.log('Notifications by course response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notifications for course ${courseId}:`, error);
      return []; // Return empty array on error
    }
  },

  // Get notifications by course with pagination
  getNotificationsByCoursePaginated: async (courseId, page = 0, size = 10) => {
    try {
      console.log(`Fetching paginated notifications for course: ${courseId}, page=${page}, size=${size}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_COURSE_PAGINATED(courseId, page, size));
      console.log('Notifications by course paginated response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching paginated notifications for course ${courseId}:`, error);
      return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
    }
  },

  // Get notifications by payment
  getNotificationsByPayment: async (paymentId) => {
    try {
      console.log(`Fetching notifications for payment: ${paymentId}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_PAYMENT(paymentId));
      console.log('Notifications by payment response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notifications for payment ${paymentId}:`, error);
      return []; // Return empty array on error
    }
  },

  // Search notifications by content
  searchNotifications: async (userId, searchTerm) => {
    try {
      console.log(`Searching notifications for user ${userId} with term: ${searchTerm}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.SEARCH(userId, searchTerm));
      console.log('Search notifications response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error searching notifications for user ${userId} with term ${searchTerm}:`, error);
      return []; // Return empty array on error
    }
  },

  // Search notifications by content with pagination
  searchNotificationsPaginated: async (userId, searchTerm, page = 0, size = 10) => {
    try {
      console.log(`Searching paginated notifications for user ${userId} with term: ${searchTerm}, page=${page}, size=${size}`);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.SEARCH_PAGINATED(userId, searchTerm, page, size));
      console.log('Search notifications paginated response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error searching paginated notifications for user ${userId} with term ${searchTerm}:`, error);
      return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
    }
  },

  // Get notifications by date range
  // Get notifications by date range
getNotificationsByDateRange: async (userId, startDate, endDate) => {
  try {
    console.log(`Fetching notifications for user ${userId} in date range: ${startDate} to ${endDate}`);
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_DATE_RANGE(userId, startDate, endDate));
    console.log('Notifications by date range response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notifications for user ${userId} in date range:`, error);
    return []; // Return empty array on error
  }
},

// Get notification statistics
getNotificationStatistics: async (userId) => {
  try {
    console.log(`Fetching notification statistics for user: ${userId}`);
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.STATISTICS(userId));
    console.log('Notification statistics response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notification statistics for user ${userId}:`, error);
    // Return default values to prevent UI issues
    return {
      totalCount: 0,
      unreadCount: 0,
      courseNotificationsCount: 0,
      paymentNotificationsCount: 0,
      systemNotificationsCount: 0
    };
  }
},

// Update notification content
updateNotificationContent: async (id, content) => {
  try {
    console.log(`Updating content for notification ${id}: ${content}`);
    const response = await api.put(`${ENDPOINTS.NOTIFICATIONS.UPDATE_CONTENT(id)}?content=${encodeURIComponent(content)}`);
    console.log('Update notification content response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating content for notification ${id}:`, error);
    throw error; // Rethrow for mutation error handling
  }
},

// Send notification
sendNotification: async (userId, content, type, courseId = null, paymentId = null) => {
  try {
    const normalizedType = normalizeNotificationType(type);
    console.log(`Sending notification to user ${userId} of type ${normalizedType}: ${content}`);
    
    const params = new URLSearchParams();
    params.append('userId', userId);
    params.append('content', content);
    params.append('type', normalizedType);
    if (courseId) params.append('courseId', courseId);
    if (paymentId) params.append('paymentId', paymentId);
    
    const response = await api.post(`${ENDPOINTS.NOTIFICATIONS.SEND}?${params.toString()}`);
    console.log('Send notification response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error sending notification to user ${userId}:`, error);
    throw error; // Rethrow for mutation error handling
  }
},

// Send notification to multiple users
sendNotificationToMultipleUsers: async (userIds, content, type, courseId = null, paymentId = null) => {
  try {
    const normalizedType = normalizeNotificationType(type);
    console.log(`Sending notification to multiple users of type ${normalizedType}: ${content}`);
    
    const params = new URLSearchParams();
    userIds.forEach(id => params.append('userIds', id));
    params.append('content', content);
    params.append('type', normalizedType);
    if (courseId) params.append('courseId', courseId);
    if (paymentId) params.append('paymentId', paymentId);
    
    const response = await api.post(`${ENDPOINTS.NOTIFICATIONS.SEND_MULTIPLE}?${params.toString()}`);
    console.log('Send notification to multiple users response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending notification to multiple users:', error);
    throw error; // Rethrow for mutation error handling
  }
},

// Send notification to all users
sendNotificationToAllUsers: async (content, type) => {
  try {
    const normalizedType = normalizeNotificationType(type);
    console.log(`Sending notification to all users of type ${normalizedType}: ${content}`);
    
    const params = new URLSearchParams();
    params.append('content', content);
    params.append('type', normalizedType);
    
    const response = await api.post(`${ENDPOINTS.NOTIFICATIONS.SEND_ALL}?${params.toString()}`);
    console.log('Send notification to all users response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending notification to all users:', error);
    throw error; // Rethrow for mutation error handling
  }
},

// Schedule notification
scheduleNotification: async (userId, content, type, scheduledTime, courseId = null, paymentId = null) => {
  try {
    const normalizedType = normalizeNotificationType(type);
    console.log(`Scheduling notification for user ${userId} of type ${normalizedType} at ${scheduledTime}: ${content}`);
    
    const params = new URLSearchParams();
    params.append('userId', userId);
    params.append('content', content);
    params.append('type', normalizedType);
    params.append('scheduledTime', scheduledTime.toISOString());
    if (courseId) params.append('courseId', courseId);
    if (paymentId) params.append('paymentId', paymentId);
    
    const response = await api.post(`${ENDPOINTS.NOTIFICATIONS.SCHEDULE}?${params.toString()}`);
    console.log('Schedule notification response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error scheduling notification for user ${userId}:`, error);
    throw error; // Rethrow for mutation error handling
  }
},

// Schedule notification for multiple users
scheduleNotificationForMultipleUsers: async (userIds, content, type, scheduledTime, courseId = null, paymentId = null) => {
  try {
    const normalizedType = normalizeNotificationType(type);
    console.log(`Scheduling notification for multiple users of type ${normalizedType} at ${scheduledTime}: ${content}`);
    
    const params = new URLSearchParams();
    userIds.forEach(id => params.append('userIds', id));
    params.append('content', content);
    params.append('type', normalizedType);
    params.append('scheduledTime', scheduledTime.toISOString());
    if (courseId) params.append('courseId', courseId);
    if (paymentId) params.append('paymentId', paymentId);
    
    const response = await api.post(`${ENDPOINTS.NOTIFICATIONS.SCHEDULE_MULTIPLE}?${params.toString()}`);
    console.log('Schedule notification for multiple users response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error scheduling notification for multiple users:', error);
    throw error; // Rethrow for mutation error handling
  }
},

// Cancel scheduled notification
cancelScheduledNotification: async (id) => {
  try {
    console.log(`Canceling scheduled notification: ${id}`);
    const response = await api.delete(ENDPOINTS.NOTIFICATIONS.CANCEL_SCHEDULED(id));
    console.log('Cancel scheduled notification response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error canceling scheduled notification ${id}:`, error);
    throw error; // Rethrow for mutation error handling
  }
},

// Get all scheduled notifications
getScheduledNotifications: async (userId) => {
  try {
    console.log(`Fetching scheduled notifications for user: ${userId}`);
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.SCHEDULED(userId));
    console.log('Scheduled notifications response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching scheduled notifications for user ${userId}:`, error);
    return []; // Return empty array on error
  }
},

// Get all scheduled notifications with pagination
getScheduledNotificationsPaginated: async (userId, page = 0, size = 10) => {
  try {
    console.log(`Fetching paginated scheduled notifications for user: ${userId}, page=${page}, size=${size}`);
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.SCHEDULED_PAGINATED(userId, page, size));
    console.log('Scheduled notifications paginated response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching paginated scheduled notifications for user ${userId}:`, error);
    return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
  }
},

// Get notification preferences for a user
getNotificationPreferences: async (userId) => {
  try {
    console.log(`Fetching notification preferences for user: ${userId}`);
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.PREFERENCES(userId));
    console.log('Notification preferences response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notification preferences for user ${userId}:`, error);
    // Return default preferences to prevent UI issues
    return {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      courseNotifications: true,
      paymentNotifications: true,
      systemNotifications: true
    };
  }
},

// Update notification preferences for a user
updateNotificationPreferences: async (userId, preferences) => {
  try {
    console.log(`Updating notification preferences for user: ${userId}`, preferences);
    const response = await api.put(ENDPOINTS.NOTIFICATIONS.UPDATE_PREFERENCES(userId), preferences);
    console.log('Update notification preferences response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating notification preferences for user ${userId}:`, error);
    throw error; // Rethrow for mutation error handling
  }
},

// Export notifications to CSV
exportNotificationsToCSV: async (userId) => {
  try {
    console.log(`Exporting notifications to CSV for user: ${userId}`);
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.EXPORT_CSV(userId), {
      responseType: 'blob'
    });
    console.log('Export notifications to CSV response received');
    return response.data;
  } catch (error) {
    console.error(`Error exporting notifications to CSV for user ${userId}:`, error);
    throw error; // Rethrow for handling in UI
  }
},

// Get notification categories
getNotificationCategories: async () => {
  try {
    console.log('Fetching notification categories');
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.CATEGORIES);
    console.log('Notification categories response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching notification categories:', error);
    return []; // Return empty array on error
  }
},

// Subscribe to notification category
subscribeToCategory: async (userId, categoryId) => {
  try {
    console.log(`Subscribing user ${userId} to notification category: ${categoryId}`);
    const response = await api.post(ENDPOINTS.NOTIFICATIONS.SUBSCRIBE_CATEGORY(userId, categoryId));
    console.log('Subscribe to category response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error subscribing user ${userId} to notification category ${categoryId}:`, error);
    throw error; // Rethrow for mutation error handling
  }
},

// Unsubscribe from notification category
unsubscribeFromCategory: async (userId, categoryId) => {
  try {
    console.log(`Unsubscribing user ${userId} from notification category: ${categoryId}`);
    const response = await api.post(ENDPOINTS.NOTIFICATIONS.UNSUBSCRIBE_CATEGORY(userId, categoryId));
    console.log('Unsubscribe from category response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error unsubscribing user ${userId} from notification category ${categoryId}:`, error);
    throw error; // Rethrow for mutation error handling
  }
},

// Get user category subscriptions
getUserCategorySubscriptions: async (userId) => {
  try {
    console.log(`Fetching category subscriptions for user: ${userId}`);
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.USER_SUBSCRIPTIONS(userId));
    console.log('User category subscriptions response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category subscriptions for user ${userId}:`, error);
    return []; // Return empty array on error
  }
},

// Batch update notification status
batchUpdateStatus: async (notificationIds, status) => {
  try {
    console.log(`Batch updating notifications with status: ${status}`, notificationIds);
    const response = await api.put(ENDPOINTS.NOTIFICATIONS.BATCH_UPDATE_STATUS, {
      notificationIds,
      status
    });
    console.log('Batch update status response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error batch updating notification status:', error);
    throw error; // Rethrow for mutation error handling
  }
},
// Add this method to NotificationService
getNotificationsByDateRangePaginated: async (userId, startDate, endDate, page = 0, size = 10) => {
  try {
    console.log(`Fetching paginated notifications for user ${userId} in date range: ${startDate} to ${endDate}, page=${page}, size=${size}`);
    const response = await api.get(
      `${ENDPOINTS.NOTIFICATIONS.BASE}/user/${userId}/date-range/paginated?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`
    );
    console.log('Notifications by date range paginated response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching paginated notifications for user ${userId} in date range:`, error);
    return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
  }
},
searchAllNotificationsPaginated: async (searchTerm, page = 0, size = 10) => {
  try {
    console.log(`Searching all notifications for: "${searchTerm}", page=${page}, size=${size}`);
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.SEARCH_ALL_PAGINATED(searchTerm, page, size));
    console.log('Search all notifications paginated response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error searching all notifications:`, error);
    return { content: [], totalElements: 0, totalPages: 0 };
  }
},
// Get notification activity log
getNotificationActivityLog: async (userId, page = 0, size = 20) => {
  try {
    console.log(`Fetching notification activity log for user: ${userId}, page=${page}, size=${size}`);
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.ACTIVITY_LOG(userId, page, size));
    console.log('Notification activity log response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notification activity log for user ${userId}:`, error);
    return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
  }
}};
export default  NotificationService;