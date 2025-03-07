import { useQuery } from '@tanstack/react-query';
import PaymentService from '../services/paymentService';

export const useTransactionHistory = (studentId) => {
  // Fetch transaction history for a student
  const {
    data: transactions,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['transactions', studentId],
    queryFn: () => PaymentService.getStudentTransactionHistory(studentId),
    enabled: !!studentId
  });

  // Fetch transaction details
  const fetchTransactionDetails = async (transactionId) => {
    try {
      return await PaymentService.getTransactionDetails(transactionId);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      throw error;
    }
  };

  return {
    transactions,
    isLoading,
    isError,
    error,
    refetch,
    fetchTransactionDetails
  };
};

// Hook for admin to view transaction statistics
export const useTransactionStatistics = () => {
  const {
    data: statistics,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['transaction-statistics'],
    queryFn: () => PaymentService.getTransactionStatistics()
  });

  return {
    statistics,
    isLoading,
    isError,
    error,
    refetch
  };
};

// Hook for admin to view student transaction history
export const useStudentTransactionHistoryAdmin = (studentId) => {
  const {
    data: transactions,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-student-transactions', studentId],
    queryFn: () => PaymentService.getStudentTransactionHistoryAdmin(studentId),
    enabled: !!studentId
  });

  return {
    transactions,
    isLoading,
    isError,
    error,
    refetch
  };
};

// Hook for admin to view instructor transactions
export const useInstructorTransactions = (instructorId) => {
  const {
    data: transactions,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['instructor-transactions', instructorId],
    queryFn: () => PaymentService.getInstructorTransactions(instructorId),
    enabled: !!instructorId
  });

  return {
    transactions,
    isLoading,
    isError,
    error,
    refetch
  };
};