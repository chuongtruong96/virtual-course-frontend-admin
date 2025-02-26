// src/services/paymentService.js
import api from '../utils/api';
import ENDPOINTS from '../config/endpoints';

const PaymentService = {
  initiatePaypalPayment: async (courseId) => {
    const response = await api.post(ENDPOINTS.PAYMENT.PAYPAL.CREATE, { courseId });
    return response.data;
  },
  completePaypalPayment: async (paymentId, payerId) => {
    const response = await api.post(ENDPOINTS.PAYMENT.PAYPAL.EXECUTE, { paymentId, payerId });
    return response.data;
  },
  initiatePaypalPaymentForMultipleCourses: async (courseIds) => {
    const response = await api.post(ENDPOINTS.PAYMENT.PAYPAL.CREATE_MULTIPLE, { courseIds });
    return response.data;
  },
  initiateVnPayPayment: async (courseId) => {
    const response = await api.post(ENDPOINTS.PAYMENT.VNPAY.CREATE, { courseId });
    return response.data;
  },
  initiateVnPayPaymentForMultipleCourses: async (courseIds) => {
    const response = await api.post(ENDPOINTS.PAYMENT.VNPAY.CREATE_MULTIPLE, { courseIds });
    return response.data;
  },
  // etc.
};

export default PaymentService;
