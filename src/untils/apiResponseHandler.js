// src/utils/apiResponseHandler.js
export const handleResponse = (response) => response.data;

export const handleError = (error) => {
  console.error("API Error:", error.response || error.message);
  throw error.response?.data?.message || "An unexpected error occurred.";
};
