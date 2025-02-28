import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import AdminService from '../services/adminService';

const useAccounts = (status = 'all') => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  const {
    data: accounts,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['accounts', status],
    queryFn: async () => {
      const data = await AdminService.getAccountsByStatus(status);
      
      // Đối với mỗi tài khoản, lấy thêm thông tin về roles
      const accountsWithRoles = await Promise.all(
        data.map(async (account) => {
          try {
            // Nếu API của bạn có endpoint riêng để lấy roles
            const roles = await AdminService.getAccountRoles(account.id);
            return { ...account, roles };
          } catch (error) {
            console.error(`Failed to fetch roles for account ${account.id}:`, error);
            return { ...account, roles: [] };
          }
        })
      );
      
      return accountsWithRoles;
    },
    onError: (err) => {
      console.error('Error fetching accounts:', err);
      addNotification('Failed to load accounts', 'error');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ accountId, status }) => AdminService.updateAccountStatus(accountId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['accounts']);
      addNotification('Account status updated successfully', 'success');
    },
    onError: (err) => {
      console.error('Error updating account status:', err);
      addNotification('Failed to update account status', 'error');
    }
  });

  return {
    accounts: accounts || [],
    isLoading,
    isError,
    error,
    refetch,
    updateStatus: updateStatusMutation.mutate
  };
};

export default useAccounts;