import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';
import { normalizeNotificationType } from '../constants/notificationTypes';

const NotificationService = {
    // Phương thức để lấy tất cả notifications (dành cho admin)
  getAllNotifications: async () => {
    try {
      console.log("Starting getAllNotifications request");
      console.log("Using endpoint:", ENDPOINTS.NOTIFICATIONS.ALL);
      
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const url = `${ENDPOINTS.NOTIFICATIONS.ALL}?_t=${timestamp}`;
      console.log("Using URL with cache buster:", url);
      
      const response = await api.get(url);
      
      console.log("getAllNotifications response status:", response.status);
      console.log("getAllNotifications response data:", response.data);
      
      return response.data;
    } catch (error) {
      console.error("Error in getAllNotifications:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        console.error("Headers:", error.response.headers);
      }
      
      return []; // Return empty array on error to prevent UI issues
    }
  },
  fetchNotifications: async (userId) => {
    try {
      if (!userId) {
        console.warn("fetchNotifications called without userId");
        return [];
      }
      console.log("Fetching notifications for userId:", userId);
      const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_USER(userId));
      console.log("Notifications response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error.response?.data || error.message);
      console.error("Full error:", error);
      return []; // Return empty array on error to prevent UI issues
    }
  },
  // Phương thức để lấy tất cả notifications với phân trang (dành cho admin)
  getAllNotificationsPaginated: async (page = 0, size = 10) => {
    try {
      console.log("Starting getAllNotificationsPaginated request with page:", page, "size:", size);
      
      // Sửa lại URL endpoint - đây là vấn đề chính
      // Thay vì dùng /all/paginated, chúng ta cần sử dụng đúng endpoint từ backend
      const timestamp = new Date().getTime();
      const url = `${ENDPOINTS.NOTIFICATIONS.ALL_PAGINATED}?page=${page}&size=${size}&_t=${timestamp}`;
      console.log("Using URL with cache buster:", url);
      
      const response = await api.get(url);
      
      console.log("getAllNotificationsPaginated response status:", response.status);
      console.log("getAllNotificationsPaginated response data:", response.data);
      
      // Kiểm tra cấu trúc dữ liệu trả về
      if (!response.data.content && Array.isArray(response.data)) {
        // Nếu backend trả về mảng thay vì đối tượng phân trang, chuyển đổi nó
        console.log("Converting array response to paginated format");
        return {
          content: response.data,
          totalElements: response.data.length,
          totalPages: 1,
          number: 0,
          size: response.data.length
        };
      }
      
      return response.data;
    } catch (error) {
      console.error("Error in getAllNotificationsPaginated:", error);
      
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        console.error("Headers:", error.response.headers);
      }
      
      // Return empty page object on error to prevent UI issues
      return { content: [], totalElements: 0, totalPages: 0, number: 0, size };
    }
  },

    fetchNotificationsPaginated: async (userId, page = 0, size = 10) => {
        try {
            if (!userId) {
                console.warn("fetchNotificationsPaginated called without userId");
                return { content: [], totalElements: 0, totalPages: 0 };
            }
            console.log(`Fetching paginated notifications for userId: ${userId}, page: ${page}, size: ${size}`);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_USER_PAGINATED(userId, page, size));
            console.log("Paginated notifications response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching paginated notifications:", error.response?.data || error.message);
            return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
        }
    },

    fetchNotificationById: async (id) => {
        try {
            if (!id) {
                console.warn("fetchNotificationById called without id");
                return null;
            }
            console.log("Fetching notification by id:", id);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_ID(id));
            console.log("Notification by id response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching notification by id:", error.response?.data || error.message);
            return null; // Return null on error
        }
    },

    createNotification: async (notificationData) => {
        try {
            // Normalize the notification type if present
            if (notificationData.type) {
                notificationData.type = normalizeNotificationType(notificationData.type);
            }
            
            console.log("Creating notification with data:", notificationData);
            const response = await api.post(ENDPOINTS.NOTIFICATIONS.BASE, notificationData);
            console.log("Create notification response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creating notification:", error.response?.data || error.message);
            throw error; // Rethrow for mutation error handling
        }
    },

    markAsRead: async (id) => {
        try {
            if (!id) {
                console.warn("markAsRead called without id");
                return null;
            }
            console.log("Marking notification as read, id:", id);
            const response = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id));
            console.log("Mark as read response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error marking notification as read:", error.response?.data || error.message);
            throw error; // Rethrow for mutation error handling
        }
    },

    markAllAsRead: async (userId) => {
        try {
            if (!userId) {
                console.warn("markAllAsRead called without userId");
                return null;
            }
            console.log("Marking all notifications as read for userId:", userId);
            const response = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ(userId));
            console.log("Mark all as read response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error marking all notifications as read:", error.response?.data || error.message);
            throw error; // Rethrow for mutation error handling
        }
    },

    markAllAsReadByType: async (userId, type) => {
        try {
            if (!userId || !type) {
                console.warn("markAllAsReadByType called without userId or type");
                return null;
            }
            
            // Normalize the notification type
            const normalizedType = normalizeNotificationType(type);
            
            console.log("Marking all notifications as read by type for userId:", userId, "type:", normalizedType);
            const response = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ_BY_TYPE(userId, normalizedType));
            console.log("Mark all as read by type response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error marking all notifications as read by type:", error.response?.data || error.message);
            throw error; // Rethrow for mutation error handling
        }
    },

    deleteNotification: async (id) => {
        try {
            if (!id) {
                console.warn("deleteNotification called without id");
                return;
            }
            console.log("Deleting notification, id:", id);
            await api.delete(ENDPOINTS.NOTIFICATIONS.BY_ID(id));
            console.log("Notification deleted successfully");
        } catch (error) {
            console.error("Error deleting notification:", error.response?.data || error.message);
            throw error; // Rethrow for mutation error handling
        }
    },

    deleteAllRead: async (userId) => {
        try {
            if (!userId) {
                console.warn("deleteAllRead called without userId");
                return null;
            }
            console.log("Deleting all read notifications for userId:", userId);
            const response = await api.delete(ENDPOINTS.NOTIFICATIONS.DELETE_ALL_READ(userId));
            console.log("Delete all read response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error deleting all read notifications:", error.response?.data || error.message);
            throw error; // Rethrow for mutation error handling
        }
    },

    // Specialized fetching operations
    fetchUnreadNotifications: async (userId) => {
        try {
            if (!userId) {
                console.warn("fetchUnreadNotifications called without userId");
                return [];
            }
            console.log("Fetching unread notifications for userId:", userId);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.UNREAD(userId));
            console.log("Unread notifications response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching unread notifications:", error.response?.data || error.message);
            return []; // Return empty array on error
        }
    },

    fetchUnreadNotificationsPaginated: async (userId, page = 0, size = 10) => {
        try {
            if (!userId) {
                console.warn("fetchUnreadNotificationsPaginated called without userId");
                return { content: [], totalElements: 0, totalPages: 0 };
            }
            console.log(`Fetching unread paginated notifications for userId: ${userId}, page: ${page}, size: ${size}`);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.UNREAD_PAGINATED(userId, page, size));
            console.log("Unread paginated notifications response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching unread paginated notifications:", error.response?.data || error.message);
            return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
        }
    },

    countUnreadNotifications: async (userId) => {
        try {
            if (!userId) {
                console.warn("countUnreadNotifications called without userId");
                return 0;
            }
            console.log("Counting unread notifications for userId:", userId);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.COUNT_UNREAD(userId));
            console.log("Count unread response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error counting unread notifications:", error.response?.data || error.message);
            return 0; // Return 0 on error to prevent UI issues
        }
    },

    fetchRecentNotifications: async (userId) => {
        try {
            if (!userId) {
                console.warn("fetchRecentNotifications called without userId");
                return [];
            }
            console.log("Fetching recent notifications for userId:", userId);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.RECENT(userId));
            console.log("Recent notifications response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching recent notifications:", error.response?.data || error.message);
            return []; // Return empty array on error
        }
    },

    fetchRecentNotificationsPaginated: async (userId, page = 0, size = 10) => {
        try {
            if (!userId) {
                console.warn("fetchRecentNotificationsPaginated called without userId");
                return { content: [], totalElements: 0, totalPages: 0 };
            }
            console.log(`Fetching recent paginated notifications for userId: ${userId}, page: ${page}, size: ${size}`);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.RECENT_PAGINATED(userId, page, size));
            console.log("Recent paginated notifications response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching recent paginated notifications:", error.response?.data || error.message);
            return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
        }
    },

    fetchNotificationsByType: async (userId, type) => {
        try {
            if (!userId || !type) {
                console.warn("fetchNotificationsByType called without userId or type");
                return [];
            }
            
            // Normalize the notification type
            const normalizedType = normalizeNotificationType(type);
            
            console.log("Fetching notifications by type for userId:", userId, "type:", normalizedType);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_TYPE(userId, normalizedType));
            console.log("Notifications by type response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching notifications by type:", error.response?.data || error.message);
            return []; // Return empty array on error
        }
    },

    fetchNotificationsByTypePaginated: async (userId, type, page = 0, size = 10) => {
        try {
            if (!userId || !type) {
                console.warn("fetchNotificationsByTypePaginated called without userId or type");
                return { content: [], totalElements: 0, totalPages: 0 };
            }
            
            // Normalize the notification type
            const normalizedType = normalizeNotificationType(type);
            
            console.log(`Fetching notifications by type paginated for userId: ${userId}, type: ${normalizedType}, page: ${page}, size: ${size}`);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_TYPE_PAGINATED(userId, normalizedType, page, size));
            console.log("Notifications by type paginated response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching notifications by type paginated:", error.response?.data || error.message);
            return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
        }
    },

    fetchNotificationsByCourse: async (courseId) => {
        try {
            if (!courseId) {
                console.warn("fetchNotificationsByCourse called without courseId");
                return [];
            }
            console.log("Fetching notifications by course, courseId:", courseId);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_COURSE(courseId));
            console.log("Notifications by course response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching notifications by course:", error.response?.data || error.message);
            return []; // Return empty array on error
        }
    },

    fetchNotificationsByCoursePaginated: async (courseId, page = 0, size = 10) => {
        try {
            if (!courseId) {
                console.warn("fetchNotificationsByCoursePaginated called without courseId");
                return { content: [], totalElements: 0, totalPages: 0 };
            }
            console.log(`Fetching notifications by course paginated, courseId: ${courseId}, page: ${page}, size: ${size}`);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_COURSE_PAGINATED(courseId, page, size));
            console.log("Notifications by course paginated response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching notifications by course paginated:", error.response?.data || error.message);
            return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
        }
    },

    fetchNotificationsByPayment: async (paymentId) => {
        try {
            if (!paymentId) {
                console.warn("fetchNotificationsByPayment called without paymentId");
                return [];
            }
            console.log("Fetching notifications by payment, paymentId:", paymentId);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_PAYMENT(paymentId));
            console.log("Notifications by payment response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching notifications by payment:", error.response?.data || error.message);
            return []; // Return empty array on error
        }
    },

    searchNotifications: async (userId, searchTerm) => {
        try {
            if (!userId || !searchTerm) {
                console.warn("searchNotifications called without userId or searchTerm");
                return [];
            }
            console.log("Searching notifications for userId:", userId, "searchTerm:", searchTerm);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.SEARCH(userId, searchTerm));
            console.log("Search notifications response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error searching notifications:", error.response?.data || error.message);
            return []; // Return empty array on error
        }
    },

    searchNotificationsPaginated: async (userId, searchTerm, page = 0, size = 10) => {
        try {
            if (!userId || !searchTerm) {
                console.warn("searchNotificationsPaginated called without userId or searchTerm");
                return { content: [], totalElements: 0, totalPages: 0 };
            }
            console.log(`Searching notifications paginated for userId: ${userId}, searchTerm: ${searchTerm}, page: ${page}, size: ${size}`);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.SEARCH_PAGINATED(userId, searchTerm, page, size));
            console.log("Search notifications paginated response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error searching notifications paginated:", error.response?.data || error.message);
            return { content: [], totalElements: 0, totalPages: 0 }; // Return empty page on error
        }
    },

    fetchNotificationsByDateRange: async (userId, startDate, endDate) => {
        try {
            if (!userId || !startDate || !endDate) {
                console.warn("fetchNotificationsByDateRange called without userId, startDate, or endDate");
                return [];
            }
            console.log(`Fetching notifications by date range for userId: ${userId}, startDate: ${startDate}, endDate: ${endDate}`);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_DATE_RANGE(userId, startDate, endDate));
            console.log("Notifications by date range response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching notifications by date range:", error.response?.data || error.message);
            return []; // Return empty array on error
        }
    },

    getNotificationStatistics: async (userId) => {
        try {
            if (!userId) {
                console.warn("getNotificationStatistics called without userId");
                return {
                    totalCount: 0,
                    unreadCount: 0,
                    courseNotificationsCount: 0,
                    paymentNotificationsCount: 0,
                    systemNotificationsCount: 0
                };
            }
            console.log("Getting notification statistics for userId:", userId);
            const response = await api.get(ENDPOINTS.NOTIFICATIONS.STATISTICS(userId));
            console.log("Notification statistics response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error getting notification statistics:", error.response?.data || error.message);
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

    // Sending notifications
    sendNotification: async (userId, content, type, courseId = null, paymentId = null) => {
        try {
            if (!userId || !content || !type) {
                console.warn("sendNotification called with missing parameters", { userId, content, type });
                throw new Error("Missing required parameters");
            }
            
            // Normalize the notification type
            const normalizedType = normalizeNotificationType(type);
            
            console.log("Sending notification to userId:", userId, "content:", content, "type:", normalizedType);
            
            const params = new URLSearchParams();
            params.append('userId', userId);
            params.append('content', content);
            params.append('type', normalizedType);
            if (courseId) params.append('courseId', courseId);
            if (paymentId) params.append('paymentId', paymentId);
        
            const url = `${ENDPOINTS.NOTIFICATIONS.SEND}?${params.toString()}`;
            console.log("Notification request URL:", url);
        
            const response = await api.post(url);
            console.log("Notification response:", response.data);
            
            // Thêm timeout để đảm bảo dữ liệu được lưu vào DB trước khi fetch lại
            await new Promise(resolve => setTimeout(resolve, 500));
            
            return response.data;
        } catch (error) {
            console.error("Error sending notification:", error.response?.data || error.message);
            throw error; // Rethrow for mutation error handling
        }
    },

    sendNotificationToMultipleUsers: async (userIds, content, type, courseId = null, paymentId = null) => {
        try {
            if (!userIds || !userIds.length || !content || !type) {
                console.warn("sendNotificationToMultipleUsers called with missing parameters", { userIds, content, type });
                throw new Error("Missing required parameters");
            }
            
            // Normalize the notification type
            const normalizedType = normalizeNotificationType(type);
            
            console.log("Sending notification to multiple users:", userIds, "content:", content, "type:", normalizedType);
            
            const params = new URLSearchParams();
            userIds.forEach(id => params.append('userIds', id));
            params.append('content', content);
            params.append('type', normalizedType);
            if (courseId) params.append('courseId', courseId);
            if (paymentId) params.append('paymentId', paymentId);
            
            const url = `${ENDPOINTS.NOTIFICATIONS.SEND_MULTIPLE}?${params.toString()}`;
            console.log("Multiple notification request URL:", url);
            
            const response = await api.post(url);
            console.log("Multiple notification response:", response.data);
            
            // Thêm timeout để đảm bảo dữ liệu được lưu vào DB trước khi fetch lại
            await new Promise(resolve => setTimeout(resolve, 500));
            
            return response.data;
        } catch (error) {
            console.error("Error sending notifications to multiple users:", error.response?.data || error.message);
            throw error; // Rethrow for mutation error handling
        }
    },

    sendNotificationToAllUsers: async (content, type) => {
        try {
            if (!content || !type) {
                console.warn("sendNotificationToAllUsers called with missing parameters", { content, type });
                throw new Error("Missing required parameters");
            }
            
            // Normalize the notification type
            const normalizedType = normalizeNotificationType(type);
            
            console.log("Sending notification to all users:", "content:", content, "type:", normalizedType);
            
            const params = new URLSearchParams();
            params.append('content', content);
            params.append('type', normalizedType);
            
            const url = `${ENDPOINTS.NOTIFICATIONS.SEND_ALL}?${params.toString()}`;
            console.log("Send to all users request URL:", url);
            
            const response = await api.post(url);
            console.log("Send to all users response:", response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error sending notification to all users:", error.response?.data || error.message);
            throw error; // Rethrow for mutation error handling
        }
    },

    sendNotificationToCourseEnrollees: async (courseId, content, type) => {
        try {
            if (!courseId || !content || !type) {
                console.warn("sendNotificationToCourseEnrollees called with missing parameters", { courseId, content, type });
                throw new Error("Missing required parameters");
            }
            
            // Normalize the notification type
            const normalizedType = normalizeNotificationType(type);
            
            console.log("Sending notification to course enrollees:", "courseId:", courseId, "content:", content, "type:", normalizedType);
            
            const params = new URLSearchParams();
            params.append('courseId', courseId);
            params.append('content', content);
            params.append('type', normalizedType);
            
            const url = `${ENDPOINTS.NOTIFICATIONS.SEND_COURSE_ENROLLEES}?${params.toString()}`;
            console.log("Send to course enrollees request URL:", url);
            
            const response = await api.post(url);
            console.log("Send to course enrollees response:", response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error sending notification to course enrollees:", error.response?.data || error.message);
            throw error; // Rethrow for mutation error handling
        }
    },
    
    scheduleNotification: async (userId, content, type, scheduledTime, courseId = null, paymentId = null) => {
        try {
            if (!userId || !content || !type || !scheduledTime) {
                console.warn("scheduleNotification called with missing parameters", { userId, content, type, scheduledTime });
                throw new Error("Missing required parameters");
            }
            
            // Normalize the notification type
            const normalizedType = normalizeNotificationType(type);
            
            console.log("Scheduling notification:", "userId:", userId, "content:", content, "type:", normalizedType, "scheduledTime:", scheduledTime);
            
            const params = new URLSearchParams();
            params.append('userId', userId);
            params.append('content', content);
            params.append('type', normalizedType);
            params.append('scheduledTime', scheduledTime.toISOString());
            if (courseId) params.append('courseId', courseId);
            if (paymentId) params.append('paymentId', paymentId);
            
            const url = `${ENDPOINTS.NOTIFICATIONS.SCHEDULE}?${params.toString()}`;
            console.log("Schedule notification request URL:", url);
            
            const response = await api.post(url);
            console.log("Schedule notification response:", response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error scheduling notification:", error.response?.data || error.message);
            throw error; // Rethrow for mutation error handling
        }
    },
    
    updateNotificationContent: async (id, content) => {
        try {
            if (!id || !content) {
                console.warn("updateNotificationContent called with missing parameters", { id, content });
                throw new Error("Missing required parameters");
            }
            
            console.log("Updating notification content:", "id:", id, "content:", content);
            
            const params = new URLSearchParams();
            params.append('content', content);
            
            const url = `${ENDPOINTS.NOTIFICATIONS.UPDATE_CONTENT(id)}?${params.toString()}`;
            console.log("Update content request URL:", url);
            
            const response = await api.put(url);
            console.log("Update content response:", response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error updating notification content:", error.response?.data || error.message);
            throw error; // Rethrow for mutation error handling
        }
    },
    
    // Kiểm tra kết nối với notification service
    checkConnection: async () => {
        try {
            console.log("Checking notification service connection...");
            // Gọi một endpoint đơn giản để kiểm tra kết nối
            const response = await api.get(`${API_BASE}/health-check`);
            console.log("Connection check response:", response.data);
            return {
                status: 'connected',
                details: response.data
            };
        } catch (error) {
            console.error("Connection check failed:", error);
            return {
                status: 'disconnected',
                error: error.message
            };
        }
    },
    
    // Thêm vào NotificationService.js
    refreshNotifications: async (userId) => {
        try {
            if (!userId) {
                console.warn("refreshNotifications called without userId");
                return false;
            }
            console.log("Refreshing notifications for user:", userId);
            // Không cần gọi API, chỉ cần trả về true để biết đã thực hiện
            return true;
        } catch (error) {
            console.error("Error refreshing notifications:", error);
            return false;
        }
    },
    
    // Hàm kiểm tra và debug thông báo
    debugNotifications: async (userId) => {
        try {
            if (!userId) {
                console.warn("debugNotifications called without userId");
                return { error: "Missing userId" };
            }
            
            console.log("Debugging notifications for user:", userId);
            
            // Kiểm tra thông báo theo từng loại
            const types = [
                'COURSE_APPROVAL', 'COURSE_REJECTION', 'INSTRUCTOR_APPROVAL', 'INSTRUCTOR_REJECTION', 
                'SYSTEM', 'GENERAL', 'PAYMENT'
            ];
            
            const results = {};
            
            // Kiểm tra tất cả thông báo
            try {
                const allNotifications = await NotificationService.fetchNotifications(userId);
                results.all = {
                    count: allNotifications.length,
                    notifications: allNotifications
                };
            } catch (error) {
                results.all = { error: error.message };
            }
            
            // Kiểm tra từng loại thông báo
            for (const type of types) {
                try {
                    // Normalize the notification type
                    const normalizedType = normalizeNotificationType(type);
                    
                    const typeNotifications = await NotificationService.fetchNotificationsByType(userId, normalizedType);
                    results[type] = {
                        count: typeNotifications.length,
                        notifications: typeNotifications
                    };
                } catch (error) {
                    results[type] = { error: error.message };
                }
            }
            
            // Kiểm tra số lượng thông báo chưa đọc
            try {
                const unreadCount = await NotificationService.countUnreadNotifications(userId);
                results.unreadCount = unreadCount;
            } catch (error) {
                results.unreadCount = { error: error.message };
            }
            
            // Kiểm tra thống kê thông báo
            try {
                const statistics = await NotificationService.getNotificationStatistics(userId);
                results.statistics = statistics;
            } catch (error) {
                results.statistics = { error: error.message };
            }
            
            console.log("Debug results:", results);
            return results;
        } catch (error) {
            console.error("Error debugging notifications:", error);
            return { error: error.message };
        }
    },
    
    // Thêm các phương thức mới để cải thiện khả năng xử lý lỗi
    
    // Phương thức để kiểm tra xem API notification có hoạt động không
    checkNotificationAPI: async () => {
        try {
            console.log("Checking notification API status...");
            const response = await api.get(`${ENDPOINTS.NOTIFICATIONS.BASE}/health`);
            return {
                status: 'online',
                message: response.data?.message || 'Notification API is working properly'
            };
        } catch (error) {
            console.error("Notification API check failed:", error);
            return {
                status: 'offline',
                message: 'Notification API is currently unavailable',
                error: error.message
            };
        }
    },
    
    // Phương thức để đồng bộ thông báo từ server
    syncNotifications: async (userId) => {
        try {
            if (!userId) {
                console.warn("syncNotifications called without userId");
                return { success: false, message: "Missing userId" };
            }
            
            console.log("Syncing notifications for user:", userId);
            
            // Gọi một endpoint đặc biệt để đồng bộ thông báo
            const response = await api.post(`${ENDPOINTS.NOTIFICATIONS.BASE}/sync`, { userId });
            
            return {
                success: true,
                message: "Notifications synchronized successfully",
                data: response.data
            };
        } catch (error) {
            console.error("Error syncing notifications:", error);
            return {
                success: false,
                message: "Failed to sync notifications",
                error: error.message
            };
        }
    },
    
    // Phương thức để xử lý lỗi kết nối và thử lại
    fetchNotificationsWithRetry: async (userId, maxRetries = 3) => {
        let retries = 0;
        
        while (retries < maxRetries) {
            try {
                console.log(`Attempt ${retries + 1} to fetch notifications for userId: ${userId}`);
                const notifications = await NotificationService.fetchNotifications(userId);
                return notifications;
            } catch (error) {
                retries++;
                console.error(`Attempt ${retries} failed:`, error);
                
                if (retries >= maxRetries) {
                    console.error("Max retries reached, giving up");
                    return [];
                }
                
                // Chờ một khoảng thời gian trước khi thử lại
                const delay = retries * 1000; // 1s, 2s, 3s
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        return []; // Fallback nếu tất cả các lần thử đều thất bại
    },
    
    // Phương thức để xác thực thông báo trước khi gửi
    validateNotification: (content, type) => {
        const errors = [];
        
        if (!content) {
            errors.push("Content is required");
        } else if (content.length < 5) {
            errors.push("Content must be at least 5 characters long");
        } else if (content.length > 500) {
            errors.push("Content cannot exceed 500 characters");
        }
        
        // Normalize the notification type for validation
        const normalizedType = type ? normalizeNotificationType(type) : null;
        
        // Get all valid notification types from the NOTIFICATION_TYPES object
        const validTypes = Object.values(NOTIFICATION_TYPES);
        
        if (!type) {
            errors.push("Type is required");
        } else if (!validTypes.includes(normalizedType)) {
            errors.push(`Type must be one of the valid notification types`);
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },
    
    // Phương thức để xử lý thông báo offline
    saveOfflineNotification: (notification) => {
        try {
            // Normalize the notification type if present
            if (notification.type) {
                notification.type = normalizeNotificationType(notification.type);
            }
            
            // Lưu thông báo vào localStorage để gửi sau khi có kết nối
            const offlineNotifications = JSON.parse(localStorage.getItem('offlineNotifications') || '[]');
            offlineNotifications.push({
                ...notification,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });
            localStorage.setItem('offlineNotifications', JSON.stringify(offlineNotifications));
            
            return {
                success: true,
                message: "Notification saved for offline processing"
            };
        } catch (error) {
            console.error("Error saving offline notification:", error);
            return {
                success: false,
                message: "Failed to save notification for offline processing",
                error: error.message
            };
        }
    },
    
    // Phương thức để gửi các thông báo đã lưu offline
    processPendingOfflineNotifications: async () => {
        try {
            const offlineNotifications = JSON.parse(localStorage.getItem('offlineNotifications') || '[]');
            
            if (offlineNotifications.length === 0) {
                return {
                    success: true,
                    message: "No pending offline notifications",
                    processed: 0
                };
            }
            
            console.log(`Processing ${offlineNotifications.length} offline notifications`);
            
            const results = [];
            const remainingNotifications = [];
            
            for (const notification of offlineNotifications) {
                try {
                    // Gửi thông báo
                    const { userId, content, type, courseId, paymentId } = notification;
                    
                    // Normalize the notification type
                    const normalizedType = normalizeNotificationType(type);
                    
                    await NotificationService.sendNotification(userId, content, normalizedType, courseId, paymentId);
                    
                    results.push({
                        id: notification.id,
                        status: 'success',
                        message: 'Processed successfully'
                    });
                } catch (error) {
                    console.error("Error processing offline notification:", error);
                    
                    // Giữ lại thông báo để thử lại sau
                    remainingNotifications.push(notification);
                    
                    results.push({
                        id: notification.id,
                        status: 'error',
                        message: error.message
                    });
                }
            }
            
            // Cập nhật localStorage với các thông báo còn lại
            localStorage.setItem('offlineNotifications', JSON.stringify(remainingNotifications));
            
            return {
                success: true,
                message: `Processed ${results.length - remainingNotifications.length} of ${offlineNotifications.length} notifications`,
                processed: results.length - remainingNotifications.length,
                remaining: remainingNotifications.length,
                results
            };
        } catch (error) {
            console.error("Error processing offline notifications:", error);
            return {
                success: false,
                message: "Failed to process offline notifications",
                error: error.message
            };
        }
    }
};

export default NotificationService;