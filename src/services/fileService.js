import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';

/**
 * Upload a photo to a specific entity folder.
 */
export const uploadPhoto = async ({ file, entity, signal }) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entity', entity);
  try {
    const response = await api.post(`/files/upload/${entity}`, formData, {
      withCredentials: true,
      signal,
    });
    return response.data; // Example: "1686944000000_image.jpg"
  } catch (error) {
    console.error('Error uploading file:', error);
    throw handleApiError(error);
  }
};

/**
 * Delete a file from the specified entity folder.
 */
export const deleteFile = async ({ filename, entity, signal }) => {
  try {
    await api.delete(`/files/delete/${entity}/${filename}`, { signal });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw handleApiError(error);
  }
};

export default {
  uploadPhoto,
  deleteFile,
};