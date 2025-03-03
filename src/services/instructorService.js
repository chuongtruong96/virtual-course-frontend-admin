import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';
import NotificationService from './notificationService';
import { handleApiError } from '../utils/errorHandler';

const InstructorService = {
  // BASIC INSTRUCTOR OPERATIONS
  fetchAll: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const url = queryParams.toString()
        ? `${ENDPOINTS.INSTRUCTORS.BASE}?${queryParams.toString()}`
        : ENDPOINTS.INSTRUCTORS.BASE;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructors');
    }
  },

  fetchById: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.INSTRUCTORS.BY_ID(id));
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor details');
    }
  },

  getDetails: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.INSTRUCTORS.DETAILS(id));
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor details');
    }
  },

  getProfile: async (id) => {
    try {
      const response = await api.get(ENDPOINTS.INSTRUCTORS.PROFILE(id));
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor profile');
    }
  },

  updateProfile: async (id, profileData) => {
    try {
      const response = await api.put(ENDPOINTS.INSTRUCTORS.PROFILE(id), profileData);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error updating instructor profile');
    }
  },

  // STATISTICS & METRICS
  getInstructorStatistics: async (instructorId, timeRange = 'month') => {
    try {
      const response = await api.get(
        `${ENDPOINTS.INSTRUCTORS.STATISTICS(instructorId)}?timeRange=${timeRange}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor statistics');
    }
  },

  getPerformanceMetrics: async (instructorId) => {
    try {
      const response = await api.get(ENDPOINTS.INSTRUCTORS.PERFORMANCE_METRICS(instructorId));
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching performance metrics');
    }
  },

  // COURSE MANAGEMENT
  getInstructorCourses: async (instructorId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const url = queryParams.toString()
        ? `${ENDPOINTS.INSTRUCTORS.COURSES(instructorId)}?${queryParams.toString()}`
        : ENDPOINTS.INSTRUCTORS.COURSES(instructorId);

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor courses');
    }
  },

  // TEST MANAGEMENT
  getInstructorTests: async (instructorId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const url = queryParams.toString()
        ? `${ENDPOINTS.INSTRUCTORS.TESTS(instructorId)}?${queryParams.toString()}`
        : ENDPOINTS.INSTRUCTORS.TESTS(instructorId);

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor tests');
    }
  },

  // REVIEW MANAGEMENT
  getInstructorReviews: async (instructorId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const url = queryParams.toString()
        ? `${ENDPOINTS.INSTRUCTORS.REVIEWS(instructorId)}?${queryParams.toString()}`
        : ENDPOINTS.INSTRUCTORS.REVIEWS(instructorId);

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor reviews');
    }
  },

  replyToReview: async (reviewId, replyText) => {
    try {
      const response = await api.post(ENDPOINTS.REVIEWS.REPLY(reviewId), { reply: replyText });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error replying to review');
    }
  },

  // DOCUMENT MANAGEMENT
  uploadDocument: async (instructorId, file, documentType, description = '') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', documentType);
      if (description) {
        formData.append('description', description);
      }

      const response = await api.post(
        ENDPOINTS.INSTRUCTORS.DOCUMENTS(instructorId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error uploading document');
    }
  },

  getInstructorDocuments: async (instructorId) => {
    try {
      const response = await api.get(ENDPOINTS.INSTRUCTORS.DOCUMENTS(instructorId));
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor documents');
    }
  },

  // ADMIN FUNCTIONS
  getPendingInstructors: async () => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.INSTRUCTORS.PENDING);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching pending instructors');
    }
  },

  approveInstructor: async (instructorId, notes = '') => {
    try {
      // First, make the API call to approve the instructor
      const response = await api.post(ENDPOINTS.ADMIN.INSTRUCTORS.APPROVE(instructorId), {
        notes,
      });
  
      // Then, send a notification to the instructor
      try {
        // Sử dụng loại thông báo InstApprv thay vì INSTRUCTOR_APPROVAL
        await NotificationService.sendNotification(
          instructorId,
          'Your instructor application has been approved! You can now create courses.',
          'InstApprv' // Đảm bảo giá trị này khớp với enum NotificationType trong backend
        );
        console.log('Approval notification sent successfully');
      } catch (notifError) {
        console.error('Error sending approval notification:', notifError);
        // We don't throw here to avoid failing the approval if notification fails
      }
  
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error approving instructor');
    }
  },

  rejectInstructor: async (instructorId, reason) => {
    try {
      // First, make the API call to reject the instructor
      const response = await api.post(ENDPOINTS.ADMIN.INSTRUCTORS.REJECT(instructorId), {
        reason,
      });

      // Then, send a notification to the instructor
      try {
        await NotificationService.sendNotification(
          instructorId,
          `Your instructor application was rejected. Reason: ${reason}`,
          'INSTRUCTOR_REJECTION'
        );
        console.log('Rejection notification sent successfully');
      } catch (notifError) {
        console.error('Error sending rejection notification:', notifError);
        // We don't throw here to avoid failing the rejection if notification fails
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error rejecting instructor');
    }
  },

  updateInstructorStatus: async (instructorId, status, notes = '') => {
    try {
      const response = await api.put(
        ENDPOINTS.ADMIN.INSTRUCTORS.UPDATE_STATUS(instructorId),
        { status, notes }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error updating instructor status');
    }
  },
};

export default InstructorService;