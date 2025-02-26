import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import StudentService from '../services/studentService';

const useStudents = () => {
  const { addNotification } = useContext(NotificationContext);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['students'],
    queryFn: StudentService.fetchAll,
    onError: (err) => {
      console.error('Error fetching students:', err);
      addNotification('Failed to load students', 'error');
    }
  });

  return {
    students: response?.data || [],
    isLoading,
    isError,
    error,
    refetch
  };
};

export default useStudents;