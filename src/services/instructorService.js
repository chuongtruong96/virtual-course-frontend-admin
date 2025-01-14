// src/services/InstructorService.js

import createCRUDService from './baseService';
import api from '../untils/api';
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler';

/**
 * InstructorService xử lý tất cả các tương tác API liên quan đến Instructors.
 */
const instructorCRUD = createCRUDService(ENDPOINTS.INSTRUCTORS.BASE);

const InstructorService = {
  ...instructorCRUD,

  /**
   * Enable một instructor.
   * @param {object} params - Chứa id và signal.
   * @param {number} params.id - ID của instructor.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<void>}
   */
  enableInstructor: async ({ id, signal }) => {
    try {
      await api.put(ENDPOINTS.INSTRUCTORS.ENABLE(id), {});
    } catch (error) {
      console.error(`Error enabling instructor ${id}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Disable một instructor.
   * @param {object} params - Chứa id và signal.
   * @param {number} params.id - ID của instructor.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<void>}
   */
  disableInstructor: async ({ id, signal }) => {
    try {
      await api.put(ENDPOINTS.INSTRUCTORS.DISABLE(id), {});
    } catch (error) {
      console.error(`Error disabling instructor ${id}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Delete một instructor.
   * @param {object} params - Chứa id và signal.
   * @param {number} params.id - ID của instructor.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<void>}
   */
  deleteInstructor: async ({ id, signal }) => {
    try {
      await api.delete(ENDPOINTS.INSTRUCTORS.BY_ID(id));
    } catch (error) {
      console.error(`Error deleting instructor ${id}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Add an instructor to an account.
   * @param {object} params - Chứa accountId và instructorData.
   * @param {number} params.accountId - ID của account.
   * @param {object} params.instructorData - Dữ liệu instructor.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Instructor đã thêm.
   */
  addInstructorToAccount: async ({ accountId, instructorData, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.INSTRUCTORS.ADD_TO_ACCOUNT(accountId), instructorData, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error adding instructor to account ${accountId}:`, error);
      throw handleError(error);
    }
  },
  // src/services/InstructorService.js
fetchCourses: async ({ instructorId, signal }) => {
  try {
    const response = await api.get(ENDPOINTS.INSTRUCTORS.BY_ID_COURSES(instructorId), { signal });
    return response.data;
  } catch (error) {
    console.error(`Error fetching courses for instructor ${instructorId}:`, error);
    throw handleError(error);
  }
},
};

export default InstructorService;
