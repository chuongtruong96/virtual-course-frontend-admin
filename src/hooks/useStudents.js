// src/hooks/useStudents.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import StudentService from '../services/studentService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useStudents = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch all students
  const {
    data: students,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['students'],
    queryFn: () => StudentService.fetchAll({ signal: undefined }),
    onError: (err) => {
      console.error('Error fetching students:', err);
      addNotification('Không thể tải danh sách sinh viên.', 'danger');
    },
  });

  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: StudentService.addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      addNotification('Sinh viên đã được thêm thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to add student:', error);
      addNotification('Không thể thêm sinh viên. Vui lòng thử lại.', 'danger');
    },
  });

  // Enable student mutation
  const enableStudentMutation = useMutation({
    mutationFn: StudentService.enableStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      addNotification('Sinh viên đã được kích hoạt!', 'success');
    },
    onError: (error) => {
      console.error('Failed to enable student:', error);
      addNotification('Không thể kích hoạt sinh viên.', 'danger');
    },
  });

  // Disable student mutation
  const disableStudentMutation = useMutation({
    mutationFn: StudentService.disableStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      addNotification('Sinh viên đã được vô hiệu hóa!', 'success');
    },
    onError: (error) => {
      console.error('Failed to disable student:', error);
      addNotification('Không thể vô hiệu hóa sinh viên.', 'danger');
    },
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: StudentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      addNotification('Sinh viên đã được xóa thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete student:', error);
      addNotification('Không thể xóa sinh viên.', 'danger');
    },
  });

  return {
    students,
    isLoading,
    isError,
    error,

    addStudent: addStudentMutation.mutate,
    enableStudent: enableStudentMutation.mutate,
    disableStudent: disableStudentMutation.mutate,
    deleteStudent: deleteStudentMutation.mutate,

    addStudentStatus: addStudentMutation.status,
    enableStudentStatus: enableStudentMutation.status,
    disableStudentStatus: disableStudentMutation.status,
    deleteStudentStatus: deleteStudentMutation.status,
  };
};

export default useStudents;
