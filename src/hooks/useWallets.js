// src/hooks/useWallets.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import WalletService from '../services/walletService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useWallets = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Create wallet mutation
  const createWalletMutation = useMutation({
    mutationFn: WalletService.add,
    onSuccess: () => {
      queryClient.invalidateQueries(['wallets']);
      addNotification('Ví đã được tạo thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to create wallet:', error);
      addNotification('Không thể tạo ví. Vui lòng thử lại.', 'danger');
    },
  });

  // Fetch wallet by ID
  const fetchWallet = (walletId) => {
    return useQuery({
      queryKey: ['wallet', walletId],
      queryFn: () => WalletService.fetchById({ id: walletId, signal: undefined }),
      enabled: !!walletId,
      onError: (err) => {
        console.error(`Error fetching wallet ${walletId}:`, err);
        addNotification('Không thể tải thông tin ví.', 'danger');
      },
    });
  };

  // Update balance mutation
  const updateBalanceMutation = useMutation({
    mutationFn: WalletService.updateBalance,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['wallet', data.walletId]);
      addNotification('Số dư ví đã được cập nhật!', 'success');
    },
    onError: (error) => {
      console.error('Failed to update wallet balance:', error);
      addNotification('Không thể cập nhật số dư ví. Vui lòng thử lại.', 'danger');
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: WalletService.updateWalletStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['wallet', data.walletId]);
      addNotification('Trạng thái ví đã được cập nhật!', 'success');
    },
    onError: (error) => {
      console.error('Failed to update wallet status:', error);
      addNotification('Không thể cập nhật trạng thái ví. Vui lòng thử lại.', 'danger');
    },
  });

  // Set max limit mutation
  const setMaxLimitMutation = useMutation({
    mutationFn: WalletService.setMaxLimit,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['wallet', data.walletId]);
      addNotification('Giới hạn ví đã được đặt!', 'success');
    },
    onError: (error) => {
      console.error('Failed to set wallet max limit:', error);
      addNotification('Không thể đặt giới hạn ví. Vui lòng thử lại.', 'danger');
    },
  });

  return {
    createWallet: createWalletMutation.mutate,
    fetchWallet,
    updateBalance: updateBalanceMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    setMaxLimit: setMaxLimitMutation.mutate,

    createWalletStatus: createWalletMutation.status,
    updateBalanceStatus: updateBalanceMutation.status,
    updateStatusStatus: updateStatusMutation.status,
    setMaxLimitStatus: setMaxLimitMutation.status,
  };
};

export default useWallets;
// const mutation = useMutation({
//   mutationFn: async (args) => { ... },
//   onSuccess: () => { ... },
//   onError: () => { ... },
//   // ...
// });