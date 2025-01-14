// src/services/StudentService.js

import createCRUDService from './baseService';
import api from '../untils/api';
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler';

/**
 * StudentService xử lý tất cả các tương tác API liên quan đến Students.
 */
const studentCRUD = createCRUDService(ENDPOINTS.STUDENTS.BASE);

const StudentService = {
  ...studentCRUD,

  /**
   * Add a new student for a specific account.
   * @param {object} params - Chứa accountId, studentData, và signal.
   * @param {number} params.accountId - ID của account.
   * @param {object} params.studentData - Dữ liệu student mới.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Student đã thêm.
   */
  addStudent: async ({ accountId, studentData, signal }) => {
    try {
      const response = await api.post(`${ENDPOINTS.STUDENTS.ADD_TO_ACCOUNT(accountId)}`, studentData, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error adding student to account ${accountId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Enable a student (set status to active).
   * @param {object} params - Chứa id và signal.
   * @param {number} params.id - ID của student.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<void>}
   */
  enableStudent: async ({ id, signal }) => {
    try {
      await api.put(`${ENDPOINTS.STUDENTS.ENABLE(id)}`, {}, { signal });
    } catch (error) {
      console.error(`Error enabling student ${id}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Disable a student (set status to inactive).
   * @param {object} params - Chứa id và signal.
   * @param {number} params.id - ID của student.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<void>}
   */
  disableStudent: async ({ id, signal }) => {
    try {
      await api.put(`${ENDPOINTS.STUDENTS.DISABLE(id)}`, {}, { signal });
    } catch (error) {
      console.error(`Error disabling student ${id}:`, error);
      throw handleError(error);
    }
  },
};

export default StudentService;
