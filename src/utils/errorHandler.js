// src/utils/errorHandler.js

export const handleError = (error) => {
  // Customize based on error structure
  if (error.response) {
    // Server responded with a status other than 2xx
    return error.response.data.message || 'Server Error';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network Error. Please try again.';
  } else {
    // Something else happened
    return error.message;
  }
};
