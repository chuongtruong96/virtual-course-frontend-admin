// src/services/categoryService.js
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const CategoryService = {
  // Get all categories (without stats)
  fetchAll: async () => {
    const response = await api.get(ENDPOINTS.CATEGORIES.BASE);
    return response.data;
  },
  
  // Get all categories with stats
  fetchAllWithStats: async () => {
    const response = await api.get(ENDPOINTS.CATEGORIES.WITH_STATS);
    return response.data;
  },
  
  // In CategoryService.js
fetchCategoryWithStatsById: async (id) => {
  if (!id) {
    throw new Error("Category ID is required");
  }
  console.log("Fetching category with stats by ID:", id); // Debug log
  const response = await api.get(ENDPOINTS.CATEGORIES.BY_ID_WITH_STATS(id));
  return response.data;
},

fetchCategoryById: async (id) => {
  if (!id) {
    throw new Error("Category ID is required");
  }
  console.log("Fetching category by ID:", id); // Debug log
  const response = await api.get(ENDPOINTS.CATEGORIES.BY_ID(id));
  return response.data;
},
  
  // Create a new category
  addCategory: async (categoryData) => {
    const response = await api.post(ENDPOINTS.CATEGORIES.BASE, categoryData);
    return response.data;
  },
  
  // Update an existing category
  editCategory: async (id, categoryData) => {
    const response = await api.put(ENDPOINTS.CATEGORIES.BY_ID(id), categoryData);
    return response.data;
  },
  
  // Delete a category
  deleteCategory: async (id) => {
    await api.delete(ENDPOINTS.CATEGORIES.BY_ID(id));
  }
};

export default CategoryService;