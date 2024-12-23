// src/services/roleService.js
import api from "../untils/api";

/**
 * Fetch all roles from the API.
 * @returns {Promise<Array>} The list of roles.
 */
export const fetchRoles = async () => {
  try {
    const response = await api.get("/roles");
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

/**
 * Add a new role.
 * @param {Object} role - The role data to add.
 * @returns {Promise<Object>} The added role.
 */
export const addRole = async (role) => {
  try {
    const response = await api.post("/roles", role);
    return response.data;
  } catch (error) {
    console.error("Error adding role:", error);
    throw error;
  }
};

/**
 * Edit an existing role.
 * @param {number} roleId - The ID of the role to edit.
 * @param {Object} roleData - The updated role data.
 * @returns {Promise<Object>} The updated role.
 */
export const editRole = async (roleId, roleData) => {
  try {
    const response = await api.put(`/roles/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    console.error("Error editing role:", error);
    throw error;
  }
};

/**
 * Delete a role.
 * @param {number} roleId - The ID of the role to delete.
 * @returns {Promise<void>} Resolves when the role is deleted.
 */
export const deleteRole = async (roleId) => {
  try {
    await api.delete(`/roles/${roleId}`);
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};
