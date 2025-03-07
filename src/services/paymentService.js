import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const PaymentService = {
  // PayPal payment methods
  createPaypalPayment: async (courseId, platform = null) => {
    try {
      const params = { courseId };
      if (platform) params.platform = platform;
      
      const response = await api.post(ENDPOINTS.PAYMENT.PAYPAL.CREATE, null, { params });
      return response.data;
    } catch (error) {
      console.error('Error creating PayPal payment:', error);
      throw error;
    }
  },

  executePaypalPayment: async (paymentId, payerId) => {
    try {
      const params = { paymentId, payerId };
      const response = await api.post(ENDPOINTS.PAYMENT.PAYPAL.EXECUTE, null, { params });
      return response.data;
    } catch (error) {
      console.error('Error executing PayPal payment:', error);
      throw error;
    }
  },

  createPaypalPaymentMultiple: async (courseIds) => {
    try {
      const response = await api.post(ENDPOINTS.PAYMENT.PAYPAL.CREATE_MULTIPLE, courseIds);
      return response.data;
    } catch (error) {
      console.error('Error creating multiple PayPal payment:', error);
      throw error;
    }
  },

  // VNPay payment methods
  createVnpayPayment: async (courseId) => {
    try {
      const params = { courseId };
      const response = await api.post(ENDPOINTS.PAYMENT.VNPAY.CREATE, null, { params });
      return response.data;
    } catch (error) {
      console.error('Error creating VNPay payment:', error);
      throw error;
    }
  },

  createVnpayPaymentMultiple: async (courseIds) => {
    try {
      const response = await api.post(ENDPOINTS.PAYMENT.VNPAY.CREATE_MULTIPLE, courseIds);
      return response.data;
    } catch (error) {
      console.error('Error creating multiple VNPay payment:', error);
      throw error;
    }
  },

  // Transaction history methods
  getStudentTransactionHistory: async (studentId) => {
    try {
      const response = await api.get(ENDPOINTS.TRANSACTIONS.HISTORY(studentId));
      return response.data;
    } catch (error) {
      console.error('Error fetching student transaction history:', error);
      throw error;
    }
  },

  getTransactionDetails: async (transactionId) => {
    try {
      const response = await api.get(ENDPOINTS.TRANSACTIONS.DETAILS(transactionId));
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      throw error;
    }
  },

  // Admin transaction methods
  getTransactionStatistics: async () => {
    try {
      const response = await api.get(ENDPOINTS.TRANSACTIONS.STATISTICS);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction statistics:', error);
      throw error;
    }
  },

  getStudentTransactionHistoryAdmin: async (studentId) => {
    try {
      const response = await api.get(ENDPOINTS.TRANSACTIONS.STUDENT_HISTORY(studentId));
      return response.data;
    } catch (error) {
      console.error('Error fetching student transaction history (admin):', error);
      throw error;
    }
  },

  getInstructorTransactions: async (instructorId) => {
    try {
      const response = await api.get(ENDPOINTS.TRANSACTIONS.INSTRUCTOR_TRANSACTIONS(instructorId));
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor transactions:', error);
      throw error;
    }
  }
};

export default PaymentService;