import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useCallback } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const useWallets = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch all wallets query
  const {
    data: wallets = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.ADMIN.WALLETS.LIST);
      return response.data;
    },
    onError: (err) => {
      console.error('Error fetching wallets:', err);
      addNotification('Failed to load wallets', 'error');
    }
  });

  // Create a fetchWallets function that's compatible with the component
  const fetchWallets = useCallback(async (params = {}) => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.WALLETS.LIST, { params });
      // Manually update the query cache
      queryClient.setQueryData(['wallets'], response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching wallets:', err);
      addNotification('Failed to load wallets', 'error');
      throw err;
    }
  }, [queryClient, addNotification]);

  // Get wallet statistics
  const getWalletStatistics = useCallback(async () => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.WALLETS.STATISTICS);
      return response.data;
    } catch (err) {
      console.error('Error fetching wallet statistics:', err);
      addNotification('Failed to load wallet statistics', 'error');
      throw err;
    }
  }, [addNotification]);

  // Update wallet status mutation
  const updateWalletStatusMutation = useMutation({
    mutationFn: async (args) => {
      const { walletId, status } = args;
      const response = await api.put(ENDPOINTS.ADMIN.WALLETS.UPDATE_STATUS(walletId), { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wallets']);
      addNotification('Wallet status updated successfully', 'success');
    },
    onError: (err) => {
      console.error('Error updating wallet status:', err);
      addNotification('Failed to update wallet status', 'error');
    }
  });

  // Update wallet balance mutation
  const updateWalletBalanceMutation = useMutation({
    mutationFn: async (args) => {
      const { instructorId, amount } = args;
      const response = await api.put(ENDPOINTS.ADMIN.WALLETS.UPDATE_BALANCE(instructorId), { amount });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wallets']);
      addNotification('Wallet balance updated successfully', 'success');
    },
    onError: (err) => {
      console.error('Error updating wallet balance:', err);
      addNotification('Failed to update wallet balance', 'error');
    }
  });

  // Create function wrappers that match the component's expected API
  const updateWalletStatus = useCallback((walletId, status) => {
    return updateWalletStatusMutation.mutateAsync({ walletId, status });
  }, [updateWalletStatusMutation]);

  const updateWalletBalance = useCallback((instructorId, amount) => {
    return updateWalletBalanceMutation.mutateAsync({ instructorId, amount });
  }, [updateWalletBalanceMutation]);

  // Fetch wallet by instructor ID
  const fetchWalletByInstructorId = useCallback(async (instructorId) => {
    try {
      // Fix: Use the DETAIL endpoint function correctly
      const response = await api.get(ENDPOINTS.ADMIN.WALLETS.DETAIL(instructorId));
      return response.data;
    } catch (err) {
      console.error(`Error fetching wallet for instructor ${instructorId}:`, err);
      addNotification('Failed to load wallet details', 'error');
      throw err;
    }
  }, [addNotification]);

  return {
    wallets,
    isLoading,
    isError,
    error,
    refetch,
    fetchWallets,
    fetchWalletByInstructorId,
    getWalletStatistics,
    updateWalletStatus,
    updateWalletBalance
  };
};

export default useWallets;