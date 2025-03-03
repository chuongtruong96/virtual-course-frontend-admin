/**
 * Notification types constants
 * 
 * These constants match the backend NotificationType enum values
 * and are used for categorizing notifications throughout the application.
 * 
 * Note: This file maintains both new PascalCase values and legacy UPPERCASE values
 * for backward compatibility during transition.
 */

// Main notification type constants that match backend enum exactly
export const NOTIFICATION_TYPES = {
  // New PascalCase values (match backend enum directly)
  Payment: 'Payment',
  Enrollment: 'Enrollment',
  CourseUpdate: 'CourseUpdate',
  Assignment: 'Assignment',
  TestReminder: 'TestReminder',
  General: 'General',
  
  // Abbreviated values (match backend enum directly)
  CrsApprv: 'CrsApprv',
  CrsRejct: 'CrsRejct',
  CrsSubmt: 'CrsSubmt',
  CrsRevsn: 'CrsRevsn',
  SysAlert: 'SysAlert',
  AccStatus: 'AccStatus',
  InstApprv: 'InstApprv',
  InstRejct: 'InstRejct',
  WalletCredit: 'WalletCredit',
  WalletDebit: 'WalletDebit',
  WalletWithdrawal: 'WalletWithdrawal',
  
  // Legacy values (for backward compatibility)
  COURSE: 'COURSE',
  PAYMENT: 'Payment', // Maps to new 'Payment'
  SYSTEM: 'SYSTEM',
  COURSE_APPROVAL: 'CrsApprv', // Maps to new 'CrsApprv'
  COURSE_REJECTION: 'CrsRejct', // Maps to new 'CrsRejct'
  COURSE_SUBMISSION: 'CrsSubmt', // Maps to new 'CrsSubmt'
  COURSE_REVISION: 'CrsRevsn', // Maps to new 'CrsRevsn'
  INSTRUCTOR_APPROVAL: 'InstApprv', // Maps to new 'InstApprv'
  INSTRUCTOR_REJECTION: 'InstRejct', // Maps to new 'InstRejct'
  SYSTEM_ALERT: 'SysAlert', // Maps to new 'SysAlert'
  ACCOUNT_STATUS: 'AccStatus', // Maps to new 'AccStatus'
  PAYMENT_PROCESSED: 'Payment', // Maps to new 'Payment'
  ENROLLMENT: 'Enrollment', // Maps to new 'Enrollment'
  COURSE_UPDATE: 'CourseUpdate', // Maps to new 'CourseUpdate'
  ASSIGNMENT: 'Assignment', // Maps to new 'Assignment'
  TEST_REMINDER: 'TestReminder', // Maps to new 'TestReminder'
  WALLET_CREDIT: 'WalletCredit', // Maps to new 'WalletCredit'
  WALLET_DEBIT: 'WalletDebit', // Maps to new 'WalletDebit'
  WALLET_WITHDRAWAL: 'WalletWithdrawal' // Maps to new 'WalletWithdrawal'
};

/**
 * Helper function to convert any notification type format to the backend-compatible format
 * This ensures that even if old constants are used, the correct value is sent to the backend
 * 
 * @param {string} type - The notification type (can be in any format)
 * @returns {string} - The backend-compatible notification type
 */
export const normalizeNotificationType = (type) => {
  // If the type is already a valid backend value, return it directly
  if (Object.values(NOTIFICATION_TYPES).includes(type)) {
    return type;
  }
  
  // If it's a key in our constants object, return the mapped value
  if (NOTIFICATION_TYPES[type]) {
    return NOTIFICATION_TYPES[type];
  }
  
  // Default fallback
  console.warn(`Unknown notification type: ${type}, defaulting to 'General'`);
  return 'General';
};

/**
 * Group notification types by category for UI organization
 */
export const NOTIFICATION_CATEGORIES = {
  COURSE_RELATED: [
    NOTIFICATION_TYPES.CourseUpdate,
    NOTIFICATION_TYPES.CrsApprv,
    NOTIFICATION_TYPES.CrsRejct,
    NOTIFICATION_TYPES.CrsSubmt,
    NOTIFICATION_TYPES.CrsRevsn,
    NOTIFICATION_TYPES.Enrollment,
    NOTIFICATION_TYPES.Assignment,
    NOTIFICATION_TYPES.TestReminder
  ],
  PAYMENT_RELATED: [
    NOTIFICATION_TYPES.Payment,
    NOTIFICATION_TYPES.WalletCredit,
    NOTIFICATION_TYPES.WalletDebit,
    NOTIFICATION_TYPES.WalletWithdrawal
  ],
  ACCOUNT_RELATED: [
    NOTIFICATION_TYPES.AccStatus,
    NOTIFICATION_TYPES.InstApprv,
    NOTIFICATION_TYPES.InstRejct
  ],
  SYSTEM: [
    NOTIFICATION_TYPES.SysAlert,
    NOTIFICATION_TYPES.General
  ]
};

/**
 * Display names for notification types (for UI presentation)
 */
export const NOTIFICATION_TYPE_DISPLAY_NAMES = {
  [NOTIFICATION_TYPES.Payment]: 'Payment Confirmation',
  [NOTIFICATION_TYPES.Enrollment]: 'Course Enrollment',
  [NOTIFICATION_TYPES.CourseUpdate]: 'Course Update',
  [NOTIFICATION_TYPES.Assignment]: 'Assignment',
  [NOTIFICATION_TYPES.TestReminder]: 'Test Reminder',
  [NOTIFICATION_TYPES.General]: 'General Notification',
  [NOTIFICATION_TYPES.CrsApprv]: 'Course Approved',
  [NOTIFICATION_TYPES.CrsRejct]: 'Course Rejected',
  [NOTIFICATION_TYPES.CrsSubmt]: 'Course Submitted',
  [NOTIFICATION_TYPES.CrsRevsn]: 'Course Revision Requested',
  [NOTIFICATION_TYPES.SysAlert]: 'System Alert',
  [NOTIFICATION_TYPES.AccStatus]: 'Account Status Update',
  [NOTIFICATION_TYPES.InstApprv]: 'Instructor Approved',
  [NOTIFICATION_TYPES.InstRejct]: 'Instructor Rejected',
  [NOTIFICATION_TYPES.WalletCredit]: 'Wallet Credit',
  [NOTIFICATION_TYPES.WalletDebit]: 'Wallet Debit',
  [NOTIFICATION_TYPES.WalletWithdrawal]: 'Wallet Withdrawal',
  // Legacy mappings
  [NOTIFICATION_TYPES.COURSE]: 'Course Notification',
  [NOTIFICATION_TYPES.SYSTEM]: 'System Notification'
};