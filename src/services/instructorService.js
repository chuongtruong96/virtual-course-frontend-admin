// src/services/instructorService.js

import api from "../untils/api";

/**
 * InstructorService handles all API interactions related to instructors.
 */
const InstructorService = {
    /**
     * Fetch all instructors from the API.
     * @returns {Promise<Array>} The list of instructors.
     */
    fetchInstructors: async () => {
        try {
            const response = await api.get("/instructors");
            return response.data;
        } catch (error) {
            console.error("Error fetching instructors:", error);
            throw error;
        }
    },

    /**
     * Fetch a single instructor by ID from the API.
     * @param {number} instructorId - The ID of the instructor.
     * @returns {Promise<Object>} The instructor data.
     */
    fetchInstructorById: async (instructorId) => {
        try {
            const response = await api.get(`/instructors/${instructorId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching instructor by ID:", error);
            throw new Error("Failed to fetch instructor. Please try again.");
        }
    },

    /**
 * Create a new instructor for a specific account.
 * @param {number} accountId - The ID of the account to associate with the instructor.
 * @param {Object} instructorData - The instructor data to add (excluding accountId).
 * @returns {Promise<Object>} The added instructor.
 */
    addInstructor : async (accountId, instructorData) => {
    try {
        const response = await api.post(`/instructors/add-instructor/${accountId}`, instructorData,{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding instructor:", error.response ? error.response.data : error.message);
        throw error;
    }

    },
    /**
     * Edit an existing instructor.
     * @param {number} instructorId - The ID of the instructor to edit.
     * @param {Object} updatedData - The updated instructor data.
     * @returns {Promise<Object>} The updated instructor.
     */
    editInstructor: async (instructorId, updatedData) => {
        try {
            const response = await api.put(`/instructors/${instructorId}`, updatedData);
            return response.data;
        } catch (error) {
            console.error("Error editing instructor:", error);
            throw error;
        }
    },

    /**
     * Delete an instructor.
     * @param {number} instructorId - The ID of the instructor to delete.
     * @returns {Promise<void>} Resolves when the instructor is deleted.
     */
    deleteInstructor: async (instructorId) => {
        try {
            await api.delete(`/instructors/${instructorId}`);
        } catch (error) {
            console.error("Error deleting instructor:", error);
            throw error;
        }
    },

    /**
     * Disable an instructor (set status to inactive).
     * @param {number} instructorId - The ID of the instructor to disable.
     * @returns {Promise<void>} Resolves when the instructor is disabled.
     */
    disableInstructor: async (instructorId) => {
        try {
            await api.put(`/instructors/${instructorId}/disable`);
        } catch (error) {
            console.error("Error disabling instructor:", error);
            throw error;
        }
    },

    /**
     * Enable an instructor (set status to active).
     * @param {number} instructorId - The ID of the instructor to enable.
     * @returns {Promise<void>} Resolves when the instructor is enabled.
     */
    enableInstructor: async (instructorId) => {
        try {
            await api.put(`/instructors/${instructorId}/enable`);
        } catch (error) {
            console.error("Error enabling instructor:", error);
            throw error;
        }
    },
};

export default InstructorService;
