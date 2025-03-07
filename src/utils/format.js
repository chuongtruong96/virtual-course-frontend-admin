/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @param {number} minimumFractionDigits - Minimum fraction digits (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', minimumFractionDigits = 2) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '$0.00';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: minimumFractionDigits
    }).format(amount);
  };
  
  /**
   * Format a date string or timestamp
   * @param {string|number|Date} date - The date to format
   * @param {object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date string
   */
  // Add this to your utils/format.js file or modify the existing function
export const formatDate = (date) => {
    if (!date) return 'N/A';
    
    try {
        // Handle different date formats
        const dateObj = date instanceof Date 
            ? date 
            : typeof date === 'string' 
                ? new Date(date) 
                : typeof date === 'object' && date.time 
                    ? new Date(date.time) 
                    : new Date(date);
        
        // Check if the date is valid
        if (isNaN(dateObj.getTime())) return 'Invalid Date';
        
        // Format the date
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Error';
    }
};
  
  /**
   * Format a date as relative time (e.g., "2 days ago")
   * @param {string|number|Date} date - The date to format
   * @returns {string} Relative time string
   */
  export const formatRelativeTime = (date) => {
    if (!date) return 'N/A';
    
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  };