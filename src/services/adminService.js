import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';
import NotificationService from './notificationService';

const AdminService = {
  // Statistics
  getStatistics: async (filter = 'allTime', model = 'all') => {
    try {
      const response = await api.get(`${ENDPOINTS.ADMIN.STATISTICS}?filter=${filter}&model=${model}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  getTrends: async (filter = 'allTime') => {
    try {
      const response = await api.get(`${ENDPOINTS.ADMIN.TRENDS}?filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trends:', error);
      throw error;
    }
  },

  // Course Management
  getPendingCourses: async () => {
    try {
      console.log('Fetching pending courses from:', ENDPOINTS.ADMIN.COURSES.PENDING);
      const response = await api.get(ENDPOINTS.ADMIN.COURSES.PENDING);
      console.log('Pending courses response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending courses:', error);
      throw error;
    }
  },

  getCoursesByStatus: async (status) => {
    try {
      console.log(`Fetching courses with status: ${status}`);
      const response = await api.get(`${ENDPOINTS.ADMIN.COURSES.BY_STATUS}?status=${status}`);
      console.log(`Courses with status ${status} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses with status ${status}:`, error);
      throw error;
    }
  },

  approveCourse: async (courseId, notes) => {
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

      // Send notification to course instructor
      try {
        if (response.data && response.data.instructorId) {
          await NotificationService.sendNotification({
            userId: response.data.instructorId,
            content: `Your course "${response.data.title || 'Course'}" has been approved.`,
            type: 'COURSE_APPROVAL',
            courseId: id
          });
        }
      } catch (notifError) {
        console.error('Error sending approval notification:', notifError);
        // Don't throw here - we don't want to fail the approval if notification fails
      }

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

  rejectCourse: async (courseId, reason) => {
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

      // Send notification to course instructor
      try {
        if (response.data && response.data.instructorId) {
          await NotificationService.sendNotification({
            userId: response.data.instructorId,
            content: `Your course "${response.data.title || 'Course'}" has been rejected. Reason: ${reason || 'No reason provided'}`,
            type: 'COURSE_REJECTION',
            courseId: id
          });
        }
      } catch (notifError) {
        console.error('Error sending rejection notification:', notifError);
        // Don't throw here - we don't want to fail the rejection if notification fails
      }

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

  getCourseApprovalHistory: async (courseId) => {
    try {
      if (!courseId) {
        throw new Error('Course ID is required');
      }

      const response = await api.get(ENDPOINTS.ADMIN.COURSES.APPROVAL_HISTORY(courseId));
      return response.data;
    } catch (error) {
      console.error('Error fetching approval history:', error);
      throw error;
    }
  },

  // Instructor Management
  getPendingInstructors: async () => {
    try {
      const response = await api.get(ENDPOINTS.ADMIN.INSTRUCTORS.PENDING);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending instructors:', error);
      throw error;
    }
  },

  approveInstructor: async (accountId) => {
    try {
      const response = await api.post(ENDPOINTS.ADMIN.INSTRUCTORS.APPROVE(accountId));
      
      // Send notification to instructor
      try {
        await NotificationService.sendNotification({
          userId: accountId,
          content: 'Your instructor application has been approved. You can now create courses.',
          type: 'INSTRUCTOR_APPROVAL'
        });
      } catch (notifError) {
        console.error('Error sending instructor approval notification:', notifError);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error approving instructor:', error);
      throw error;
    }
  },

  rejectInstructor: async (accountId, reason) => {
    try {
      const response = await api.post(ENDPOINTS.ADMIN.INSTRUCTORS.REJECT(accountId), { reason });
      
      // Send notification to instructor
      try {
        await NotificationService.sendNotification({
          userId: accountId,
          content: `Your instructor application has been rejected. Reason: ${reason || 'No reason provided'}`,
          type: 'INSTRUCTOR_REJECTION'
        });
      } catch (notifError) {
        console.error('Error sending instructor rejection notification:', notifError);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error rejecting instructor:', error);
      throw error;
    }
  },

  // Account Management
  getAccountsByStatus: async (status) => {
    try {
      // Always use the by-status endpoint since that's what the backend expects
      const response = await api.get(`${ENDPOINTS.ADMIN.ACCOUNTS.BY_STATUS}?status=${status === 'all' ? 'ACTIVE' : status}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts by status:', error);
      throw error;
    }
  },

  updateAccountStatus: async (accountId, newStatus, reason = 'Admin update') => {
    try {
      // Validate inputs
      if (!accountId) {
        throw new Error('Account ID is required');
      }
      
      if (!newStatus || !['ACTIVE', 'INACTIVE', 'SUSPENDED', 'CLOSED'].includes(newStatus.toUpperCase())) {
        throw new Error('Valid status is required (ACTIVE, INACTIVE, SUSPENDED, CLOSED)');
      }
      
      const response = await api.put(
        ENDPOINTS.ADMIN.ACCOUNTS.UPDATE_STATUS(accountId),
        { 
          status: newStatus.toUpperCase(),
          reason: reason
        }
      );
      
      // Send notification to the user
      try {
        const statusMessages = {
          'ACTIVE': 'Your account has been activated.',
          'INACTIVE': 'Your account has been deactivated.',
          'SUSPENDED': 'Your account has been suspended.',
          'CLOSED': 'Your account has been closed.'
        };
        
        await NotificationService.sendNotification({
          userId: accountId,
          content: `${statusMessages[newStatus.toUpperCase()]} Reason: ${reason}`,
          type: 'ACCOUNT_STATUS_CHANGE'
        });
      } catch (notifError) {
        console.error('Error sending account status notification:', notifError);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating account status:', error);
      throw new Error(`Failed to update account status: ${error.message}`);
    }
  }
};

export default AdminService;