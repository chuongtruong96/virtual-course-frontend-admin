import api from '../utils/api';
import { ENDPOINTS } from '../config/endpoints';

const WalletService = {
  fetchWallets: () => api.get(ENDPOINTS.WALLETS.BASE),
  deleteWallet: (id) => api.delete(ENDPOINTS.WALLETS.BY_ID(id)),

  createWallet: (walletData) => api.post(ENDPOINTS.WALLETS.BASE, walletData),
  fetchById: (id) => api.get(ENDPOINTS.WALLETS.BY_ID(id)),
  updateBalance: (id, amount, isDeposit) =>
    api.put(ENDPOINTS.WALLETS.UPDATE_BALANCE(id), { amount, isDeposit }),
  fetchByInstructorId: (instructorId) =>
    api.get(`${ENDPOINTS.WALLETS.BASE}/instructor/${instructorId}`),
  updateStatus: (id, newStatus) =>
    api.put(ENDPOINTS.WALLETS.UPDATE_STATUS(id), { status: newStatus }),
  setMaxLimit: (id, maxLimit) =>
    api.put(ENDPOINTS.WALLETS.SET_MAX_LIMIT(id), { maxLimit })
};

export default WalletService;