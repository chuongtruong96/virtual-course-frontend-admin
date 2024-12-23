// src/services/categoryService.js

import api from "../untils/api";

/**
 * CategoryService handles all API interactions related to categories.
 */
const CategoryService = {
    /**
     * Fetch all categories from the API.
     * @returns {Promise<Array>} The list of categories.
     */
    fetchCategories: async () => {
        try {
            const response = await api.get("/categories");
            return response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    },

    /**
     * Fetch a single category by ID from the API.
     * @param {number} categoryId - The ID of the category.
     * @returns {Promise<Object>} The category data.
     */
    fetchCategoryById: async (categoryId) => {
        try {
            const response = await api.get(`/categories/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching category by ID:", error);
            throw new Error("Failed to fetch category. Please try again.");
        }
    },

    /**
     * Create a new category.
     * @param {Object} categoryData - The category data to add.
     * @returns {Promise<Object>} The added category.
     */
    addCategory: async (categoryData) => {
        try {
            const response = await api.post("/categories", categoryData);
            return response.data;
        } catch (error) {
            console.error("Error adding category:", error);
            throw error;
        }
    },

    /**
     * Edit an existing category.
     * @param {number} categoryId - The ID of the category to edit.
     * @param {Object} updatedData - The updated category data.
     * @returns {Promise<Object>} The updated category.
     */
    editCategory: async (categoryId, updatedData) => {
        try {
            const response = await api.put(`/categories/${categoryId}`, updatedData);
            return response.data;
        } catch (error) {
            console.error("Error editing category:", error);
            throw error;
        }
    },

    /**
     * Delete a category.
     * @param {number} categoryId - The ID of the category to delete.
     * @returns {Promise<void>} Resolves when the category is deleted.
     */
    deleteCategory: async (categoryId) => {
        try {
            await api.delete(`/categories/${categoryId}`);
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    },
};

export default CategoryService;
