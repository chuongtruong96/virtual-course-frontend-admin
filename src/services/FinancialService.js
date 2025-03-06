import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

// Service for handling financial data API calls
const FinancialService = {
  // Get transaction statistics
  getTransactionStatistics: async () => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.STATISTICS);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction statistics:', error);
      throw error;
    }
  },

  // Get wallet statistics
  getWalletStatistics: async () => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.WALLETS.STATISTICS);
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet statistics:', error);
      throw error;
    }
  },
  // Get monthly transaction trends
  getMonthlyTransactionTrends: async () => {
    try {
      const response = await axios.get(ENDPOINTS.ADMIN.TRANSACTIONS.MONTHLY_TRENDS);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly transaction trends:', error);
      throw error;
    }
  },

  // Get transaction list (paginated)
  getTransactions: async (page = 0, size = 10, type = null, status = null) => {
    try {
      // Use params object for better query parameter handling
      const params = { page, size };
      if (type) params.type = type;
      if (status) params.status = status;
      
      const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.LIST, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Get wallet list (paginated)
  getWallets: async (page = 0, size = 10, status = null) => {
    try {
      // Use params object for better query parameter handling
      const params = { page, size };
      if (status) params.status = status;
      
      const response = await api.get(ENDPOINTS.ADMIN.WALLETS.LIST, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching wallets:', error);
      throw error;
    }
  },

  // Get transaction details
  getTransactionDetails: async (transactionId) => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.DETAIL(transactionId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction details for ID ${transactionId}:`, error);
      throw error;
    }
  },

  // Get wallet details
  getWalletDetails: async (walletId) => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.WALLETS.DETAIL(walletId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching wallet details for ID ${walletId}:`, error);
      throw error;
    }
  },

  // Approve withdrawal request
  approveWithdrawal: async (transactionId) => {
    try {
      const response = await api.put(ENDPOINTS.ADMIN.TRANSACTIONS.APPROVE_WITHDRAWAL(transactionId));
      return response.data;
    } catch (error) {
      console.error(`Error approving withdrawal for transaction ID ${transactionId}:`, error);
      throw error;
    }
  },

  // Reject withdrawal request
  rejectWithdrawal: async (transactionId, reason) => {
    try {
      const response = await api.put(ENDPOINTS.ADMIN.TRANSACTIONS.REJECT_WITHDRAWAL(transactionId), { reason });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting withdrawal for transaction ID ${transactionId}:`, error);
      throw error;
    }
  },

  // Update wallet status
  updateWalletStatus: async (walletId, status) => {
    try {
      const response = await api.put(ENDPOINTS.ADMIN.WALLETS.UPDATE_STATUS(walletId), { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating wallet status for ID ${walletId}:`, error);
      throw error;
    }
  },

  // Update wallet balance
  updateWalletBalance: async (instructorId, amount, reason) => {
    try {
      const response = await api.put(ENDPOINTS.ADMIN.WALLETS.UPDATE_BALANCE(instructorId), { 
        amount, 
        reason 
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating wallet balance for instructor ID ${instructorId}:`, error);
      throw error;
    }
  },

  // Get instructor transactions
  getInstructorTransactions: async (instructorId, page = 0, size = 10) => {
    try {
      const params = { page, size };
      const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.INSTRUCTOR_TRANSACTIONS(instructorId), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching transactions for instructor ID ${instructorId}:`, error);
      throw error;
    }
  },

  // Get student transaction history
  getStudentTransactionHistory: async (studentId, page = 0, size = 10) => {
    try {
      const params = { page, size };
      const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.STUDENT_HISTORY(studentId), { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction history for student ID ${studentId}:`, error);
      throw error;
    }
  },

  // Get trends data
  getTrendsData: async (type = 'financial', period = 'monthly') => {
    try {
      const params = { type, period };
      const response = await api.get(ENDPOINTS.ADMIN.TRENDS, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} trends data:`, error);
      throw error;
    }
  }
};

export default FinancialService;