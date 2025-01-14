// src/services/ReviewService.js

import createCRUDService from './baseService';
import api from '../untils/api';
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler';

/**
 * ReviewService xử lý tất cả các tương tác API liên quan đến Reviews.
 */
const reviewCRUD = createCRUDService(ENDPOINTS.REVIEWS.BASE);

const ReviewService = {
  ...reviewCRUD,

  /**
   * Create a new review.
   * @param {object} params - Chứa reviewData và signal.
   * @param {object} params.reviewData - Dữ liệu review mới.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Review đã thêm.
   */
  createReview: async ({ reviewData, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.REVIEWS.BASE, reviewData, { signal });
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw handleError(error);
    }
  },

  /**
   * Fetch reviews by course ID.
   * @param {object} params - Chứa courseId và signal.
   * @param {number} params.courseId - ID của course.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Array>} Danh sách reviews.
   */
  fetchReviewsByCourse: async ({ courseId, signal }) => {
    try {
      const response = await api.get(`${ENDPOINTS.REVIEWS.BY_COURSE(courseId)}`, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for course ${courseId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Update a review.
   * @param {object} params - Chứa reviewId, reviewData, và signal.
   * @param {number} params.reviewId - ID của review.
   * @param {object} params.reviewData - Dữ liệu cập nhật review.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<Object>} Review đã cập nhật.
   */
  updateReview: async ({ reviewId, reviewData, signal }) => {
    try {
      const response = await api.put(`${ENDPOINTS.REVIEWS.BY_ID(reviewId)}`, reviewData, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error updating review ${reviewId}:`, error);
      throw handleError(error);
    }
  },

  /**
   * Delete a review.
   * @param {object} params - Chứa reviewId và signal.
   * @param {number} params.reviewId - ID của review.
   * @param {AbortSignal} params.signal - Signal để hủy request nếu cần.
   * @returns {Promise<void>}
   */
  deleteReview: async ({ reviewId, signal }) => {
    try {
      await api.delete(`${ENDPOINTS.REVIEWS.BY_ID(reviewId)}`, { signal });
    } catch (error) {
      console.error(`Error deleting review ${reviewId}:`, error);
      throw handleError(error);
    }
  },
};

export default ReviewService;
