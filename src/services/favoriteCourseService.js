// src/services/FavoriteCourseService.js

import api from '../untils/api';
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler';

/**
 * FavoriteCourseService xử lý tất cả các tương tác API liên quan đến Favorite Courses.
 */
const FavoriteCourseService = {
  /**
   * Fetch favorite courses by student ID.
   * @param {object} params - Chứa studentId và signal.
   * @param {number} params.studentId - ID của student.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Array>} Danh sách các favorite courses.
   */
  getFavoriteCourses: async ({ studentId, signal }) => {
    try {
      const response = await api.get(`${ENDPOINTS.FAVORITE_COURSES.BASE}/${studentId}`, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching favorite courses for student ${studentId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Add a course to favorites.
   * @param {object} params - Chứa studentId, courseId, và signal.
   * @param {number} params.studentId - ID của student.
   * @param {number} params.courseId - ID của course.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Favorite course đã thêm.
   */
  addFavoriteCourse: async ({ studentId, courseId, signal }) => {
    try {
      const response = await api.post(`${ENDPOINTS.FAVORITE_COURSES.ADD}`, { studentId, courseId }, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error adding favorite course ${courseId} for student ${studentId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Remove a course from favorites.
   * @param {object} params - Chứa studentId, courseId, và signal.
   * @param {number} params.studentId - ID của student.
   * @param {number} params.courseId - ID của course.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<void>}
   */
  removeFavoriteCourse: async ({ studentId, courseId, signal }) => {
    try {
      await api.delete(`${ENDPOINTS.FAVORITE_COURSES.REMOVE}`, {
        data: { studentId, courseId },
        signal,
      });
    } catch (error) {
      console.error(`Error removing favorite course ${courseId} for student ${studentId}:`, error);
      throw handleError(error);
    }
  },
};

export default FavoriteCourseService;
