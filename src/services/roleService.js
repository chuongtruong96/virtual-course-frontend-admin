// src/services/roleService.js

import createCRUDService from './baseService';
import api from '../untils/api'; // Sửa từ 'untils' thành 'utils'
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler'; // Sửa từ 'untils' thành 'utils'

const roleCRUD = createCRUDService(ENDPOINTS.ROLES.BASE);

const roleService = {
  ...roleCRUD,

  // Phương thức để xóa role
  deleteRole: async ({ id, signal }) => {
    // Nhận đối tượng chứa id và signal
    try {
      await api.delete(`${ENDPOINTS.ROLES.BASE}/${id}`, { signal });
    } catch (error) {
      console.error('Error deleting role:', error);
      throw handleError(error);
    }
  }
};

export default roleService;
