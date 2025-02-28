import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import AdminService from '../services/adminService';
import CourseService from '../services/courseService';

const useCourses = (type = 'all') => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch courses based on type
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['courses', type],
    queryFn: async () => {
      console.log(`Fetching courses with type: ${type}`);
      try {
        let result;
        switch (type) {
          case 'pending':
            // Use the admin endpoint specifically for pending courses
            result = await AdminService.getPendingCourses();
        console.log('Pending courses result structure:', result);
        if (result && result.length > 0) {
          console.log('Sample course object:', result[0]);
          console.log('Sample course ID:', result[0].id);
        }
        return result;
          case 'all':
            result = await CourseService.fetchAll();
            return result;
          default:
            result = await AdminService.getCoursesByStatus(type);
            return result;
        }
      } catch (err) {
        console.error(`Error fetching ${type} courses:`, err);
        throw err;
      }
    },
    onError: (err) => {
      console.error('Error in useCourses hook:', err);
      addNotification('Failed to fetch courses. Please try again.', 'danger');
    },
  });

  return {
    courses: data,
    pendingCourses: type === 'pending' ? data : undefined,
    isLoading,
    isError,
    error,
    refetch
  };
};

export default useCourses;