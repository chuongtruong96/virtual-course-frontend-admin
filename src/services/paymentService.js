// src/services/PaymentService.js

import createCRUDService from './baseService';
import api from '../untils/api';
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler';

/**
 * PaymentService handles all API interactions related to payments.
 * Extends baseCRUDService with additional payment-specific methods.
 */
const paymentCRUD = createCRUDService(ENDPOINTS.PAYMENTS.BASE);

const PaymentService = {
  ...paymentCRUD,

  /**
   * Create a new payment.
   * @param {object} params - Contains paymentData and signal.
   * @param {object} params.paymentData - The payment data to create.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<Object>} The created payment.
   */
  createPayment: async ({ paymentData, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.PAYMENTS.BASE, paymentData, { signal });
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw handleError(error);
    }
  },

  /**
   * Fetch payments by student ID.
   * @param {object} params - Contains studentId and signal.
   * @param {number} params.studentId - The ID of the student.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<Array>} The list of payments.
   */
  fetchPaymentsByStudent: async ({ studentId, signal }) => {
    try {
      const response = await api.get(`${ENDPOINTS.PAYMENTS.BASE}/student/${studentId}`, { signal });
      return response.data;
    } catch (error) {
      console.error('Error fetching payments by student:', error);
      throw handleError(error);
    }
  },

  /**
   * Update the status of a payment.
   * @param {object} params - Contains paymentId, status, and signal.
   * @param {number} params.paymentId - The ID of the payment to update.
   * @param {string} params.status - The new status.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<Object>} The updated payment.
   */
  updatePaymentStatus: async ({ paymentId, status, signal }) => {
    try {
      const response = await api.put(`${ENDPOINTS.PAYMENTS.BASE}/${paymentId}/status`, { status }, { signal });
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw handleError(error);
    }
  },
};

export default PaymentService;
