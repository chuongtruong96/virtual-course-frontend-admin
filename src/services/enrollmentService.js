// src/services/EnrollmentService.js

import createCRUDService from './baseService';
import api from '../untils/api';
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler';

/**
 * EnrollmentService xử lý tất cả các tương tác API liên quan đến Enrollments.
 */
const enrollmentCRUD = createCRUDService(ENDPOINTS.ENROLLMENTS.BASE);

const EnrollmentService = {
  ...enrollmentCRUD,

  /**
   * Enroll a student.
   * @param {object} params - Chứa enrollmentData và signal.
   * @param {object} params.enrollmentData - Dữ liệu enrollment mới.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Enrollment đã thêm.
   */
  enrollStudent: async ({ enrollmentData, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.ENROLLMENTS.BASE, enrollmentData, { signal });
      return response.data;
    } catch (error) {
      console.error('Error enrolling student:', error);
      throw handleError(error);
    }
  },

  /**
   * Complete an enrollment.
   * @param {object} params - Chứa enrollmentId và signal.
   * @param {number} params.enrollmentId - ID của enrollment.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Enrollment đã hoàn thành.
   */
  completeEnrollment: async ({ enrollmentId, signal }) => {
    try {
      const response = await api.put(`${ENDPOINTS.ENROLLMENTS.COMPLETE(enrollmentId)}`, {}, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error completing enrollment ${enrollmentId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Fetch enrollments by student ID.
   * @param {object} params - Chứa studentId và signal.
   * @param {number} params.studentId - ID của student.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Array>} Danh sách enrollments.
   */
  fetchEnrollmentsByStudent: async ({ studentId, signal }) => {
    try {
      const response = await api.get(`${ENDPOINTS.ENROLLMENTS.BY_STUDENT(studentId)}`, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollments for student ${studentId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Fetch enrollments by course ID.
   * @param {object} params - Chứa courseId và signal.
   * @param {number} params.courseId - ID của course.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Array>} Danh sách enrollments.
   */
  fetchEnrollmentsByCourse: async ({ courseId, signal }) => {
    try {
      const response = await api.get(`${ENDPOINTS.ENROLLMENTS.BY_COURSE(courseId)}`, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollments for course ${courseId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Delete an enrollment.
   * @param {object} params - Chứa enrollmentId và signal.
   * @param {number} params.enrollmentId - ID của enrollment.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<void>}
   */
  deleteEnrollment: async ({ enrollmentId, signal }) => {
    try {
      await api.delete(`${ENDPOINTS.ENROLLMENTS.BY_ID(enrollmentId)}`, { signal });
    } catch (error) {
      console.error(`Error deleting enrollment ${enrollmentId}:`, error);
      throw handleError(error);
    }
  },
};

export default EnrollmentService;
