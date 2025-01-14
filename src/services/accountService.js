// src/services/AccountService.js

import createCRUDService from './baseService';
import api from '../untils/api'; // Sửa 'untils' thành 'utils'
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler'; // Sửa 'untils' thành 'utils'

/**
 * AccountService xử lý tất cả các tương tác API liên quan đến Accounts.
 */
const accountCRUD = createCRUDService(ENDPOINTS.ACCOUNTS.BASE);

const AccountService = {
  ...accountCRUD,

  /**
   * Enable một account.
   * @param {object} params - Chứa id.
   * @param {number} params.id - ID của account.
   * @returns {Promise<void>}
   */
  enableAccount: async ({ id }) => {
    try {
      await api.put(ENDPOINTS.ACCOUNTS.ENABLE(id), {});
    } catch (error) {
      console.error(`Error enabling account ${id}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Disable một account.
   * @param {object} params - Chứa id.
   * @param {number} params.id - ID của account.
   * @returns {Promise<void>}
   */
  disableAccount: async ({ id }) => {
    try {
      await api.put(ENDPOINTS.ACCOUNTS.DISABLE(id), {});
    } catch (error) {
      console.error(`Error disabling account ${id}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Delete một account.
   * @param {object} params - Chứa id.
   * @param {number} params.id - ID của account.
   * @returns {Promise<void>}
   */
  deleteAccount: async ({ id }) => {
    try {
      await api.delete(ENDPOINTS.ACCOUNTS.BY_ID(id));
    } catch (error) {
      console.error(`Error deleting account ${id}:`, error);
      throw handleError(error);
    }
  },
};

export default AccountService;
