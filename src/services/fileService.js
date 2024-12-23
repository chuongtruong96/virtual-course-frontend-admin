// src/services/fileService.js

import api from "../untils/api";

/**
 * Uploads a file to the specified entity upload endpoint.
 * @param {File} file - The file to upload.
 * @param {string} entity - The entity type (e.g., 'instructor', 'course', 'student').
 * @returns {Promise<string>} - The name of the uploaded file.
 */
export const uploadPhoto = async (file, entity) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await api.post(`/files/upload/${entity}`, formData, {
            // Không cần đặt Content-Type, axios sẽ tự động đặt nó là multipart/form-data với boundary
            withCredentials: true,
        });
        return response.data; // e.g., "1638326400000_image.jpg"
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};
