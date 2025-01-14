// src/hooks/useCourses.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CourseService from '../services/courseService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const useCourses = (instructorId) => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  // 1) Fetch courses
  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: instructorId ? ['courses', instructorId] : ['courses', 'all'],
    queryFn: () => {
      if (instructorId) {
        return CourseService.fetchCoursesByInstructor({ instructorId, signal: undefined });
      } else {
        return CourseService.fetchAllCourses({ signal: undefined });
      }
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    onError: (err) => {
      console.error('Error fetching courses:', err);
      addNotification('Không thể tải danh sách khóa học.', 'danger');
    },
  });

  // 2) Add course mutation
  const addCourseMutation = useMutation({
    mutationFn: CourseService.addCourseForInstructor,
    onSuccess: () => {
      if (instructorId) {
        queryClient.invalidateQueries(['courses', instructorId]);
      } else {
        queryClient.invalidateQueries(['courses', 'all']);
      }
      addNotification('Khóa học đã được thêm thành công!', 'success');
      navigate('/dashboard/course/list-course'); 
    },
    onError: (error) => {
      console.error('Failed to add course:', error);
      addNotification('Không thể thêm khóa học. Vui lòng thử lại.', 'danger');
    },
  });

  // 3) Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: CourseService.delete,
    onSuccess: () => {
      if (instructorId) {
        queryClient.invalidateQueries(['courses', instructorId]);
      } else {
        queryClient.invalidateQueries(['courses', 'all']);
      }
      addNotification('Khóa học đã được xóa thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete course:', error);
      addNotification('Không thể xóa khóa học.', 'danger');
    },
  });

  // 4) Toggle course status mutation
  const toggleCourseStatusMutation = useMutation({
    mutationFn: async ({ courseId, currentStatus }) => {
      if (currentStatus === 'ACTIVE') {
        return CourseService.disable({ id: courseId, signal: undefined });
      } else {
        return CourseService.enable({ id: courseId, signal: undefined });
      }
    },
    onSuccess: () => {
      if (instructorId) {
        queryClient.invalidateQueries(['courses', instructorId]);
      } else {
        queryClient.invalidateQueries(['courses', 'all']);
      }
      addNotification('Thay đổi trạng thái khóa học thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to toggle course status:', error);
      addNotification('Không thể thay đổi trạng thái khóa học.', 'danger');
    },
  });

  return {
    courses: courses || [],
    isLoading,
    isError,
    error,

    addCourse: addCourseMutation.mutate,
    deleteCourse: deleteCourseMutation.mutate,
    toggleCourseStatus: toggleCourseStatusMutation.mutate,

    addCourseStatus: addCourseMutation.status,
    deleteCourseStatus: deleteCourseMutation.status,
    toggleCourseStatusStatus: toggleCourseStatusMutation.status,
  };
};

export default useCourses;
