// In src/config/endpoints.js:

// Base URLs
export const API_BASE = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8080/api';
export const APP_BASE = import.meta.env.VITE_APP_BASE_NAME ? `/${import.meta.env.VITE_APP_BASE_NAME}` : '';
export const UPLOAD_BASE = 'http://localhost:8080/uploads';

// Default images paths - using APP_BASE to ensure correct paths with basename
export const DEFAULT_IMAGES = {
  INSTRUCTOR: `${APP_BASE}/images/instructor/default-instructor.jpg`,
  STUDENT: `${APP_BASE}/images/student/default-student.jpg`,
  COURSE: `${APP_BASE}/images/course/default-course.jpg`,
  CATEGORY: `${APP_BASE}/images/category/default-category.jpg`,
  AVATAR: `${APP_BASE}/images/avatar/default-avatar.jpg`,
};
// Sub-paths for uploads
export const UPLOAD_PATH = {
  CATEGORY: `${UPLOAD_BASE}/category`,
  COURSE: `${UPLOAD_BASE}/course`,
  INSTRUCTOR: `${UPLOAD_BASE}/instructor`,
  STUDENT: `${UPLOAD_BASE}/student`,
  ACCOUNT: `${UPLOAD_BASE}/account`,
};

const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
    LOGOUT: `${API_BASE}/auth/logout`,
  },

  // Admin endpoints
  ADMIN: {
    STATISTICS: `${API_BASE}/admin/statistics`,
    TRENDS: `${API_BASE}/admin/statistics/trends`,
    
    ACCOUNTS: {
      BASE: `${API_BASE}/admin/accounts`,
      BY_STATUS: `${API_BASE}/admin/accounts/by-status`,
      UPDATE_STATUS: (id) => `${API_BASE}/admin/accounts/${id}/status`,
      ROLES: (id) => `${API_BASE}/admin/accounts/${id}/roles`,
      CREATE: `${API_BASE}/admin/accounts/create`,
    },

    COURSES: {
      BASE: `${API_BASE}/admin/courses`,
      PENDING: `${API_BASE}/admin/courses/pending`,
      APPROVE: (courseId) => `${API_BASE}/admin/courses/${courseId}/approve`,
      REJECT: (courseId) => `${API_BASE}/admin/courses/${courseId}/reject`,
      APPROVAL_HISTORY: (courseId) => `${API_BASE}/admin/courses/${courseId}/approval-history`,
      BY_STATUS: `${API_BASE}/admin/courses/by-status`,
    },

    INSTRUCTORS: {
      BASE: `${API_BASE}/admin/instructors`,
      PENDING: `${API_BASE}/admin/instructors/pending`,
      APPROVE: (id) => `${API_BASE}/admin/instructors/${id}/approve`,
      REJECT: (id) => `${API_BASE}/admin/instructors/${id}/reject`,
      UPDATE_STATUS: (id) => `${API_BASE}/admin/instructors/${id}/status`,
      VERIFY: (id) => `${API_BASE}/admin/instructors/${id}/verify`,
      PERFORMANCE: (id) => `${API_BASE}/admin/instructors/${id}/performance`,
    },
    
    REVIEWS: {
      BASE: `${API_BASE}/admin/reviews`,
      BY_ID: (id) => `${API_BASE}/admin/reviews/${id}`,
      STATISTICS: `${API_BASE}/admin/reviews/statistics`,
      MODERATE: (reviewId) => `${API_BASE}/admin/reviews/${reviewId}`,
      REPLY: (reviewId) => `${API_BASE}/admin/reviews/${reviewId}/reply`,
      BY_COURSE: (courseId) => `${API_BASE}/admin/reviews/course/${courseId}`,
      BY_STUDENT: (studentId) => `${API_BASE}/admin/reviews/student/${studentId}`,
      BY_INSTRUCTOR: (instructorId) => `${API_BASE}/admin/reviews/instructor/${instructorId}`,
      FEATURED: `${API_BASE}/admin/reviews/featured`,
      TOGGLE_FEATURED: (reviewId) => `${API_BASE}/admin/reviews/${reviewId}/featured`,
      UPDATE_STATUS: (reviewId) => `${API_BASE}/admin/reviews/${reviewId}/status`,
    },
  },

  // Regular instructor endpoints
  INSTRUCTORS: {
    BASE: `${API_BASE}/instructors`,
    BY_ID: (id) => `${API_BASE}/instructors/${id}`,
    DETAILS: (id) => `${API_BASE}/instructors/${id}/instructor-details`,
    STATISTICS: (id) => `${API_BASE}/instructors/${id}/instructor-statistics`,
    PROFILE: (id) => `${API_BASE}/instructors/${id}/instructor-profile`,
    COURSES: (id) => `${API_BASE}/instructors/${id}/courses`,
    TESTS: (id) => `${API_BASE}/instructors/${id}/tests`,
    REVIEWS: (id) => `${API_BASE}/instructors/${id}/reviews`,
    PERFORMANCE_METRICS: (id) => `${API_BASE}/instructors/${id}/performance-metrics`,
    DOCUMENTS: (id) => `${API_BASE}/instructors/${id}/documents`,
  },

  // Categories
  CATEGORIES: {
    BASE: `${API_BASE}/categories`,
    BY_ID: (id) => `${API_BASE}/categories/${id}`,
    WITH_STATS: `${API_BASE}/categories/with-stats`,
    BY_ID_WITH_STATS: (id) => `${API_BASE}/categories/${id}/with-stats`,
  },

  // Courses
  COURSES: {
    BASE: `${API_BASE}/courses`,
    BY_ID: (id) => `${API_BASE}/courses/${id}`,
    DETAILS: (id) => `${API_BASE}/courses/${id}/details`,
    DETAILS_FOR_STUDENT: (courseId, studentId) =>
      `${API_BASE}/courses/${courseId}/details-for-student?studentId=${studentId}`,
    DELETE: (id) => `${API_BASE}/courses/${id}`,
  },

  // Enrollments
  ENROLLMENTS: {
    BASE: `${API_BASE}/enrollments`,
    BY_ID: (id) => `${API_BASE}/enrollments/${id}`,
    COMPLETE: (id) => `${API_BASE}/enrollments/${id}/complete`,
    BY_STUDENT: (studentId) => `${API_BASE}/enrollments/student/${studentId}`,
    BY_COURSE: (courseId) => `${API_BASE}/enrollments/course/${courseId}`,
  },

  // Favorite (Wishlist)
  FAVORITE: {
    BASE: `${API_BASE}/favorite`,
    BY_STUDENT: (studentId) => `${API_BASE}/favorite/${studentId}`,
  },

  // Files (for upload)
  FILES: {
    UPLOAD: `${API_BASE}/files/upload`,
  },

  // Students
  STUDENTS: {
    BASE: `${API_BASE}/students`,
    BY_ID: (id) => `${API_BASE}/students/${id}`,
    BY_ACCOUNT: (accountId) => `${API_BASE}/students/by-account/${accountId}`,
    DASHBOARD: (studentId) => `${API_BASE}/students/${studentId}/dashboard`,
    WISHLIST: (studentId) => `${API_BASE}/students/${studentId}/wishlist`,
    WISHLIST_ITEM: (studentId, courseId) =>
      `${API_BASE}/students/${studentId}/wishlist/${courseId}`,
    CART: (studentId) => `${API_BASE}/students/${studentId}/cart`,
    CART_ITEMS: (studentId) => `${API_BASE}/students/${studentId}/cart-items`,
    CART_ITEM: (studentId, cartItemId) =>
      `${API_BASE}/students/${studentId}/cart-items/${cartItemId}`,
    STUDENT_COURSES_STATUS: (studentId) =>
      `${API_BASE}/students/student-courses-status/${studentId}`,
  },

  // Tests
  TESTS: {
    BASE: `${API_BASE}/tests`,
    BY_ID: (id) => `${API_BASE}/tests/${id}`,
    QUESTIONS: (testId) => `${API_BASE}/tests/${testId}/questions`,
    SUBMIT: `${API_BASE}/tests/submit`,
    UPDATE_STATUS: (id) => `${API_BASE}/tests/${id}/status`,
    DELETE: (id) => `${API_BASE}/tests/${id}`,
  },

  // Transactions
  TRANSACTIONS: {
    HISTORY: (studentId) => `${API_BASE}/transactions/history/${studentId}`,
    DETAILS: (transactionId) => `${API_BASE}/transactions/history/details/${transactionId}`,
  },

  // Notifications
NOTIFICATIONS: {
  BASE: `${API_BASE}/notifications`,
  ALL: `${API_BASE}/notifications/all`,
  ALL_PAGINATED: `${API_BASE}/notifications/all/paginated`, // Đảm bảo endpoint này đúng
  BY_USER: (userId) => `${API_BASE}/notifications/user/${userId}`,
  BY_USER_PAGINATED: (userId, page, size) => 
    `${API_BASE}/notifications/user/${userId}/paginated?page=${page}&size=${size}`,
  BY_ID: (id) => `${API_BASE}/notifications/${id}`,
  MARK_AS_READ: (id) => `${API_BASE}/notifications/${id}/read`,
  MARK_ALL_READ: (userId) => `${API_BASE}/notifications/user/${userId}/mark-all-read`,
  MARK_ALL_READ_BY_TYPE: (userId, type) => 
    `${API_BASE}/notifications/user/${userId}/type/${type}/mark-all-read`,
  DELETE_ALL_READ: (userId) => `${API_BASE}/notifications/user/${userId}/delete-all-read`,
  UNREAD: (userId) => `${API_BASE}/notifications/user/${userId}/unread`,
  UNREAD_PAGINATED: (userId, page, size) => 
    `${API_BASE}/notifications/user/${userId}/unread/paginated?page=${page}&size=${size}`,
  COUNT_UNREAD: (userId) => `${API_BASE}/notifications/user/${userId}/count-unread`,
  RECENT: (userId) => `${API_BASE}/notifications/user/${userId}/recent`,
  RECENT_PAGINATED: (userId, page, size) => 
    `${API_BASE}/notifications/user/${userId}/recent/paginated?page=${page}&size=${size}`,
  BY_TYPE_ALL: (type) => `${API_BASE}/notifications/type/${type}`,
  // Endpoint cho filter theo type (có phân trang)
  BY_TYPE_ALL_PAGINATED: (type, page, size) => 
    `${API_BASE}/notifications/type/${type}/paginated?page=${page}&size=${size}`,
  BY_COURSE: (courseId) => `${API_BASE}/notifications/course/${courseId}`,
  BY_COURSE_PAGINATED: (courseId, page, size) => 
    `${API_BASE}/notifications/course/${courseId}/paginated?page=${page}&size=${size}`,
  BY_PAYMENT: (paymentId) => `${API_BASE}/notifications/payment/${paymentId}`,
  SEARCH: (userId, searchTerm) => 
    `${API_BASE}/notifications/user/${userId}/search?searchTerm=${encodeURIComponent(searchTerm)}`,
  SEARCH_PAGINATED: (userId, searchTerm, page, size) => 
    `${API_BASE}/notifications/user/${userId}/search/paginated?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`,
  BY_DATE_RANGE: (userId, startDate, endDate) => 
    `${API_BASE}/notifications/user/${userId}/date-range?startDate=${startDate}&endDate=${endDate}`,
  STATISTICS: (userId) => `${API_BASE}/notifications/user/${userId}/statistics`,
  UPDATE_CONTENT: (id) => `${API_BASE}/notifications/${id}/content`,
  SEND: `${API_BASE}/notifications/send`,
  SEND_MULTIPLE: `${API_BASE}/notifications/send-multiple`,
  SEND_ALL: `${API_BASE}/notifications/send-all`,
  SEND_COURSE_ENROLLEES: `${API_BASE}/notifications/send-course-enrollees`,
  SCHEDULE: `${API_BASE}/notifications/schedule`,
  SEARCH_ALL_PAGINATED: (searchTerm, page, size) => 
    `${API_BASE}/notifications/all/search/paginated?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`,
  ALL_BY_TYPE_PAGINATED: (type, page, size) => 
    `${API_BASE}/notifications/all/type/${type}/paginated?page=${page}&size=${size}`,
  COUNT_ALL_BY_TYPE: (type) => `${API_BASE}/notifications/all/type/${type}/count`,
  DELETE_ALL_BY_TYPE: (type) => `${API_BASE}/notifications/all/type/${type}/delete-all`,
  // Thêm vào ENDPOINTS.NOTIFICATIONS trong endpoints.js
SEARCH_ALL_PAGINATED: (searchTerm, page, size) => 
  `${API_BASE}/notifications/search/paginated?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`,
DATE_RANGE_ALL_PAGINATED: (startDate, endDate, page, size) => 
  `${API_BASE}/notifications/date-range/paginated?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`,
},

  // Payment
  PAYMENT: {
    PAYPAL: {
      CREATE: `${API_BASE}/payment/create-paypal-payment`,
      EXECUTE: `${API_BASE}/payment/execute-paypal-payment`,
      CREATE_MULTIPLE: `${API_BASE}/payment/create-paypal-payment-multiple`,
    },
    VNPAY: {
      CREATE: `${API_BASE}/payment/create-vnpay-payment`,
      CREATE_MULTIPLE: `${API_BASE}/payment/create-vnpay-payment-multiple`,
      RETURN: `${API_BASE}/payment/vnpay-return`,
    },
  },

  // Progress
  PROGRESS: {
    COMPLETE_LECTURE: `${API_BASE}/progress/complete-lecture`,
  },

  // Tickets
  TICKETS: {
    BASE: `${API_BASE}/tickets`,
    BY_ID: (id) => `${API_BASE}/tickets/${id}`,
    RESOLVE: (id) => `${API_BASE}/tickets/${id}/resolve`,
    CLOSE: (id) => `${API_BASE}/tickets/${id}/close`,
  },
};

export default ENDPOINTS;