import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const InstructorManagementService = {
  // Fetch all instructors with optional filters
  fetchAllInstructors: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.size) queryParams.append('size', filters.size);
      if (filters.sort) queryParams.append('sort', filters.sort);
      if (filters.direction) queryParams.append('direction', filters.direction);
      
      const url = queryParams.toString() 
        ? `${ENDPOINTS.INSTRUCTORS.BASE}?${queryParams.toString()}`
        : ENDPOINTS.INSTRUCTORS.BASE;
        
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  },

  // Get instructor by ID
  getInstructorById: async (id) => {
    try {
      const response = await api.get(`${ENDPOINTS.INSTRUCTORS.BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching instructor with ID ${id}:`, error);
      throw error;
    }
  },

  // Get instructor profile
  getInstructorProfile: async (id) => {
    try {
      const response = await api.get(`${ENDPOINTS.INSTRUCTORS.BASE}/${id}/instructor-profile`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching instructor profile with ID ${id}:`, error);
      throw error;
    }
  },

  // Update instructor profile
  updateInstructorProfile: async (id, profileData) => {
    try {
      const response = await api.put(`${ENDPOINTS.INSTRUCTORS.BASE}/${id}`, profileData);
      return response.data;
    } catch (error) {
      console.error(`Error updating instructor with ID ${id}:`, error);
      throw error;
    }
  },

  // Get instructor statistics
  getInstructorStatistics: async (id, timeRange = 'month') => {
    try {
      const response = await api.get(`${ENDPOINTS.INSTRUCTORS.BASE}/${id}/statistics?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching instructor statistics with ID ${id}:`, error);
      throw error;
    }
  },

  // Get instructor performance metrics
  getInstructorPerformanceMetrics: async (id) => {
    try {
      const response = await api.get(`${ENDPOINTS.INSTRUCTORS.BASE}/${id}/performance-metrics`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching instructor performance metrics with ID ${id}:`, error);
      throw error;
    }
  },

  // Get instructor courses
  getInstructorCourses: async (id, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.page !== undefined) queryParams.append('page', filters.page);
      if (filters.size) queryParams.append('size', filters.size);
      
      const url = queryParams.toString() 
        ? `${ENDPOINTS.INSTRUCTORS.BASE}/${id}/courses?${queryParams.toString()}`
        : `${ENDPOINTS.INSTRUCTORS.BASE}/${id}/courses`;
        
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses for instructor with ID ${id}:`, error);
      throw error;
    }
  },

  // Get instructor tests
  getInstructorTests: async (id, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.page !== undefined) queryParams.append('page', filters.page);
      if (filters.size) queryParams.append('size', filters.size);
      
      const url = queryParams.toString() 
        ? `${ENDPOINTS.INSTRUCTORS.BASE}/${id}/tests?${queryParams.toString()}`
        : `${ENDPOINTS.INSTRUCTORS.BASE}/${id}/tests`;
        
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tests for instructor with ID ${id}:`, error);
      throw error;
    }
  },

  // Get instructor reviews
  getInstructorReviews: async (id, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.rating) queryParams.append('rating', filters.rating);
      if (filters.page !== undefined) queryParams.append('page', filters.page);
      if (filters.size) queryParams.append('size', filters.size);
      
      const url = queryParams.toString() 
        ? `${ENDPOINTS.INSTRUCTORS.BASE}/${id}/reviews?${queryParams.toString()}`
        : `${ENDPOINTS.INSTRUCTORS.BASE}/${id}/reviews`;
        
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for instructor with ID ${id}:`, error);
      throw error;
    }
  },

  // Upload instructor document
  uploadInstructorDocument: async (id, file, documentType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', documentType);
      
      const response = await api.post(`${ENDPOINTS.INSTRUCTORS.BASE}/${id}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading document for instructor with ID ${id}:`, error);
      throw error;
    }
  },

  // Get instructor documents
  getInstructorDocuments: async (id) => {
    try {
      const response = await api.get(`${ENDPOINTS.INSTRUCTORS.BASE}/${id}/documents`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching documents for instructor with ID ${id}:`, error);
      throw error;
    }
  },

  // Admin functions
  
  // Get pending instructors (for admin)
  getPendingInstructors: async () => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.INSTRUCTORS.PENDING);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending instructors:', error);
      throw error;
    }
  },

  // Approve instructor (for admin)
  approveInstructor: async (instructorId, notes = '') => {
    try {
      const response = await api.post(ENDPOINTS.ADMIN.INSTRUCTORS.APPROVE(instructorId), { notes });
      return response.data;
    } catch (error) {
      console.error(`Error approving instructor with ID ${instructorId}:`, error);
      throw error;
    }
  },

  // Reject instructor (for admin)
  rejectInstructor: async (instructorId, reason) => {
    try {
      const response = await api.post(ENDPOINTS.ADMIN.INSTRUCTORS.REJECT(instructorId), { reason });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting instructor with ID ${instructorId}:`, error);
      throw error;
    }
  }
};

export default InstructorManagementService;