// src/services/studentService.js
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const StudentService = {
  fetchAll: async () => {
    try {
      const response = await api.get(ENDPOINTS.STUDENTS.BASE);
      return response;
    } catch (error) {
      console.error('Error in fetchAll:', error);
      throw error;
    }
  },

  fetchById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.STUDENTS.BY_ID(id));
      return response;
    } catch (error) {
      console.error('Error in fetchById:', error);
      throw error;
    }
  }
};

export default StudentService;
