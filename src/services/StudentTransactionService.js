import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

/**
 * Service for handling student transaction operations
 */
const StudentTransactionService = {
  /**
   * Get transaction history for the current student
   * @param {number} studentId - The ID of the student
   * @param {number} page - Page number for pagination (default: 0)
   * @param {number} size - Number of items per page (default: 10)
   * @returns {Promise<Object>} Transaction history data with pagination
   */
  getTransactionHistory: async (studentId, page = 0, size = 10) => {
    try {
      const queryParams = `?page=${page}&size=${size}`;
      const response = await api.get(ENDPOINTS.TRANSACTIONS.HISTORY(studentId) + queryParams);
      
      // Process the response to ensure all expected fields are present
      const transactions = response.data;
      
      // If transactions is an array, ensure each item has the expected fields
      if (Array.isArray(transactions.content)) {
        transactions.content = transactions.content.map(transaction => ({
          ...transaction,
          courses: transaction.courses || [],
          paymentMethod: transaction.paymentMethod || '',
          status: transaction.status || ''
        }));
      }
      
      return transactions;
    } catch (error) {
      console.error('Error fetching student transaction history:', error);
      throw error;
    }
  },

  /**
   * Get details of a specific transaction
   * @param {number} transactionId - The ID of the transaction
   * @returns {Promise<Object>} Transaction details
   */
  getTransactionDetails: async (transactionId) => {
    try {
      const response = await api.get(ENDPOINTS.TRANSACTIONS.DETAILS(transactionId));
      
      // Ensure we handle null values properly
      const transaction = response.data;
      
      // Check if any expected fields are null and provide defaults
      if (!transaction.courses) transaction.courses = [];
      if (!transaction.paymentMethod) transaction.paymentMethod = '';
      if (!transaction.status) transaction.status = '';
      
      return transaction;
    } catch (error) {
      console.error(`Error fetching transaction details for ${transactionId}:`, error);
      throw error;
    }
  },

  /**
   * Get recent transactions for the student dashboard
   * @param {number} studentId - The ID of the student
   * @param {number} limit - Maximum number of transactions to return (default: 5)
   * @returns {Promise<Array>} Recent transactions
   */
  getRecentTransactions: async (studentId, limit = 5) => {
    try {
      const queryParams = `?limit=${limit}`;
      const response = await api.get(ENDPOINTS.TRANSACTIONS.HISTORY(studentId) + queryParams);
      
      // If the API doesn't support the limit parameter, we can slice the result
      let transactions = response.data;
      if (Array.isArray(transactions.content)) {
        transactions = transactions.content.slice(0, limit);
      } else if (Array.isArray(transactions)) {
        transactions = transactions.slice(0, limit);
      }
      
      return transactions.map(transaction => ({
        ...transaction,
        courses: transaction.courses || [],
        paymentMethod: transaction.paymentMethod || '',
        status: transaction.status || ''
      }));
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      throw error;
    }
  },

  /**
   * Get transaction statistics for a student
   * @param {number} studentId - The ID of the student
   * @returns {Promise<Object>} Transaction statistics
   */
  getStudentTransactionStats: async (studentId) => {
    try {
      const response = await api.get(`${ENDPOINTS.TRANSACTIONS.HISTORY(studentId)}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student transaction statistics:', error);
      
      // Return default stats if the API fails
      return {
        totalSpent: 0,
        totalTransactions: 0,
        averageTransactionValue: 0,
        lastTransactionDate: null
      };
    }
  },

  /**
   * Download transaction receipt/invoice
   * @param {number} transactionId - The ID of the transaction
   * @returns {Promise<Blob>} PDF blob for download
   */
  downloadTransactionReceipt: async (transactionId) => {
    try {
      const response = await api.get(`${ENDPOINTS.TRANSACTIONS.DETAILS(transactionId)}/receipt`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error downloading receipt for transaction ${transactionId}:`, error);
      throw error;
    }
  }
};

export default StudentTransactionService;