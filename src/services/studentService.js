// src/services/studentService.js

import api from "../untils/api"; // Đảm bảo đường dẫn đúng

/**
 * StudentService handles all API interactions related to students.
 */
const StudentService = {
    /**
     * Fetch all students from the API.
     * @returns {Promise<Array>} The list of students.
     */
    fetchStudents: async () => {
        try {
            const response = await api.get("/students");
            return response.data;
        } catch (error) {
            console.error("Error fetching students:", error.response ? error.response.data : error.message);
            throw error;
        }
    },

    /**
     * Fetch a single student by ID from the API.
     * @param {number} studentId - The ID of the student.
     * @returns {Promise<Object>} The student data.
     */
    fetchStudentById: async (studentId) => {
        try {
            const response = await api.get(`/students/${studentId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching student by ID:", error.response ? error.response.data : error.message);
            throw new Error("Failed to fetch student. Please try again.");
        }
    },

   /**
     * Add a new student for a specific account.
     * @param {number} accountId - The ID of the account to associate with the student.
     * @param {Object} studentData - The student data to add (excluding accountId).
     * @returns {Promise<Object>} The added student.
     */
   addStudent: async (accountId, studentData) => {
    try {
        const response = await api.post(`/students/add-student/${accountId}`, studentData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding student:", error.response ? error.response.data : error.message);
        throw error;
    }
},

    /**
     * Edit an existing student.
     * @param {number} studentId - The ID of the student to edit.
     * @param {Object} updatedData - The updated student data.
     * @returns {Promise<Object>} The updated student.
     */
    editStudent: async (studentId, updatedData) => {
        try {
            const response = await api.put(`/students/${studentId}`, updatedData);
            return response.data;
        } catch (error) {
            console.error("Error editing student:", error.response ? error.response.data : error.message);
            throw error;
        }
    },

    /**
     * Update the status of a student (ACTIVE/INACTIVE).
     * @param {number} id - The ID of the student.
     * @param {string} status - The new status ("ACTIVE" or "INACTIVE").
     * @returns {Promise<Object>} The updated student.
     */
    updateStudentStatus: async (id, status) => {
        try {
            const response = await api.put(`/students/${id}`, { statusStudent: status });
            return response.data;
        } catch (error) {
            console.error("Error updating student status:", error.response ? error.response.data : error.message);
            throw error;
        }
    },

    /**
     * Enable a student (set status to ACTIVE).
     * @param {number} id - The ID of the student.
     * @returns {Promise<Object>} The updated student.
     */
    enableStudent: async (id) => {
        return await StudentService.updateStudentStatus(id, 'ACTIVE');
    },

    /**
     * Disable a student (set status to INACTIVE).
     * @param {number} id - The ID of the student.
     * @returns {Promise<Object>} The updated student.
     */
    disableStudent: async (id) => {
        return await StudentService.updateStudentStatus(id, 'INACTIVE');
    },

    /**
     * Delete a student.
     * @param {number} id - The ID of the student.
     * @returns {Promise<void>} Resolves when the student is deleted.
     */
    deleteStudent: async (id) => {
        try {
            await api.delete(`/students/${id}`);
        } catch (error) {
            console.error("Error deleting student:", error.response ? error.response.data : error.message);
            throw error;
        }
    },
};

export default StudentService;
