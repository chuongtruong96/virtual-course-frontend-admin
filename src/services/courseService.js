import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const CourseService = {
  // General course operations
  fetchAll: async () => {
    try {
      console.log('Fetching all courses');
      const response = await api.get(ENDPOINTS.COURSES.BASE);
      console.log('All courses response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all courses:', error);
      throw error;
    }
  },

  fetchById: async (id) => {
    try {
      if (!id) {
        throw new Error('Course ID is required');
      }
      const response = await api.get(ENDPOINTS.COURSES.BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  fetchCoursesByStatus: async (status) => {
    try {
      console.log(`Fetching courses with status: ${status}`);
      // Use the appropriate endpoint based on status
      let endpoint;
      if (status === 'pending') {
        endpoint = ENDPOINTS.ADMIN.COURSES.PENDING;
      } else {
        // Assuming there's an endpoint for filtering by status
        endpoint = `${ENDPOINTS.COURSES.BASE}?status=${status}`;
      }
      
      const response = await api.get(endpoint);
      console.log(`Courses with status ${status} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses with status ${status}:`, error);
      throw error;
    }
  },

  fetchPendingCourses: async () => {
    try {
      console.log('Fetching pending courses');
      const response = await api.get(ENDPOINTS.ADMIN.COURSES.PENDING);
      console.log('Pending courses response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending courses:', error);
      throw error;
    }
  },

  approveCourse: async ({ courseId, notes }) => {
    try {
      if (!courseId) {
        throw new Error('Course ID is required');
      }

      // Convert courseId to number if it's a string
      const id = Number(courseId);
      if (isNaN(id)) {
        throw new Error('Invalid course ID format');
      }

      // Log the request details
      console.log('Approving course:', {
        courseId: id,
        notes,
        url: ENDPOINTS.ADMIN.COURSES.APPROVE(id)
      });

      const response = await api.post(
        ENDPOINTS.ADMIN.COURSES.APPROVE(id),
        { notes: notes || '' }
      );

      // Log successful response
      console.log('Course approval response:', response.data);
      return response.data;
    } catch (error) {
      // Enhanced error logging
      console.error('Error approving course:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });

      // Throw appropriate error based on response
      if (error.response?.status === 404) {
        throw new Error(`Course with ID ${courseId} not found`);
      } else if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please check your authentication');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to approve courses');
      }

      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to approve course'
      );
    }
  },

  rejectCourse: async ({ courseId, reason }) => {
    try {
      if (!courseId) {
        throw new Error('Course ID is required');
      }

      // Convert courseId to number if it's a string
      const id = Number(courseId);
      if (isNaN(id)) {
        throw new Error('Invalid course ID format');
      }

      // Log request details
      console.log('Rejecting course:', {
        courseId: id,
        reason,
        url: ENDPOINTS.ADMIN.COURSES.REJECT(id)
      });

      const response = await api.post(
        ENDPOINTS.ADMIN.COURSES.REJECT(id),
        { reason: reason || '' }
      );

      return response.data;
    } catch (error) {
      console.error('Error rejecting course:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 404) {
        throw new Error(`Course with ID ${courseId} not found`);
      }

      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to reject course'
      );
    }
  },

  getApprovalHistory: async (courseId) => {
    try {
      if (!courseId) {
        throw new Error('Course ID is required');
      }

      // Convert courseId to string if it's a number
      const id = courseId.toString();
      const response = await api.get(ENDPOINTS.ADMIN.COURSES.APPROVAL_HISTORY(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching approval history:', {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch approval history');
    }
  },

  // Helper method to validate courseId
  validateCourseId: (courseId) => {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    // Ensure courseId is a valid number or string
    const id = courseId.toString();
    if (!id.match(/^\d+$/)) {
      throw new Error('Invalid course ID format');
    }

    return id;
  }
};

export default CourseService;