// src/services/instructorService.js
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const InstructorService = {
  // Regular instructor endpoints
  fetchAll: async () => {
    try {
      const response = await api.get(ENDPOINTS.INSTRUCTORS.BASE);
      return response.data;
    } catch (error) {
      console.error('Error fetching all instructors:', error);
      throw error;
    }
  },

  fetchById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.INSTRUCTORS.BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor:', error);
      throw error;
    }
  },

  getStatistics: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.INSTRUCTORS.STATISTICS(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor statistics:', error);
      throw error;
    }
  },

  // Admin instructor endpoints
  getPendingInstructors: async () => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.INSTRUCTORS.PENDING);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending instructors:', error);
      throw error;
    }
  },

  approveInstructor: async (instructorId) => {
    try {
      const response = await api.post(ENDPOINTS.ADMIN.INSTRUCTORS.APPROVE(instructorId));
      return response.data;
    } catch (error) {
      console.error('Error approving instructor:', error);
      throw error;
    }
  },

  rejectInstructor: async (instructorId, reason) => {
    try {
      const response = await api.post(ENDPOINTS.ADMIN.INSTRUCTORS.REJECT(instructorId), { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting instructor:', error);
      throw error;
    }
  }
};

export default InstructorService;
