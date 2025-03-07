import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import PaymentService from '../../services/PaymentService';
import { useNavigate } from 'react-router-dom';

export const usePayment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('paypal'); // 'paypal' or 'vnpay'
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Single course payment
  const createPaymentMutation = useMutation({
    mutationFn: ({ courseId, platform }) => {
      setIsProcessing(true);
      setError(null);
      
      if (paymentMethod === 'paypal') {
        return PaymentService.createPaypalPayment(courseId, platform);
      } else if (paymentMethod === 'vnpay') {
        return PaymentService.createVnpayPayment(courseId);
      }
      throw new Error('Invalid payment method');
    },
    onSuccess: (data) => {
      // For PayPal, data is the approval URL
      // For VNPay, data is the payment URL
      window.location.href = data;
    },
    onError: (err) => {
      setError(err.message || 'Payment initiation failed');
      setIsProcessing(false);
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });

  // Multiple courses payment
  const createMultiplePaymentMutation = useMutation({
    mutationFn: (courseIds) => {
      setIsProcessing(true);
      setError(null);
      
      if (paymentMethod === 'paypal') {
        return PaymentService.createPaypalPaymentMultiple(courseIds);
      } else if (paymentMethod === 'vnpay') {
        return PaymentService.createVnpayPaymentMultiple(courseIds);
      }
      throw new Error('Invalid payment method');
    },
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (err) => {
      setError(err.message || 'Multiple payment initiation failed');
      setIsProcessing(false);
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });

  // Execute PayPal payment after user approval
  const executePaypalPaymentMutation = useMutation({
    mutationFn: ({ paymentId, payerId }) => {
      setIsProcessing(true);
      setError(null);
      return PaymentService.executePaypalPayment(paymentId, payerId);
    },
    onSuccess: (data) => {
      // Navigate to success page with transaction details
      navigate('/payment/success', { state: { transaction: data } });
    },
    onError: (err) => {
      setError(err.message || 'Payment execution failed');
      navigate('/payment/failed', { state: { error: err.message } });
      setIsProcessing(false);
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });

  // Initiate payment for a single course
  const initiatePayment = (courseId, platform = null) => {
    createPaymentMutation.mutate({ courseId, platform });
  };

  // Initiate payment for multiple courses
  const initiateMultiplePayment = (courseIds) => {
    createMultiplePaymentMutation.mutate(courseIds);
  };

  // Execute PayPal payment after user approval
  const executePaypalPayment = (paymentId, payerId) => {
    executePaypalPaymentMutation.mutate({ paymentId, payerId });
  };

  return {
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    error,
    initiatePayment,
    initiateMultiplePayment,
    executePaypalPayment
  };
};