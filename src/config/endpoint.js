// src/config/endpoints.js

export const API_BASE = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8080/api';
// 2) Base cho Uploads (ảnh, file,...)
export const UPLOAD_BASE = 'http://localhost:8080/uploads';

// 3) Tạo object liệt kê các sub-path upload
export const UPLOAD_PATH = {
  CATEGORY: `${UPLOAD_BASE}/category`,
  COURSE: `${UPLOAD_BASE}/course`,
  INSTRUCTOR: `${UPLOAD_BASE}/instructor`,
  STUDENT: `${UPLOAD_BASE}/student`,
  ACCOUNT: `${UPLOAD_BASE}/account`, // tùy, nếu có
};

// 4) API endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
    // ...
  },
  ACCOUNTS: {
    BASE: `${API_BASE}/accounts`,
    BY_ID: (id) => `${API_BASE}/accounts/${id}`,
    DISABLE: (id) => `${API_BASE}/accounts/${id}/disable`,
    ENABLE: (id) => `${API_BASE}/accounts/${id}/enable`,
  },
  CATEGORIES: {
    BASE: `${API_BASE}/categories`,
    BY_ID: (id) => `${API_BASE}/categories/${id}`,
  },
  COURSES: {
    BASE: `${API_BASE}/courses`,
    BY_ID: (id) => `${API_BASE}/courses/${id}`,
    DISABLE: (id) => `${API_BASE}/courses/${id}/disable`,
    ENABLE: (id) => `${API_BASE}/courses/${id}/enable`,
  },
  INSTRUCTORS: {
    BASE: `${API_BASE}/instructors`,
    BY_ID: (id) => `${API_BASE}/instructors/${id}`,
    DISABLE: (id) => `${API_BASE}/instructors/${id}/disable`,
    ENABLE: (id) => `${API_BASE}/instructors/${id}/enable`,
    ADD_TO_ACCOUNT: (accountId) => `${API_BASE}/instructors/add-instructor/${accountId}`,
    BY_ID_COURSES: (id) => `${API_BASE}/instructors/${id}/courses`

  },
  STUDENTS: {
    BASE: `${API_BASE}/students`,
    BY_ID: (id) => `${API_BASE}/students/${id}`,
    DISABLE: (id) => `${API_BASE}/students/${id}/disable`, // tùy logic, 1 số code = PUT / disable
    ENABLE: (id) => `${API_BASE}/students/${id}/enable`, // tùy logic
    ADD_TO_ACCOUNT: (accountId) => `${API_BASE}/students/add-student/${accountId}`,
  },
  REVIEWS: {
    BASE: `${API_BASE}/reviews`,
    BY_COURSE: (courseId) => `${API_BASE}/reviews/by-course/${courseId}`,
    BY_ID: (id) => `${API_BASE}/reviews/${id}`,
  },
  TICKETS: {
    BASE: `${API_BASE}/tickets`,
    BY_ID: (id) => `${API_BASE}/tickets/${id}`,
    RESOLVE: (id) => `${API_BASE}/tickets/${id}/resolve`,
    CLOSE: (id) => `${API_BASE}/tickets/${id}/close`,
  },
  ROLES: {
    BASE: `${API_BASE}/roles`,
    BY_ID: (id) => `${API_BASE}/roles/${id}`,
  },
  BANK_ACCOUNTS: {
    BASE: `${API_BASE}/bank-accounts`,
    BY_ID: (id) => `${API_BASE}/bank-accounts/${id}`,
  },
  WALLETS: {
    BASE: `${API_BASE}/wallets`,
    BY_ID: (id) => `${API_BASE}/wallets/${id}`,
    UPDATE_BALANCE: (id) => `${API_BASE}/wallets/${id}/balance`,
    UPDATE_STATUS: (id) => `${API_BASE}/wallets/${id}/status`,
    SET_MAX_LIMIT: (id) => `${API_BASE}/wallets/${id}/max-limit`,
  },
  TRANSACTIONS: {
    BASE: `${API_BASE}/transactions`,
    HISTORY: (walletId) => `${API_BASE}/transactions/history/${walletId}`,
    DEPOSIT: `${API_BASE}/transactions/deposit`,
    WITHDRAW: `${API_BASE}/transactions/withdraw`,
    REFUND: `${API_BASE}/transactions/refund`,
  },
  NOTIFICATIONS: {
    BASE: `${API_BASE}/notifications`,
    BY_USER: (userId) => `${API_BASE}/notifications/user/${userId}`,
    MARK_AS_READ: (id) => `${API_BASE}/notifications/${id}/read`,
    BY_ID: (id) => `${API_BASE}/notifications/${id}`, // Added for deleteNotification
  },
  ENROLLMENTS: {
    BASE: `${API_BASE}/enrollments`,
    COMPLETE: (id) => `${API_BASE}/enrollments/${id}/complete`,
    BY_STUDENT: (studentId) => `${API_BASE}/enrollments/student/${studentId}`,
    BY_COURSE: (courseId) => `${API_BASE}/enrollments/course/${courseId}`,
    BY_ID: (id) => `${API_BASE}/enrollments/${id}`,
  },
  FAVORITE_COURSES: {
    BASE: `${API_BASE}/favorite-courses`,
    ADD: `${API_BASE}/favorite-courses/add`,
    REMOVE: `${API_BASE}/favorite-courses/remove`,
  },
};
