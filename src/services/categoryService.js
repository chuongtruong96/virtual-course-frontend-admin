// src/services/categoryService.js
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const CategoryService = {
  fetchAll: async () => {
    const response = await api.get(ENDPOINTS.CATEGORIES.BASE);
    return response.data;
  },
  fetchById: async (id) => {
    const response = await api.get(ENDPOINTS.CATEGORIES.BY_ID(id));
    return response.data;
  },
  createCategory: async (categoryData) => {
    const response = await api.post(ENDPOINTS.CATEGORIES.BASE, categoryData);
    return response.data;
  },
  updateCategory: async (id, categoryData) => {
    const response = await api.put(ENDPOINTS.CATEGORIES.BY_ID(id), categoryData);
    return response.data;
  },
  deleteCategory: async (id) => {
    await api.delete(ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};

export default CategoryService;
