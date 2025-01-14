// src/hooks/useEnrollments.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EnrollmentService from '../services/enrollmentService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useEnrollments = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch enrollments by student
  const fetchEnrollmentsByStudent = (studentId) => {
    return useQuery({
      queryKey: ['enrollments', 'student', studentId],
      queryFn: () => EnrollmentService.fetchEnrollmentsByStudent({ studentId, signal: undefined }),
      enabled: !!studentId,
      onError: (err) => {
        console.error('Error fetching enrollments by student:', err);
        addNotification('Không thể tải danh sách enrollments.', 'danger');
      },
    });
  };

  // Fetch enrollments by course
  const fetchEnrollmentsByCourse = (courseId) => {
    return useQuery({
      queryKey: ['enrollments', 'course', courseId],
      queryFn: () => EnrollmentService.fetchEnrollmentsByCourse({ courseId, signal: undefined }),
      enabled: !!courseId,
      onError: (err) => {
        console.error('Error fetching enrollments by course:', err);
        addNotification('Không thể tải danh sách enrollments.', 'danger');
      },
    });
  };

  // Enroll student mutation
  const enrollStudentMutation = useMutation({
    mutationFn: EnrollmentService.enrollStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(['enrollments']);
      addNotification('Đã enroll student thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to enroll student:', error);
      addNotification('Không thể enroll student. Vui lòng thử lại.', 'danger');
    },
  });

  // Complete enrollment mutation
  const completeEnrollmentMutation = useMutation({
    mutationFn: EnrollmentService.completeEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries(['enrollments']);
      addNotification('Đã hoàn thành enrollment!', 'success');
    },
    onError: (error) => {
      console.error('Failed to complete enrollment:', error);
      addNotification('Không thể hoàn thành enrollment.', 'danger');
    },
  });

  // Delete enrollment mutation
  const deleteEnrollmentMutation = useMutation({
    mutationFn: EnrollmentService.deleteEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries(['enrollments']);
      addNotification('Đã xóa enrollment thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete enrollment:', error);
      addNotification('Không thể xóa enrollment.', 'danger');
    },
  });

  return {
    fetchEnrollmentsByStudent,
    fetchEnrollmentsByCourse,

    enrollStudent: enrollStudentMutation.mutate,
    completeEnrollment: completeEnrollmentMutation.mutate,
    deleteEnrollment: deleteEnrollmentMutation.mutate,

    enrollStudentStatus: enrollStudentMutation.status,
    completeEnrollmentStatus: completeEnrollmentMutation.status,
    deleteEnrollmentStatus: deleteEnrollmentMutation.status,
  };
};

export default useEnrollments;
