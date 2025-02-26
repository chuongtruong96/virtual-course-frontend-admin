import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const AdminService = {
  // Statistics
  getStatistics: async (filter = 'allTime', model = 'all') => {
    try {
      const response = await api.get(`${ENDPOINTS.ADMIN.STATISTICS}?filter=${filter}&model=${model}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  getTrends: async (filter = 'allTime') => {
    try {
      const response = await api.get(`${ENDPOINTS.ADMIN.TRENDS}?filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trends:', error);
      throw error;
    }
  },

  // Course Management
  getPendingCourses: async () => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.COURSES.PENDING);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending courses:', error);
      throw error;
    }
  },

  approveCourse: async (courseId, notes) => {
    try {
      const response = await api.post(ENDPOINTS.ADMIN.COURSES.APPROVE(courseId), { notes });
      return response.data;
    } catch (error) {
      console.error('Error approving course:', error);
      throw error;
    }
  },

  rejectCourse: async (courseId, reason) => {
    try {
      const response = await api.post(ENDPOINTS.ADMIN.COURSES.REJECT(courseId), { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting course:', error);
      throw error;
    }
  },

  // Instructor Management
  getPendingInstructors: async () => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.INSTRUCTORS.PENDING);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending instructors:', error);
      throw error;
    }
  },

  approveInstructor: async (accountId) => {
    try {
      const response = await api.post(ENDPOINTS.ADMIN.INSTRUCTORS.APPROVE(accountId));
      return response.data;
    } catch (error) {
      console.error('Error approving instructor:', error);
      throw error;
    }
  },

  rejectInstructor: async (accountId, reason) => {
    try {
      const response = await api.post(ENDPOINTS.ADMIN.INSTRUCTORS.REJECT(accountId), { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting instructor:', error);
      throw error;
    }
  },

  // Account Management
  getAccountsByStatus: async (status) => {
    try {
      // Always use the by-status endpoint since that's what the backend expects
      const response = await api.get(`${ENDPOINTS.ADMIN.ACCOUNTS.BY_STATUS}?status=${status === 'all' ? 'ACTIVE' : status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts by status:', error);
      throw error;
    }
  },

  updateAccountStatus: async (accountId, status) => {
    try {
      const response = await api.put(ENDPOINTS.ADMIN.ACCOUNTS.UPDATE_STATUS(accountId), { status });
      return response.data;
    } catch (error) {
      console.error('Error updating account status:', error);
      throw error;
    }
  }
};

export default AdminService;