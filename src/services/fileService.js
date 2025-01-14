// src/services/FileService.js

import api from '../untils/api';
import { handleError } from '../untils/errorHandler';

/**
 * FileService handles all API interactions related to file operations.
 */
const FileService = {
  /**
   * Upload a photo to the specified entity upload endpoint.
   * @param {object} params - Contains file, entity, and signal.
   * @param {File} params.file - The file to upload.
   * @param {string} params.entity - The entity type (e.g., 'instructor', 'course', 'student').
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<string>} - The name of the uploaded file.
   */
  uploadPhoto: async ({ file, entity, signal }) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append('entity', entity);
    try {
      const response = await api.post(`/files/upload/${entity}`, formData, {
        // Không cần đặt Content-Type, axios sẽ tự động đặt nó là multipart/form-data với boundary
        withCredentials: true,
        signal,
      });
      return response.data; // e.g., "1638326400000_image.jpg"
    } catch (error) {
      console.error("Error uploading file:", error);
      throw handleError(error);
    }
  },

  /**
   * Delete a file from the specified entity directory.
   * @param {object} params - Contains filename, entity, and signal.
   * @param {string} params.filename - The name of the file to delete.
   * @param {string} params.entity - The entity type (e.g., 'instructor', 'course', 'student').
   * @param {AbortSignal} params.signal - Signal to abort the request if needed.
   * @returns {Promise<void>} Resolves when the file is deleted.
   */
  deleteFile: async ({ filename, entity, signal }) => {
    try {
      await api.delete(`/files/delete/${entity}/${filename}`, { signal });
    } catch (error) {
      console.error("Error deleting file:", error);
      throw handleError(error);
    }
  },
};

export default FileService;
