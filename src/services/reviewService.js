import createCRUDService from './baseService';
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';
import {handleApiError} from '../utils/errorHandler';

/**
 * ReviewService handles all API interactions related to Reviews.
 */
const reviewCRUD = createCRUDService(ENDPOINTS.ADMIN.REVIEWS.BASE);
const ReviewService = {
  ...reviewCRUD,

  /**
   * Create a new review.
   * @param {object} params - Contains reviewData and signal.
   * @param {object} params.reviewData - New review data.
   * @param {AbortSignal} params.signal - Signal to cancel request if needed.
   * @returns {Promise<Object>} Added review.
   */
  createReview: async ({ reviewData, signal }) => {
    try {
      const response = await api.post(ENDPOINTS.ADMIN.REVIEWS.BASE, reviewData, { signal });
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Fetch reviews by course ID.
   * @param {object} params - Contains courseId and signal.
   * @param {number} params.courseId - Course ID.
   * @param {AbortSignal} params.signal - Signal to cancel request if needed.
   * @returns {Promise<Array>} List of reviews.
   */
  fetchReviewsByCourse: async ({ courseId, signal }) => {
    try {
      const response = await api.get(`${ENDPOINTS.REVIEWS.BY_COURSE(courseId)}`, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for course ${courseId}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Update a review.
   * @param {object} params - Contains reviewId, reviewData, and signal.
   * @param {number} params.reviewId - Review ID.
   * @param {object} params.reviewData - Updated review data.
   * @param {AbortSignal} params.signal - Signal to cancel request if needed.
   * @returns {Promise<Object>} Updated review.
   */
  updateReview: async ({ reviewId, reviewData, signal }) => {
    try {
      const response = await api.put(`${ENDPOINTS.REVIEWS.BY_ID(reviewId)}`, reviewData, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error updating review ${reviewId}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Delete a review.
   * @param {object} params - Contains reviewId and signal.
   * @param {number} params.reviewId - Review ID.
   * @param {AbortSignal} params.signal - Signal to cancel request if needed.
   * @returns {Promise<void>}
   */
  deleteReview: async ({ reviewId, signal }) => {
    try {
      await api.delete(`${ENDPOINTS.REVIEWS.BY_ID(reviewId)}`, { signal });
    } catch (error) {
      console.error(`Error deleting review ${reviewId}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Fetch all reviews with pagination and filtering (admin only).
   * @param {URLSearchParams} params - Query parameters for filtering and pagination.
   * @returns {Promise<Object>} Paginated reviews.
   */
  fetchAllReviews: async (params) => {
    try {
      const response = await api.get(`${ENDPOINTS.ADMIN.REVIEWS.BASE}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Fetch review statistics (admin only).
   * @param {URLSearchParams} params - Query parameters for filtering.
   * @returns {Promise<Object>} Review statistics.
   */
  fetchReviewStatistics: async (params) => {
    try {
      const response = await api.get(`${ENDPOINTS.ADMIN.REVIEWS.STATISTICS}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching review statistics:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Fetch a specific review by ID.
   * @param {number} reviewId - Review ID.
   * @returns {Promise<Object>} Review details.
   */
  fetchReviewById: async (reviewId) => {
    try {
      const response = await api.get(`${ENDPOINTS.ADMIN.REVIEWS.BY_ID(reviewId)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching review ${reviewId}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Moderate a review (admin only).
   * @param {number} reviewId - Review ID.
   * @param {object} reviewData - Updated review data.
   * @returns {Promise<Object>} Moderated review.
   */
  moderateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`${ENDPOINTS.ADMIN.REVIEWS.BY_ID(reviewId)}`, reviewData);
      return response.data;
    } catch (error) {
      console.error(`Error moderating review ${reviewId}:`, error);
      throw handleApiError(error);
    }
  },

  /**
   * Fetch courses for dropdown filters.
   * @returns {Promise<Array>} List of courses.
   */
  fetchCourses: async () => {
    try {
      const response = await api.get(`${ENDPOINTS.COURSES.BASE}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw handleApiError(error);
    }
  },

  /**
   * Fetch instructors for dropdown filters.
   * @returns {Promise<Array>} List of instructors.
   */
  fetchInstructors: async () => {
    try {
      const response = await api.get(`${ENDPOINTS.INSTRUCTORS.BASE}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw handleApiError(error);
    }
  }
};

export default ReviewService;