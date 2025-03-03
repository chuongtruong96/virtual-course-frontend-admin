// src/utils/errorHandler.js

export const handleApiError = (error, defaultMessage) => {
  // Nếu có response error từ server
  if (error.response) {
    const { status, data } = error.response;
    
    // Xử lý các mã lỗi cụ thể
    switch (status) {
      case 400:
        throw new Error(data.message || 'Invalid request');
      case 401:
        throw new Error('Unauthorized access');
      case 403:
        throw new Error('Forbidden access');
      case 404:
        throw new Error('Resource not found');
      case 422:
        throw new Error(data.message || 'Validation error');
      case 500:
        throw new Error('Internal server error');
      default:
        throw new Error(data.message || defaultMessage);
    }
  }
  
  // Nếu lỗi request (network error)
  if (error.request) {
    throw new Error('Network error. Please check your connection.');
  }
  
  // Các lỗi khác
  throw new Error(error.message || defaultMessage);
};