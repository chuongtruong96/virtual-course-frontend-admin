/**
 * Notification types constants
 *
 * These constants match the backend NotificationType enum values
 * and are used for categorizing notifications throughout the application.
 */

// Main notification type constants that match backend enum exactly
export const NOTIFICATION_TYPES = {
  // New PascalCase values (match backend enum directly)
  PAYMENT: 'Payment',
  ENROLLMENT: 'Enrollment',
  COURSE_UPDATE: 'CourseUpdate',
  ASSIGNMENT: 'Assignment',
  TEST_REMINDER: 'TestReminder',
  GENERAL: 'General',
  
  // Abbreviated values (match backend enum directly)
  COURSE_APPROVED: 'CrsApprv',
  COURSE_REJECTED: 'CrsRejct',
  COURSE_SUBMITTED: 'CrsSubmt',
  COURSE_REVISION: 'CrsRevsn',
  SYSTEM_ALERT: 'SysAlert',
  ACCOUNT_STATUS: 'AccStatus',
  INSTRUCTOR_APPROVED: 'InstApprv',
  INSTRUCTOR_REJECTED: 'InstRejct',
  WALLET_CREDIT: 'WalletCredit',
  WALLET_DEBIT: 'WalletDebit',
  WALLET_WITHDRAWAL: 'WalletWithdrawal',
  
  // Legacy values (for backward compatibility)
  COURSE: 'COURSE',
  SYSTEM: 'SYSTEM'
};

/**
 * Helper function to convert any notification type format to the backend-compatible format
 * This ensures that even if old constants are used, the correct value is sent to the backend
 *
 * @param {string} type - The notification type (can be in any format)
 * @returns {string} - The backend-compatible notification type
 */
// Trong constants/notificationTypes.js
export const normalizeNotificationType = (type) => {
  if (!type) return 'SYSTEM';
  
  // Nếu type đã là một trong các giá trị enum, trả về nguyên bản
  if (Object.values(NOTIFICATION_TYPES).includes(type)) {
    return type;
  }
  
  // Xử lý các trường hợp đặc biệt
  switch (type.toUpperCase()) {
    case 'PAYMENT_PROCESSED':
      return 'Payment';
    case 'COURSE_UPDATE':
      return 'CourseUpdate';
    case 'TEST_REMINDER':
      return 'TestReminder';
    case 'COURSE_APPROVAL':
      return 'CrsApprv';
    case 'COURSE_REJECTION':
      return 'CrsRejct';
    case 'COURSE_SUBMISSION':
      return 'CrsSubmt';
    case 'COURSE_REVISION':
      return 'CrsRevsn';
    case 'SYSTEM_ALERT':
      return 'SysAlert';
    case 'ACCOUNT_STATUS':
      return 'AccStatus';
    case 'INSTRUCTOR_APPROVAL':
      return 'InstApprv';
    case 'INSTRUCTOR_REJECTION':
      return 'InstRejct';
    // Thêm các trường hợp khác nếu cần
    default:
      return type; // Trả về nguyên bản nếu không có xử lý đặc biệt
  }
};

/**
 * Group notification types by category for UI organization
 */
export const NOTIFICATION_CATEGORIES = {
  COURSE_RELATED: [
    NOTIFICATION_TYPES.COURSE_UPDATE,
    NOTIFICATION_TYPES.COURSE_APPROVED,
    NOTIFICATION_TYPES.COURSE_REJECTED,
    NOTIFICATION_TYPES.COURSE_SUBMITTED,
    NOTIFICATION_TYPES.COURSE_REVISION,
    NOTIFICATION_TYPES.ENROLLMENT,
    NOTIFICATION_TYPES.ASSIGNMENT,
    NOTIFICATION_TYPES.TEST_REMINDER,
    NOTIFICATION_TYPES.COURSE // Legacy
  ],
  
  PAYMENT_RELATED: [
    NOTIFICATION_TYPES.PAYMENT,
    NOTIFICATION_TYPES.WALLET_CREDIT,
    NOTIFICATION_TYPES.WALLET_DEBIT,
    NOTIFICATION_TYPES.WALLET_WITHDRAWAL
  ],
  
  ACCOUNT_RELATED: [
    NOTIFICATION_TYPES.ACCOUNT_STATUS,
    NOTIFICATION_TYPES.INSTRUCTOR_APPROVED,
    NOTIFICATION_TYPES.INSTRUCTOR_REJECTED
  ],
  
  SYSTEM: [
    NOTIFICATION_TYPES.SYSTEM_ALERT,
    NOTIFICATION_TYPES.GENERAL,
    NOTIFICATION_TYPES.SYSTEM // Legacy
  ]
};

/**
 * Display names for notification types (for UI presentation)
 */
export const NOTIFICATION_TYPE_DISPLAY_NAMES = {
  [NOTIFICATION_TYPES.PAYMENT]: 'Payment Confirmation',
  [NOTIFICATION_TYPES.ENROLLMENT]: 'Course Enrollment',
  [NOTIFICATION_TYPES.COURSE_UPDATE]: 'Course Update',
  [NOTIFICATION_TYPES.ASSIGNMENT]: 'Assignment',
  [NOTIFICATION_TYPES.TEST_REMINDER]: 'Test Reminder',
  [NOTIFICATION_TYPES.GENERAL]: 'General Notification',
  [NOTIFICATION_TYPES.COURSE_APPROVED]: 'Course Approved',
  [NOTIFICATION_TYPES.COURSE_REJECTED]: 'Course Rejected',
  [NOTIFICATION_TYPES.COURSE_SUBMITTED]: 'Course Submitted',
  [NOTIFICATION_TYPES.COURSE_REVISION]: 'Course Revision Requested',
  [NOTIFICATION_TYPES.SYSTEM_ALERT]: 'System Alert',
  [NOTIFICATION_TYPES.ACCOUNT_STATUS]: 'Account Status Update',
  [NOTIFICATION_TYPES.INSTRUCTOR_APPROVED]: 'Instructor Approved',
  [NOTIFICATION_TYPES.INSTRUCTOR_REJECTED]: 'Instructor Rejected',
  [NOTIFICATION_TYPES.WALLET_CREDIT]: 'Wallet Credit',
  [NOTIFICATION_TYPES.WALLET_DEBIT]: 'Wallet Debit',
  [NOTIFICATION_TYPES.WALLET_WITHDRAWAL]: 'Wallet Withdrawal',
  
  // Legacy mappings
  [NOTIFICATION_TYPES.COURSE]: 'Course Notification',
  [NOTIFICATION_TYPES.SYSTEM]: 'System Notification'
};

/**
 * Get badge color based on notification type
 * @param {string} type - Notification type
 * @returns {string} - Bootstrap color variant
 */
export const getNotificationBadgeColor = (type) => {
  // Course related
  if ([NOTIFICATION_TYPES.COURSE, NOTIFICATION_TYPES.COURSE_UPDATE, 
       NOTIFICATION_TYPES.COURSE_SUBMITTED, NOTIFICATION_TYPES.COURSE_REVISION,
       NOTIFICATION_TYPES.ENROLLMENT].includes(type)) {
    return 'info';
  }
  
  // Approval related
  if ([NOTIFICATION_TYPES.COURSE_APPROVED, NOTIFICATION_TYPES.INSTRUCTOR_APPROVED].includes(type)) {
    return 'success';
  }
  
  // Rejection related
  if ([NOTIFICATION_TYPES.COURSE_REJECTED, NOTIFICATION_TYPES.INSTRUCTOR_REJECTED].includes(type)) {
    return 'danger';
  }
  
  // Payment related
  if (type === NOTIFICATION_TYPES.PAYMENT) {
    return 'primary';
  }
  
  // Wallet related
  if (type === NOTIFICATION_TYPES.WALLET_CREDIT) {
    return 'success';
  }
  
  if ([NOTIFICATION_TYPES.WALLET_DEBIT, NOTIFICATION_TYPES.WALLET_WITHDRAWAL].includes(type)) {
    return 'warning';
  }
  
  // System related
  if ([NOTIFICATION_TYPES.SYSTEM, NOTIFICATION_TYPES.SYSTEM_ALERT].includes(type)) {
    return 'warning';
  }
  
  // Account related
  if (type === NOTIFICATION_TYPES.ACCOUNT_STATUS) {
    return 'secondary';
  }
  
  // Education related
  if ([NOTIFICATION_TYPES.ASSIGNMENT, NOTIFICATION_TYPES.TEST_REMINDER].includes(type)) {
    return 'dark';
  }
  
  // General
  if (type === NOTIFICATION_TYPES.GENERAL) {
    return 'light';
  }
  
  // Default
  return 'secondary';
};

/**
 * Get friendly display name for notification type
 * @param {string} type - Notification type
 * @returns {string} - User-friendly display name
 */
export const getNotificationTypeName = (type) => {
  return NOTIFICATION_TYPE_DISPLAY_NAMES[type] || type;
};