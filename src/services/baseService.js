// src/services/baseService.js
import api from '../utils/api';
import { handleApiError } from '../utils/errorHandler';

/**
 * Creates a basic CRUD service based on the provided base endpoint.
 */
const createCRUDService = (baseEndpoint) => ({
  fetchAll: async () => {
    try {
      const response = await api.get(baseEndpoint);
      return response.data;
    } catch (error) {
      console.error(`Error fetching all from ${baseEndpoint}:`, error);
      throw handleApiError(error);
    }
  },
  fetchById: async ({ id }) => {
    try {
      const response = await api.get(`${baseEndpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ID ${id} from ${baseEndpoint}:`, error);
      throw handleApiError(error);
    }
  },
  add: async (data) => {
    try {
      const response = await api.post(baseEndpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error adding to ${baseEndpoint}:`, error);
      throw handleApiError(error);
    }
  },
  edit: async ({ id, data }) => {
    try {
      const response = await api.put(`${baseEndpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error editing ID ${id} from ${baseEndpoint}:`, error);
      throw handleApiError(error);
    }
  },
  delete: async ({ id }) => {
    try {
      await api.delete(`${baseEndpoint}/${id}`);
    } catch (error) {
      console.error(`Error deleting ID ${id} from ${baseEndpoint}:`, error);
      throw handleApiError(error);
    }
  },
});

export default createCRUDService;
