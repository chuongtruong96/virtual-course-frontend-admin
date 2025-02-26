// src/services/notificationService.js
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const NotificationService = {
  fetchNotifications: async (userId) => {
    if (!userId) {
      throw new Error('User ID is required to fetch notifications');
    }
    console.log("Fetching notifications for userId:", userId);
    const response = await fetch(ENDPOINTS.NOTIFICATIONS.BY_USER(userId));
    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.status}`);
    }
    return response.json();
  },
  markAsRead: async (id) => {
    const response = await api.put(ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id));
    return response.data;
  },
  deleteNotification: async (id) => {
    await api.delete(ENDPOINTS.NOTIFICATIONS.BY_ID(id));
  },
  fetchById: async (id) => {
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_ID(id));
    return response.data;
  },
};

export default NotificationService;
