import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const AdminTransactionService = {
    getAllTransactions: async (page = 0, size = 10, type = null, status = null) => {
        const params = { page, size };
        if (type) params.type = type;
        if (status) params.status = status;
        
        const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.LIST, { params });
        return response.data;
    },

    getTransactionById: async (id) => {
        const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.DETAIL(id));
        return response.data;
    },

    getTransactionStatistics: async () => {
        const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.STATISTICS);
        return response.data;
    },

    approveWithdrawal: async (id) => {
        const response = await api.put(ENDPOINTS.ADMIN.TRANSACTIONS.APPROVE_WITHDRAWAL(id));
        return response.data;
    },

    rejectWithdrawal: async (id, reason) => {
        const response = await api.put(ENDPOINTS.ADMIN.TRANSACTIONS.REJECT_WITHDRAWAL(id), { reason });
        return response.data;
    },

    getStudentTransactionHistory: async (studentId) => {
        const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.STUDENT_HISTORY(studentId));
        return response.data;
    },

    getInstructorTransactions: async (instructorId) => {
        const response = await api.get(ENDPOINTS.ADMIN.TRANSACTIONS.INSTRUCTOR_TRANSACTIONS(instructorId));
        return response.data;
    }
};

export default AdminTransactionService;