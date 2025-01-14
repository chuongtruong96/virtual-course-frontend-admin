// src/services/courseService.js
import createCRUDService from './baseService';
import api from '../untils/api';
import { ENDPOINTS } from '../config/endpoint';
import { handleError } from '../untils/errorHandler';

/**
 * CourseService xử lý tất cả các tương tác API liên quan đến Courses.
 */
const courseCRUD = createCRUDService(ENDPOINTS.COURSES.BASE);

const CourseService = {
  ...courseCRUD,

  // fetch all courses
  fetchAllCourses: async ({ signal }) => {
    try {
      const response = await api.get(ENDPOINTS.COURSES.BASE, { signal });
      return response.data; // GET /api/courses
    } catch (error) {
      console.error('Error fetching all courses:', error);
      throw handleError(error);
    }
  },

  // fetch courses by instructor => GET /api/instructors/{instructorId}/courses
  fetchCoursesByInstructor: async ({ instructorId, signal }) => {
    try {
      const response = await api.get(ENDPOINTS.INSTRUCTORS.BY_ID_COURSES(instructorId), { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses for instructor ${instructorId}:`, error);
      throw handleError(error);
    }
  },

  // addCourseForInstructor => POST /api/courses/instructor/{id}/courses
  addCourseForInstructor: async ({ instructorId, data, signal }) => {
    try {
      const url = ENDPOINTS.INSTRUCTORS.BY_ID_COURSES(instructorId); // "/api/instructors/10/courses"
      const response = await api.post(url, data, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error adding course for instructor ${instructorId}:`, error);
      throw handleError(error);
    }
  },

  // override editCourse => PUT /api/courses/{id}
  editCourse: async ({ id, data, signal }) => {
    try {
      const response = await api.put(ENDPOINTS.COURSES.BY_ID(id), data, { signal });
      return response.data;
    } catch (error) {
      console.error(`Error editing course ${id}:`, error);
      throw handleError(error);
    }
  },

  // fetch detail => GET /api/courses/{id}
  fetchCourseById: async ({ id, signal }) => {
    try {
      const response = await api.get(ENDPOINTS.COURSES.BY_ID(id), { signal });
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw handleError(error);
    }
  },

  // disable => PUT /api/courses/{id}/disable
  // enable => PUT /api/courses/{id}/enable
  // etc...

  // Thêm 2 hàm
  approveCourse: async (courseId) => {
    // Gọi API: PUT /api/courses/{id}/approve (hoặc POST tùy backend)
    const response = await api.put(`${ENDPOINTS.COURSES.BY_ID(courseId)}/approve`);
    return response.data;
  },
  rejectCourse: async (courseId, reason) => {
    // Gọi API: PUT /api/courses/{id}/reject
    const response = await api.put(`${ENDPOINTS.COURSES.BY_ID(courseId)}/reject`, { reason });
    return response.data;
  },
  // fetchPendingCourses
  fetchPendingCourses: async ({ signal }) => {
    // Gọi API: GET /api/courses/pending
    // Tùy logic backend
    const response = await api.get(`${ENDPOINTS.COURSES.BASE}/pending`, { signal });
    return response.data;
  }
};

export default CourseService;
