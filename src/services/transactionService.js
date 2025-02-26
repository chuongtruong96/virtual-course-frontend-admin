// src/services/TransactionService.js

import api from '../utils/api';
import { ENDPOINTS } from '../config/endpoints';
import { handleError } from '../utils/errorHandler';

/**
 * TransactionService xử lý tất cả các tương tác API liên quan đến Transactions.
 */
const TransactionService = {
  /**
   * Deposit money to a wallet.
   * @param {object} params - Chứa walletId, amount, và signal.
   * @param {number} params.walletId - ID của wallet.
   * @param {number} params.amount - Số tiền.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Transaction đã deposit.
   */
  depositToWallet: async ({ walletId, amount, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.TRANSACTIONS.DEPOSIT, { walletId, amount }, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error depositing to wallet ${walletId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Withdraw money from a wallet.
   * @param {object} params - Chứa walletId, amount, và signal.
   * @param {number} params.walletId - ID của wallet.
   * @param {number} params.amount - Số tiền.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Transaction đã withdraw.
   */
  withdrawFromWallet: async ({ walletId, amount, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.TRANSACTIONS.WITHDRAW, { walletId, amount }, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error withdrawing from wallet ${walletId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Refund a payment.
   * @param {object} params - Chứa paymentId, amount, và signal.
   * @param {number} params.paymentId - ID của payment.
   * @param {number} params.amount - Số tiền.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Transaction đã refund.
   */
  refundPayment: async ({ paymentId, amount, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.TRANSACTIONS.REFUND, { paymentId, amount }, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error refunding payment ${paymentId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Fetch transaction history for a wallet.
   * @param {object} params - Chứa walletId và signal.
   * @param {number} params.walletId - ID của wallet.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Array>} Danh sách transactions.
   */
  fetchTransactionHistory: async ({ walletId, signal }) => {
    try {
      const response = await api.get(`${ENDPOINTS.TRANSACTIONS.HISTORY(walletId)}`, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction history for wallet ${walletId}:`, error);
      throw handleError(error);
    }
  }
};

export default TransactionService;
