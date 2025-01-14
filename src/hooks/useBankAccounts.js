// src/hooks/useBankAccounts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BankAccountService from '../services/bankAccountService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useBankAccounts = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch all bank accounts
  const {
    data: bankAccounts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['bankAccounts'],
    queryFn: () => BankAccountService.fetchBankAccounts({ signal: undefined }),
  });

  // Add Bank Account
  const addBankAccountMutation = useMutation({
    mutationFn: ({ data }) => BankAccountService.addBankAccount({ data, signal: undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries(['bankAccounts']);
      addNotification('Bank account added successfully!', 'success');
    },
    onError: (err) => {
      const message = err.response?.data?.message || 'Failed to add bank account.';
      addNotification(message, 'danger');
    },
  });

  // Edit Bank Account
  const editBankAccountMutation = useMutation({
    mutationFn: ({ id, data }) => BankAccountService.editBankAccount({ id, data, signal: undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries(['bankAccounts']);
      addNotification('Bank account updated successfully!', 'success');
    },
    onError: (err) => {
      const message = err.response?.data?.message || 'Failed to update bank account.';
      addNotification(message, 'danger');
    },
  });

  // Delete Bank Account
  const deleteBankAccountMutation = useMutation({
    mutationFn: ({ id }) => BankAccountService.deleteBankAccount({ id, signal: undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries(['bankAccounts']);
      addNotification('Bank account deleted successfully!', 'success');
    },
    onError: (err) => {
      const message = err.response?.data?.message || 'Failed to delete bank account.';
      addNotification(message, 'danger');
    },
  });

  return {
    bankAccounts,
    isLoading,
    isError,
    error,

    addBankAccount: addBankAccountMutation.mutate,
    editBankAccount: editBankAccountMutation.mutate,
    deleteBankAccount: deleteBankAccountMutation.mutate,
  };
};

export default useBankAccounts;
