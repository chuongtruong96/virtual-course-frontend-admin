import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const AdminWalletService = {
  // Get all wallets
  getAllWallets: async (params = {}) => {
    const response = await api.get(ENDPOINTS.ADMIN.WALLETS.LIST, { params });
    return response.data;
  },

  // Get a wallet by instructor ID
  getWalletByInstructorId: async (instructorId) => {
    // Fix: Use the DETAIL endpoint function correctly
    const response = await api.get(ENDPOINTS.ADMIN.WALLETS.DETAIL(instructorId));
    return response.data;
  },

  // Update wallet status
  updateWalletStatus: async (walletId, status) => {
    const response = await api.put(ENDPOINTS.ADMIN.WALLETS.UPDATE_STATUS(walletId), { status });
    return response.data;
  },

  // Update wallet balance
  updateWalletBalance: async (instructorId, amount) => {
    const response = await api.put(ENDPOINTS.ADMIN.WALLETS.UPDATE_BALANCE(instructorId), { amount });
    return response.data;
  },

  // Get wallet statistics
  getWalletStatistics: async () => {
    const response = await api.get(ENDPOINTS.ADMIN.WALLETS.STATISTICS);
    return response.data;
  }
};

export default AdminWalletService;