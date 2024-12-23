// src/services/accountService.js

import api from "../untils/api";

/**
 * Fetch all accounts from the API.
 * @returns {Promise<Array>} The list of accounts.
 */
export const fetchAccounts = async () => {
  try {
    const response = await api.get("/accounts");
    return response.data.map((account) => ({
      ...account,
      roles: account.roles && account.roles.length > 0 ? account.roles.join(", ") : "No Roles",
    }));
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

/**
 * Add a new account.
 * @param {Object} account - The account data to add.
 * @returns {Promise<Object>} The added account.
 */
export const addAccount = async (account) => {
  try {
    const response = await api.post("/accounts", account);
    return response.data;
  } catch (error) {
    console.error("Error adding account:", error);
    throw error;
  }
};

/**
 * Edit an existing account.
 * @param {number} accountId - The ID of the account to edit.
 * @param {Object} accountData - The updated account data.
 * @returns {Promise<Object>} The updated account.
 */
export const editAccount = async (accountId, accountData) => {
  try {
    const response = await api.put(`/accounts/${accountId}`, accountData);
    return response.data;
  } catch (error) {
    console.error("Error editing account:", error);
    throw error;
  }
};

/**
 * Delete an account.
 * @param {number} accountId - The ID of the account to delete.
 * @returns {Promise<void>} Resolves when the account is deleted.
 */
export const deleteAccount = async (accountId) => {
  try {
    await api.delete(`/accounts/${accountId}`);
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

/**
 * Fetch account details by ID.
 * @param {number} accountId - The ID of the account to fetch.
 * @returns {Promise<Object>} The account details.
 */
export const fetchAccountDetails = async (accountId) => {
  try {
    const response = await api.get(`/accounts/${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching account details:", error);
    throw error;
  }
};

/**
 * Disable an account (set status to inactive).
 * @param {number} accountId - The ID of the account to disable.
 * @returns {Promise<void>} Resolves when the account is disabled.
 */
export const disableAccount = async (accountId) => {
  try {
    await api.put(`/accounts/${accountId}/disable`);
  } catch (error) {
    console.error("Error disabling account:", error);
    throw error;
  }
};

/**
 * Enable an account (set status to active).
 * @param {number} accountId - The ID of the account to enable.
 * @returns {Promise<void>} Resolves when the account is enabled.
 */
export const enableAccount = async (accountId) => {
  try {
    await api.put(`/accounts/${accountId}/enable`);
  } catch (error) {
    console.error("Error enabling account:", error);
    throw error;
  }
};

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
