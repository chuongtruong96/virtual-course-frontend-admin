// src/services/courseService.js

import api from "../untils/api";

/**
 * CourseService handles all API interactions related to courses.
 */
const CourseService = {
    /**
     * Fetch all courses from the API.
     * @returns {Promise<Array>} The list of courses.
     */
    fetchCourses: async () => {
        try {
            const response = await api.get("/courses");
            return response.data;
        } catch (error) {
            console.error("Error fetching courses:", error);
            throw error;
        }
    },

    /**
     * Fetch a single course by ID from the API.
     * @param {number} courseId - The ID of the course.
     * @returns {Promise<Object>} The course data.
     */
    fetchCourseById: async (courseId) => {
        try {
            const response = await api.get(`/courses/${courseId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching course by ID:", error);
            throw new Error("Failed to fetch course. Please try again.");
        }
    },

    /**
     * Create a new course.
     * @param {Object} courseData - The course data to add.
     * @returns {Promise<Object>} The added course.
     */
    addCourse: async (courseData) => {
        try {
            const response = await api.post("/courses", courseData);
            return response.data;
        } catch (error) {
            console.error("Error adding course:", error);
            throw error;
        }
    },

    /**
     * Edit an existing course.
     * @param {number} courseId - The ID of the course to edit.
     * @param {Object} updatedData - The updated course data.
     * @returns {Promise<Object>} The updated course.
     */
    editCourse: async (courseId, updatedData) => {
        try {
            const response = await api.put(`/courses/${courseId}`, updatedData);
            return response.data;
        } catch (error) {
            console.error("Error editing course:", error);
            throw error;
        }
    },

    /**
     * Delete a course.
     * @param {number} courseId - The ID of the course to delete.
     * @returns {Promise<void>} Resolves when the course is deleted.
     */
    deleteCourse: async (courseId) => {
        try {
            await api.delete(`/courses/${courseId}`);
        } catch (error) {
            console.error("Error deleting course:", error);
            throw error;
        }
    },

    /**
     * Enable a course (set status to active).
     * @param {number} courseId - The ID of the course to enable.
     * @returns {Promise<void>} Resolves when the course is enabled.
     */
    enableCourse: async (courseId) => {
        try {
            await api.put(`/courses/${courseId}/enable`);
        } catch (error) {
            console.error("Error enabling course:", error);
            throw error;
        }
    },

    /**
     * Disable a course (set status to inactive).
     * @param {number} courseId - The ID of the course to disable.
     * @returns {Promise<void>} Resolves when the course is disabled.
     */
    disableCourse: async (courseId) => {
        try {
            await api.put(`/courses/${courseId}/disable`);
        } catch (error) {
            console.error("Error disabling course:", error);
            throw error;
        }
    },
};

export default CourseService;
