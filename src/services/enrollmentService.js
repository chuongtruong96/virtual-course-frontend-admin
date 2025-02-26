// src/services/enrollmentService.js
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';
import { handleError } from '../utils/errorHandler';
import createCRUDService from './baseService';

const enrollmentCRUD = createCRUDService(ENDPOINTS.ENROLLMENTS.BASE);

const EnrollmentService = {
  ...enrollmentCRUD,
  enrollStudent: async ({ enrollmentData, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.ENROLLMENTS.BASE, enrollmentData, { signal });
      return response.data;
    } catch (error) {
      console.error('Error enrolling student:', error);
      throw handleError(error);
    }
  },
  completeEnrollment: async ({ enrollmentId, signal }) => {
    try {
      const response = await api.put(ENDPOINTS.ENROLLMENTS.COMPLETE(enrollmentId), {}, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error completing enrollment ${enrollmentId}:`, error);
      throw handleError(error);
    }
  },
  fetchEnrollmentsByStudent: async ({ studentId, signal }) => {
    try {
      const response = await api.get(ENDPOINTS.ENROLLMENTS.BY_STUDENT(studentId), { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollments for student ${studentId}:`, error);
      throw handleError(error);
    }
  },
  fetchEnrollmentsByCourse: async ({ courseId, signal }) => {
    try {
      const response = await api.get(ENDPOINTS.ENROLLMENTS.BY_COURSE(courseId), { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollments for course ${courseId}:`, error);
      throw handleError(error);
    }
  },
  deleteEnrollment: async ({ enrollmentId, signal }) => {
    try {
      await api.delete(ENDPOINTS.ENROLLMENTS.BY_ID(enrollmentId), { signal });
    } catch (error) {
      console.error(`Error deleting enrollment ${enrollmentId}:`, error);
      throw handleError(error);
    }
  },
};

export default EnrollmentService;
