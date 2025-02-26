// src/services/notificationService.js
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const NotificationService = {
  fetchNotifications: async (userId) => {
    const response = await api.get(ENDPOINTS.NOTIFICATIONS.BY_USER(userId));
    return response.data;
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
