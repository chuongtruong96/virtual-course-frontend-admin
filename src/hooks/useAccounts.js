// src/hooks/useAccounts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AccountService from '../services/accountService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useAccounts = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch all accounts
  const {
    data: accounts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: ({ signal }) => AccountService.fetchAll({ signal }), // Truyền signal đúng cách
    onError: (err) => {
      console.error('Error fetching accounts:', err);
      addNotification('Không thể tải danh sách tài khoản.', 'danger');
    },
  });

  // Enable account
  const enableAccountMutation = useMutation({
    mutationFn: (accountId) => AccountService.enableAccount({ id: accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      addNotification('Account đã được kích hoạt!', 'success');
    },
    onError: (error) => {
      console.error('Failed to enable account:', error);
      addNotification('Không thể kích hoạt account.', 'danger');
    },
  });

  // Disable account
  const disableAccountMutation = useMutation({
    mutationFn: (accountId) => AccountService.disableAccount({ id: accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      addNotification('Account đã được vô hiệu hóa!', 'success');
    },
    onError: (error) => {
      console.error('Failed to disable account:', error);
      addNotification('Không thể vô hiệu hóa account.', 'danger');
    },
  });

  // Delete account
  const deleteAccountMutation = useMutation({
    mutationFn: (id) => AccountService.deleteAccount({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      addNotification('Account đã được xóa thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete account:', error);
      addNotification('Không thể xóa account.', 'danger');
    },
  });

  return {
    accounts,
    isLoading,
    isError,
    error,

    enableAccount: enableAccountMutation.mutate,
    disableAccount: disableAccountMutation.mutate,
    deleteAccount: deleteAccountMutation.mutate,

    enableAccountStatus: enableAccountMutation.status,
    disableAccountStatus: disableAccountMutation.status,
    deleteAccountStatus: deleteAccountMutation.status,
  };
};

export default useAccounts;
