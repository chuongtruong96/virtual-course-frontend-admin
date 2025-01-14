// src/services/ticketService.js

import api from '../untils/api'; // Sửa từ 'untils' thành 'utils'
import { ENDPOINTS } from '../config/endpoint'; // Sửa từ 'endpoint' thành 'endpoints'
import { handleError } from '../untils/errorHandler'; // Sửa từ 'untils' thành 'utils'

const TICKET_BASE = ENDPOINTS.TICKETS.BASE;

const ticketService = {
  /**
   * Create a new ticket.
   * @param {object} ticketData - Dữ liệu ticket mới.
   * @param {AbortSignal} signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Ticket đã tạo.
   */
  createTicket: async (ticketData, signal) => {
    try {
      const res = await api.post(TICKET_BASE, ticketData, { signal });
      return res.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw handleError(error);
    }
  },

  /**
   * Fetch all tickets.
   * @param {AbortSignal} signal - Signal để hủy request nếu cần.
   * @returns {Promise<Array>} Danh sách tất cả các tickets.
   */
  fetchAllTickets: async (signal) => {
    try {
      const res = await api.get(TICKET_BASE, { signal });
      return res.data;
    } catch (error) {
      console.error('Error fetching all tickets:', error);
      throw handleError(error);
    }
  },

  /**
   * Fetch a ticket by ID.
   * @param {number} ticketId - ID của ticket.
   * @param {AbortSignal} signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Ticket đã fetch.
   */
  fetchTicketById: async (ticketId, signal) => {
    try {
      const res = await api.get(ENDPOINTS.TICKETS.BY_ID(ticketId), { signal });
      return res.data;
    } catch (error) {
      console.error(`Error fetching ticket ${ticketId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Resolve a ticket.
   * @param {number} ticketId - ID của ticket cần resolve.
   * @param {AbortSignal} signal - Signal để hủy request nếu cần.
   * @returns {Promise<void>}
   */
  resolveTicket: async (ticketId, signal) => {
    try {
      await api.put(ENDPOINTS.TICKETS.RESOLVE(ticketId), {}, { signal });
    } catch (error) {
      console.error(`Error resolving ticket ${ticketId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Close a ticket.
   * @param {number} ticketId - ID của ticket cần close.
   * @param {AbortSignal} signal - Signal để hủy request nếu cần.
   * @returns {Promise<void>}
   */
  closeTicket: async (ticketId, signal) => {
    try {
      await api.put(ENDPOINTS.TICKETS.CLOSE(ticketId), {}, { signal });
    } catch (error) {
      console.error(`Error closing ticket ${ticketId}:`, error);
      throw handleError(error);
    }
  },
};

export default ticketService;
