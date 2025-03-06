import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const useTransactions = (initialPage = 0, initialSize = 10, initialType = null, initialStatus = null) => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);
  
  // Add state for statistics and monthlyTrends
  const [statistics, setStatistics] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);

  // Fetch transactions with pagination and filters
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['transactions', initialPage, initialSize, initialType, initialStatus],
    queryFn: async () => {
      const params = {
        page: initialPage,
        size: initialSize
      };
      
      if (initialType) params.type = initialType;
      if (initialStatus) params.status = initialStatus;

      const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.LIST, { params });
      return response.data;
    },
    onError: (err) => {
      console.error('Error fetching transactions:', err);
      addNotification('Failed to load transactions', 'error');
    }
  });

  // Create a fetchTransactions function that's compatible with the component
  const fetchTransactions = useCallback(async (params = {}) => {
    try {
      // Xử lý tham số phẳng thay vì lồng nhau
      const queryParams = {};
      
      // Xử lý trường hợp khi params chứa một đối tượng 'page' lồng nhau
      if (params.page && typeof params.page === 'object') {
        // Trích xuất các giá trị từ đối tượng lồng nhau và làm phẳng chúng
        queryParams.page = params.page.page !== undefined ? params.page.page : 0;
        queryParams.size = params.page.size !== undefined ? params.page.size : 10;
        queryParams.type = params.page.type || '';
        queryParams.status = params.page.status || '';
      } else {
        // Xử lý tham số phẳng
        queryParams.page = params.page !== undefined ? params.page : 0;
        queryParams.size = params.size !== undefined ? params.size : 10;
        queryParams.type = params.type || '';
        queryParams.status = params.status || '';
      }

      // Loại bỏ các tham số rỗng để làm sạch URL
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.LIST, { params: queryParams });
      
      // Cập nhật cache query
      queryClient.setQueryData(
        ['transactions', queryParams.page, queryParams.size, queryParams.type, queryParams.status], 
        response.data
      );
      
      return response.data;
    } catch (err) {
      console.error('Error fetching transactions:', err);
      addNotification('Failed to load transactions', 'error');
      throw err;
    }
  }, [queryClient, addNotification]);

  // Fetch transaction by ID
  const fetchTransactionById = useCallback(async (id) => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.DETAIL(id));
      return response.data;
    } catch (err) {
      console.error(`Error fetching transaction ${id}:`, err);
      addNotification('Failed to load transaction details', 'error');
      throw err;
    }
  }, [addNotification]);

  // Fetch transaction statistics
  const fetchTransactionStatistics = useCallback(async () => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.STATISTICS);
      setStatistics(response.data); // Set statistics state
      return response.data;
    } catch (err) {
      console.error('Error fetching transaction statistics:', err);
      addNotification('Failed to load transaction statistics', 'error');
      throw err;
    }
  }, [addNotification]);

  // Fetch monthly transaction trends
  const fetchMonthlyTransactionTrends = useCallback(async () => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.MONTHLY_TRENDS);
      setMonthlyTrends(response.data); // Set monthlyTrends state
      return response.data;
    } catch (err) {
      console.error('Error fetching monthly transaction trends:', err);
      addNotification('Failed to load monthly transaction trends', 'error');
      throw err;
    }
  }, [addNotification]);

  // Approve withdrawal mutation
  const approveWithdrawalMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.put(ENDPOINTS.ADMIN.TRANSACTIONS.APPROVE_WITHDRAWAL(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      addNotification('Withdrawal approved successfully', 'success');
    },
    onError: (err) => {
      console.error('Error approving withdrawal:', err);
      addNotification('Failed to approve withdrawal', 'error');
    }
  });

  // Reject withdrawal mutation
  const rejectWithdrawalMutation = useMutation({
    mutationFn: async ({ id, reason }) => {
      const response = await api.put(ENDPOINTS.ADMIN.TRANSACTIONS.REJECT_WITHDRAWAL(id), { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      addNotification('Withdrawal rejected successfully', 'success');
    },
    onError: (err) => {
      console.error('Error rejecting withdrawal:', err);
      addNotification('Failed to reject withdrawal', 'error');
    }
  });

  // Create function wrappers that match the component's expected API
  const approveWithdrawal = useCallback((id) => {
    return approveWithdrawalMutation.mutateAsync(id);
  }, [approveWithdrawalMutation]);

  const rejectWithdrawal = useCallback(({ id, reason }) => {
    return rejectWithdrawalMutation.mutateAsync({ id, reason });
  }, [rejectWithdrawalMutation]);

  // Initial data fetch for statistics and trends
  useEffect(() => {
    fetchTransactionStatistics().catch(console.error);
    fetchMonthlyTransactionTrends().catch(console.error);
  }, [fetchTransactionStatistics, fetchMonthlyTransactionTrends]);

  return {
    transactions: data?.content || [],
    totalPages: data?.totalPages || 0,
    totalItems: data?.totalItems || 0,
    currentPage: data?.currentPage || 0,
    statistics, // Now properly defined
    monthlyTrends, // Now properly defined
    isLoading,
    isError,
    error,
    refetch,
    fetchTransactions,
    fetchTransactionById,
    fetchMonthlyTransactionTrends,
    fetchTransactionStatistics,
    approveWithdrawal,
    rejectWithdrawal
  };
};

export default useTransactions;