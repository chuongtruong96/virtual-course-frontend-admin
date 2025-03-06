// src/utils/formatters.js

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '-';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  /**
   * Format a date string or timestamp
   * @param {string|Date} dateString - The date to format
   * @returns {string} Formatted date string
   */
  export const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };