// src/services/CategoryService.js

import createCRUDService from './baseService';
import api from '../untils/api';
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler';

/**
 * CategoryService handles all API interactions related to categories.
 * Extends baseCRUDService with additional category-specific methods.
 */
const categoryCRUD = createCRUDService(ENDPOINTS.CATEGORIES.BASE);

const CategoryService = {
  ...categoryCRUD,

  /**
   * Fetch a category by ID.
   * @param {object} params - Contains id and signal.
   * @param {number} params.id - The ID of the category.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<Object>} The category data.
   */
  fetchCategoryById: async ({ id, signal }) => {
    try {
      const response = await api.get(`${ENDPOINTS.CATEGORIES.BASE}/${id}`, { signal });
      return response.data;
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw handleError(error);
    }
  },

  /**
   * Add a new category.
   * @param {object} params - Contains data and signal.
   * @param {object} params.data - The category data to add.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<Object>} The added category.
   */
  addCategory: async ({ data, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.CATEGORIES.BASE, data, { signal });
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw handleError(error);
    }
  },

  /**
   * Edit an existing category.
   * @param {object} params - Contains id, data, and signal.
   * @param {number} params.id - The ID of the category to edit.
   * @param {object} params.data - The updated category data.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<Object>} The updated category.
   */
  editCategory: async ({ id, data, signal }) => {
    try {
      const response = await api.put(`${ENDPOINTS.CATEGORIES.BASE}/${id}`, data, { signal });
      return response.data;
    } catch (error) {
      console.error('Error editing category:', error);
      throw handleError(error);
    }
  },

  /**
   * Delete a category.
   * @param {object} params - Contains id and signal.
   * @param {number} params.id - The ID of the category to delete.
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<void>} Resolves when the category is deleted.
   */
  deleteCategory: async ({ id, signal }) => {
    try {
      await api.delete(`${ENDPOINTS.CATEGORIES.BASE}/${id}`, { signal });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw handleError(error);
    }
  },
};

export default CategoryService;
