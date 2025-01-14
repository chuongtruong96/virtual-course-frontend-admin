// src/services/NotificationService.js

import createCRUDService from './baseService';
import api from '../untils/api';
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler';

/**
 * NotificationService handles all API interactions related to notifications.
 * Extends baseCRUDService with additional notification-specific methods.
 */
const notificationCRUD = createCRUDService(ENDPOINTS.NOTIFICATIONS.BASE);

const NotificationService = {
  ...notificationCRUD,

  /**
   * Create a new notification.
   * @param {object} params - Contains notificationData and signal.
   * @param {object} params.notificationData - The notification data to create.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<Object>} The created notification.
   */
  createNotification: async ({ notificationData, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.NOTIFICATIONS.BASE, notificationData, { signal });
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw handleError(error);
    }
  },

  /**
   * Fetch notifications by user ID.
   * @param {object} params - Contains userId and signal.
   * @param {number} params.userId - The ID of the user.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<Array>} The list of notifications.
   */
  fetchNotificationsByUser: async ({ userId, signal }) => {
    try {
      const response = await api.get(`${ENDPOINTS.NOTIFICATIONS.BASE}/user/${userId}`, { signal });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw handleError(error);
    }
  },

  /**
   * Mark a notification as read.
   * @param {object} params - Contains notificationId and signal.
   * @param {number} params.notificationId - The ID of the notification to mark as read.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<void>} Resolves when the notification is marked as read.
   */
  markAsRead: async ({ notificationId, signal }) => {
    try {
      await api.put(`${ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}/read`, {}, { signal });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw handleError(error);
    }
  },

  /**
   * Delete a notification.
   * @param {object} params - Contains notificationId and signal.
   * @param {number} params.notificationId - The ID of the notification to delete.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<void>} Resolves when the notification is deleted.
   */
  deleteNotification: async ({ notificationId, signal }) => {
    try {
      await api.delete(`${ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}`, { signal });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw handleError(error);
    }
  },
};

export default NotificationService;
