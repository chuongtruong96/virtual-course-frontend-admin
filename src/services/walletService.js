// src/services/WalletService.js

import createCRUDService from './baseService';
import api from '../untils/api';
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler';

/**
 * WalletService xử lý tất cả các tương tác API liên quan đến Wallets.
 */
const walletCRUD = createCRUDService(ENDPOINTS.WALLETS.BASE);

const WalletService = {
  ...walletCRUD,

  /**
   * Update the balance of a wallet.
   * @param {object} params - Chứa walletId, amount, isDeposit, và signal.
   * @param {number} params.walletId - ID của wallet.
   * @param {number} params.amount - Số tiền.
   * @param {boolean} params.isDeposit - True cho deposit, false cho withdraw.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Wallet đã cập nhật.
   */
  updateBalance: async ({ walletId, amount, isDeposit, signal }) => {
    try {
      const response = await api.put(`${ENDPOINTS.WALLETS.UPDATE_BALANCE(walletId)}`, { amount, isDeposit }, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error updating balance for wallet ${walletId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Update the status of a wallet.
   * @param {object} params - Chứa walletId, newStatus, và signal.
   * @param {number} params.walletId - ID của wallet.
   * @param {string} params.newStatus - Trạng thái mới.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Wallet đã cập nhật.
   */
  updateWalletStatus: async ({ walletId, newStatus, signal }) => {
    try {
      const response = await api.put(`${ENDPOINTS.WALLETS.UPDATE_STATUS(walletId)}`, { newStatus }, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for wallet ${walletId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Set the maximum limit of a wallet.
   * @param {object} params - Chứa walletId, maxLimit, và signal.
   * @param {number} params.walletId - ID của wallet.
   * @param {number} params.maxLimit - Giới hạn tối đa.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Wallet đã cập nhật.
   */
  setMaxLimit: async ({ walletId, maxLimit, signal }) => {
    try {
      const response = await api.put(`${ENDPOINTS.WALLETS.SET_MAX_LIMIT(walletId)}`, { maxLimit }, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error setting max limit for wallet ${walletId}:`, error);
      throw handleError(error);
    }
  },
};

export default WalletService;
