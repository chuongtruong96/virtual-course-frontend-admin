// src/services/favoriteCourseService.js
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';
import { handleError } from '../utils/errorHandler';

const FavoriteCourseService = {
  getFavoriteCourses: async ({ studentId, signal }) => {
    try {
      const response = await api.get(ENDPOINTS.FAVORITE.BY_STUDENT(studentId), { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching favorite courses for student ${studentId}:`, error);
      throw handleError(error);
    }
  },
  addFavoriteCourse: async ({ studentId, courseId, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.FAVORITE.ADD, { studentId, courseId }, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error adding favorite course ${courseId} for student ${studentId}:`, error);
      throw handleError(error);
    }
  },
  removeFavoriteCourse: async ({ studentId, courseId, signal }) => {
    try {
      await api.delete(ENDPOINTS.FAVORITE.REMOVE, {
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
