import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const AdminTransactionService = {
    getAllTransactions: async (page = 0, size = 10, type = null, status = null) => {
        try {
            // Build query parameters
            let queryParams = `?page=${page}&size=${size}`;
            if (type && type !== 'all') queryParams += `&type=${type}`;
            if (status && status !== 'all') queryParams += `&status=${status}`;
            
            // Use the correct endpoint from the config
            const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.LIST + queryParams);
            return response.data;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    },

    getTransactionById: async (id) => {
        try {
            // Use the correct endpoint from the config
            const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.DETAIL(id));
            
            // Ensure we handle null values properly
            const transaction = response.data;
            
            // Check if any expected fields are null and provide defaults
            if (!transaction.courses) transaction.courses = [];
            if (!transaction.paymentMethod) transaction.paymentMethod = '';
            if (!transaction.status) transaction.status = '';
            
            return transaction;
        } catch (error) {
            console.error(`Error fetching transaction ${id}:`, error);
            throw error;
        }
    },

    getTransactionStatistics: async () => {
        try {
            // Use the correct endpoint from the config
            const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.STATISTICS);
            return response.data;
        } catch (error) {
            console.error('Error fetching transaction statistics:', error);
            throw error;
        }
    },

    getMonthlyTrends: async () => {
        try {
            // Use the correct endpoint from the config
            const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.MONTHLY_TRENDS);
            return response.data;
        } catch (error) {
            console.error('Error fetching monthly trends:', error);
            throw error;
        }
    },

    approveWithdrawal: async (id) => {
        try {
            // Use the correct endpoint from the config
            const response = await api.post(ENDPOINTS.ADMIN.TRANSACTIONS.APPROVE_WITHDRAWAL(id));
            return response.data;
        } catch (error) {
            console.error(`Error approving withdrawal ${id}:`, error);
            throw error;
        }
    },

    rejectWithdrawal: async (id, reason) => {
        try {
            // Use the correct endpoint from the config
            const response = await api.post(ENDPOINTS.ADMIN.TRANSACTIONS.REJECT_WITHDRAWAL(id), { reason });
            return response.data;
        } catch (error) {
            console.error(`Error rejecting withdrawal ${id}:`, error);
            throw error;
        }
    },

    getStudentTransactionHistory: async (studentId) => {
        try {
            // Use the correct endpoint from the config
            const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.STUDENT_HISTORY(studentId));
            
            // Process the response to ensure all expected fields are present
            const transactions = response.data;
            
            // If transactions is an array, ensure each item has the expected fields
            if (Array.isArray(transactions)) {
                return transactions.map(transaction => ({
                    ...transaction,
                    courses: transaction.courses || [],
                    paymentMethod: transaction.paymentMethod || '',
                    status: transaction.status || ''
                }));
            }
            
            return transactions;
        } catch (error) {
            console.error(`Error fetching student transaction history for student ${studentId}:`, error);
            throw error;
        }
    },

    getInstructorTransactions: async (instructorId) => {
        try {
            // Use the correct endpoint from the config
            const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.INSTRUCTOR_TRANSACTIONS(instructorId));
            
            // Process the response to ensure all expected fields are present
            const transactions = response.data;
            
            // If transactions is an array, ensure each item has the expected fields
            if (Array.isArray(transactions)) {
                return transactions.map(transaction => ({
                    ...transaction,
                    courses: transaction.courses || [],
                    paymentMethod: transaction.paymentMethod || '',
                    status: transaction.status || ''
                }));
            }
            
            return transactions;
        } catch (error) {
            console.error(`Error fetching instructor transactions for instructor ${instructorId}:`, error);
            throw error;
        }
    }
};

export default AdminTransactionService;