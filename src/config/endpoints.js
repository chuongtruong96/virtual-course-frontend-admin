export const API_BASE = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8080/api';

// Base for uploads (images, files, etc.)
export const UPLOAD_BASE = 'http://localhost:8080/uploads';

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
    },

    COURSES: {
      COURSES: {
        BASE: `${API_BASE}/admin/courses`,
        PENDING: `${API_BASE}/admin/courses/pending`,
        APPROVE: (courseId) => `${API_BASE}/admin/courses/${courseId}/approve`,
        REJECT: (courseId) => `${API_BASE}/admin/courses/${courseId}/reject`,
        APPROVAL_HISTORY: (courseId) => `${API_BASE}/admin/courses/${courseId}/approval-history`,
      },},

    INSTRUCTORS: {
      BASE: `${API_BASE}/admin/instructors`,
      PENDING: `${API_BASE}/admin/instructors/pending`,
      APPROVE: (id) => `${API_BASE}/admin/instructors/${id}/approve`,
      REJECT: (id) => `${API_BASE}/admin/instructors/${id}/reject`,
    },
  },

  // Regular instructor endpoints
  INSTRUCTORS: {
    BASE: `${API_BASE}/instructors`,
    BY_ID: (id) => `${API_BASE}/instructors/${id}`,
    DETAILS: (id) => `${API_BASE}/instructors/${id}/instructor-details`,
    STATISTICS: (id) => `${API_BASE}/instructors/${id}/instructor-statistics`,
    PROFILE: (id) => `${API_BASE}/instructors/${id}/instructor-profile`,
    COURSES: (id) => `${API_BASE}/courses/${id}/instructor-courses`,
  },

  // Categories
  CATEGORIES: {
    BASE: `${API_BASE}/categories`,
    BY_ID: (id) => `${API_BASE}/categories/${id}`,
  },

  // Courses
  COURSES: {
    BASE: `${API_BASE}/courses`,
    BY_ID: (id) => `${API_BASE}/courses/${id}`,
    DETAILS: (id) => `${API_BASE}/courses/${id}/details`,
    DETAILS_FOR_STUDENT: (courseId, studentId) =>
      `${API_BASE}/courses/${courseId}/details-for-student?studentId=${studentId}`,
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
    QUESTIONS: (testId) => `${API_BASE}/tests/${testId}/questions`,
    SUBMIT: `${API_BASE}/tests/submit`,
  },

  // Transactions
  TRANSACTIONS: {
    HISTORY: (studentId) => `${API_BASE}/transactions/history/${studentId}`,
    DETAILS: (transactionId) => `${API_BASE}/transactions/history/details/${transactionId}`,
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: `${API_BASE}/notifications`,
    BY_USER: (userId) => `${API_BASE}/notifications/user/${userId}`,
    MARK_AS_READ: (id) => `${API_BASE}/notifications/${id}/read`,
    BY_ID: (id) => `${API_BASE}/notifications/${id}`,
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

  // Reviews
  REVIEWS: {
    BASE: `${API_BASE}/reviews`,
    BY_COURSE: (courseId) => `${API_BASE}/reviews/course/${courseId}`,
    BY_ID: (id) => `${API_BASE}/reviews/${id}`,
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