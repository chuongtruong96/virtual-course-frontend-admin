import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';
import NotificationService from './notificationService';
import { handleApiError } from '../utils/errorHandler';

// Define API_BASE constant if not already defined in ENDPOINTS
const API_BASE = ENDPOINTS.API_BASE || '/api';

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
  getTests: async (instructorId, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
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
        await NotificationService.sendNotification(
          instructorId,
          'Your instructor application has been approved! You can now create courses.',
          'InstApprv' // Make sure this matches the NotificationType enum in backend
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
  
  // ==================== INSTRUCTOR PROFILE ENDPOINTS ====================
  // Updated to match the controller endpoints
  
  // EDUCATION
  getEducations: async (instructorId) => {
    try {
      const response = await api.get(`${API_BASE}/instructors/${instructorId}/profile/educations`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor educations');
    }
  },
  
  getEducationById: async (instructorId, educationId) => {
    try {
      const response = await api.get(`${API_BASE}/instructors/${instructorId}/profile/educations/${educationId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching education details');
    }
  },
  
  addEducation: async (instructorId, educationDTO) => {
    try {
      const response = await api.post(`${API_BASE}/instructors/${instructorId}/profile/educations`, educationDTO);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error adding education');
    }
  },
  
  updateEducation: async (instructorId, educationId, educationDTO) => {
    try {
      const response = await api.put(`${API_BASE}/instructors/${instructorId}/profile/educations/${educationId}`, educationDTO);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error updating education');
    }
  },
  
  deleteEducation: async (instructorId, educationId) => {
    try {
      await api.delete(`${API_BASE}/instructors/${instructorId}/profile/educations/${educationId}`);
      return true;
    } catch (error) {
      throw handleApiError(error, 'Error deleting education');
    }
  },
  
  // EXPERIENCE
  getExperiences: async (instructorId) => {
    try {
      const response = await api.get(`${API_BASE}/instructors/${instructorId}/profile/experiences`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor experiences');
    }
  },
  
  getExperienceById: async (instructorId, experienceId) => {
    try {
      const response = await api.get(`${API_BASE}/instructors/${instructorId}/profile/experiences/${experienceId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching experience details');
    }
  },
  
  addExperience: async (instructorId, experienceDTO) => {
    try {
      const response = await api.post(`${API_BASE}/instructors/${instructorId}/profile/experiences`, experienceDTO);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error adding experience');
    }
  },
  
  updateExperience: async (instructorId, experienceId, experienceDTO) => {
    try {
      const response = await api.put(`${API_BASE}/instructors/${instructorId}/profile/experiences/${experienceId}`, experienceDTO);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error updating experience');
    }
  },
  
  deleteExperience: async (instructorId, experienceId) => {
    try {
      await api.delete(`${API_BASE}/instructors/${instructorId}/profile/experiences/${experienceId}`);
      return true;
    } catch (error) {
      throw handleApiError(error, 'Error deleting experience');
    }
  },
  
  // SKILLS
  getSkills: async (instructorId) => {
    try {
      const response = await api.get(`${API_BASE}/instructors/${instructorId}/profile/skills`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor skills');
    }
  },
  
  getSkillById: async (instructorId, skillId) => {
    try {
      const response = await api.get(`${API_BASE}/instructors/${instructorId}/profile/skills/${skillId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching skill details');
    }
  },
  
  addSkill: async (instructorId, skillDTO) => {
    try {
      const response = await api.post(`${API_BASE}/instructors/${instructorId}/profile/skills`, skillDTO);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error adding skill');
    }
  },
  
  updateSkill: async (instructorId, skillId, skillDTO) => {
    try {
      const response = await api.put(`${API_BASE}/instructors/${instructorId}/profile/skills/${skillId}`, skillDTO);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error updating skill');
    }
  },
  
  deleteSkill: async (instructorId, skillId) => {
    try {
      await api.delete(`${API_BASE}/instructors/${instructorId}/profile/skills/${skillId}`);
      return true;
    } catch (error) {
      throw handleApiError(error, 'Error deleting skill');
    }
  },
  
  // SOCIAL
  getSocial: async (instructorId) => {
    try {
      const response = await api.get(`${API_BASE}/instructors/${instructorId}/profile/socials`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor social links');
    }
  },
  
  updateSocial: async (instructorId, socialDTO) => {
    try {
      const response = await api.put(`${API_BASE}/instructors/${instructorId}/profile/socials`, socialDTO);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error updating social links');
    }
  },
  
  // Method to fetch all profile data in one call
  getInstructorProfileData: async (instructorId) => {
    try {
      const [
        educations,
        experiences,
        skills,
        social
      ] = await Promise.all([
        InstructorService.getEducations(instructorId),
        InstructorService.getExperiences(instructorId),
        InstructorService.getSkills(instructorId),
        InstructorService.getSocial(instructorId).catch(() => null) // Social might not exist yet
      ]);
  
      return {
        educations: educations || [],
        experiences: experiences || [],
        skills: skills || [],
        social: social || null
      };
    } catch (error) {
      throw handleApiError(error, 'Error fetching instructor profile data');
    }
  }
};
export default InstructorService;