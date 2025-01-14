// src/hooks/useTransactions.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TransactionService from '../services/transactionService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useTransactions = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch transaction history
  const useFetchTransactionHistory = (walletId) => {
    return useQuery({
      queryKey: ['transactions', 'history', walletId],
      queryFn: () => TransactionService.fetchTransactionHistory({ walletId, signal: undefined }),
      enabled: !!walletId,
      onError: (err) => {
        console.error('Error fetching transaction history:', err);
        addNotification('Không thể tải lịch sử giao dịch.', 'danger');
      },
    });
  };

  // Deposit mutation
  const depositMutation = useMutation({
    mutationFn: TransactionService.depositToWallet,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions', 'history']);
      addNotification('Nạp tiền vào ví thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to deposit:', error);
      addNotification('Không thể nạp tiền vào ví. Vui lòng thử lại.', 'danger');
    },
  });

  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: TransactionService.withdrawFromWallet,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions', 'history']);
      addNotification('Rút tiền từ ví thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to withdraw:', error);
      addNotification('Không thể rút tiền từ ví. Vui lòng thử lại.', 'danger');
    },
  });

  // Refund mutation
  const refundMutation = useMutation({
    mutationFn: TransactionService.refundPayment,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions', 'history']);
      addNotification('Hoàn tiền thanh toán thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to refund payment:', error);
      addNotification('Không thể hoàn tiền thanh toán. Vui lòng thử lại.', 'danger');
    },
  });

  return {
    useFetchTransactionHistory,

    deposit: depositMutation.mutate,
    withdraw: withdrawMutation.mutate,
    refund: refundMutation.mutate,

    depositStatus: depositMutation.status,
    withdrawStatus: withdrawMutation.status,
    refundStatus: refundMutation.status,
  };
};

export default useTransactions;
