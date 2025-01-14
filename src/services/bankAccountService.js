// src/services/BankAccountService.js

import createCRUDService from './baseService';
import api from '../untils/api';
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler';

/**
 * BankAccountService handles all API interactions related to bank accounts.
 * Extends baseCRUDService with additional bank account-specific methods if needed.
 */
const bankAccountCRUD = createCRUDService(ENDPOINTS.BANK_ACCOUNTS.BASE);

const BankAccountService = {
  ...bankAccountCRUD,
 /**
   * Fetch all bank accounts.
   * @param {object} params - Contains query options.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<Array>} List of bank accounts.
   */
 fetchBankAccounts: async ({ signal } = {}) => {
  try {
    const response = await api.get(ENDPOINTS.BANK_ACCOUNTS.BASE, { signal });
    return response.data;
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    throw handleError(error);
  }
},
  /**
   * Fetch a bank account by ID.
   * @param {object} params - Contains id and signal.
   * @param {number} params.id - The ID of the bank account.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<Object>} The bank account data.
   */
  fetchBankAccountById: async ({ id, signal }) => {
    try {
      const response = await api.get(`${ENDPOINTS.BANK_ACCOUNTS.BASE}/${id}`, { signal });
      return response.data;
    } catch (error) {
      console.error('Error fetching bank account by ID:', error);
      throw handleError(error);
    }
  },

  /**
   * Add a new bank account.
   * @param {object} params - Contains data and signal.
   * @param {object} params.data - The bank account data to add.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<Object>} The added bank account.
   */
  addBankAccount: async ({ data, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.BANK_ACCOUNTS.BASE, data, { signal });
      return response.data;
    } catch (error) {
      console.error('Error adding bank account:', error);
      throw handleError(error);
    }
  },

  /**
   * Edit an existing bank account.
   * @param {object} params - Contains id, data, and signal.
   * @param {number} params.id - The ID of the bank account to edit.
   * @param {object} params.data - The updated bank account data.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<Object>} The updated bank account.
   */
  editBankAccount: async ({ id, data, signal }) => {
    try {
      const response = await api.put(`${ENDPOINTS.BANK_ACCOUNTS.BASE}/${id}`, data, { signal });
      return response.data;
    } catch (error) {
      console.error('Error editing bank account:', error);
      throw handleError(error);
    }
  },

  /**
   * Delete a bank account.
   * @param {object} params - Contains id and signal.
   * @param {number} params.id - The ID of the bank account to delete.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<void>} Resolves when the bank account is deleted.
   */
  deleteBankAccount: async ({ id, signal }) => {
    try {
      await api.delete(`${ENDPOINTS.BANK_ACCOUNTS.BASE}/${id}`, { signal });
    } catch (error) {
      console.error('Error deleting bank account:', error);
      throw handleError(error);
    }
  },
};

export default BankAccountService;
