// src/services/baseService.js

import api from '../untils/api'; // Sửa từ 'untils' thành 'utils'
import { handleError } from '../untils/errorHandler'; // Sửa từ 'untils' thành 'utils'

/**
 * Tạo một service CRUD cơ bản dựa trên endpoint cơ bản.
 * @param {string} baseEndpoint - Endpoint cơ bản cho entity.
 * @returns {object} Các phương thức CRUD.
 */
const createCRUDService = (baseEndpoint) => ({
  /**
   * Fetch tất cả các đối tượng.
   * @param {object} params - Chứa signal để hủy request nếu cần.
   * @param {AbortSignal} params.signal - Signal để hủy request.
   * @returns {Promise<Array>} Danh sách các đối tượng.
   */
  fetchAll: async ({ signal }) => {
    try {
      const response = await api.get(baseEndpoint, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching all from ${baseEndpoint}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Fetch đối tượng theo ID.
   * @param {object} params - Chứa id và signal.
   * @param {number} params.id - ID của đối tượng.
   * @param {AbortSignal} params.signal - Signal để hủy request.
   * @returns {Promise<Object>} Đối tượng dữ liệu.
   */
  fetchById: async ({ id, signal }) => {
    try {
      const response = await api.get(`${baseEndpoint}/${id}`, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching by ID ${id} from ${baseEndpoint}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Thêm mới một đối tượng.
   * @param {object} data - Dữ liệu đối tượng.
   * @returns {Promise<Object>} Đối tượng đã thêm.
   */
  add: async (data) => {
    try {
      const response = await api.post(baseEndpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error adding to ${baseEndpoint}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Sửa một đối tượng.
   * @param {object} params - Chứa id, data, và signal.
   * @param {number} params.id - ID của đối tượng.
   * @param {object} params.data - Dữ liệu cập nhật.
   * @param {AbortSignal} params.signal - Signal để hủy request.
   * @returns {Promise<Object>} Đối tượng đã cập nhật.
   */
  edit: async ({ id, data, signal }) => {
    try {
      const response = await api.put(`${baseEndpoint}/${id}`, data, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error editing ID ${id} in ${baseEndpoint}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Xóa một đối tượng.
   * @param {object} params - Chứa id và signal.
   * @param {number} params.id - ID của đối tượng.
   * @param {AbortSignal} params.signal - Signal để hủy request.
   * @returns {Promise<void>} Không trả về gì khi thành công.
   */
  delete: async ({ id, signal }) => {
    try {
      await api.delete(`${baseEndpoint}/${id}`, { signal });
    } catch (error) {
      console.error(`Error deleting ID ${id} from ${baseEndpoint}:`, error);
      throw handleError(error);
    }
  },
});

export default createCRUDService;
