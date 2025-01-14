// src/hooks/useInstructors.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import InstructorService from '../services/instructorService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const useInstructors = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  // Fetch all instructors
  const {
    data: instructors,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => InstructorService.fetchAll({ signal: undefined }),
    onError: (err) => {
      console.error('Error fetching instructors:', err);
      addNotification('Không thể tải danh sách giảng viên.', 'danger');
    },
  });

 

  // Add instructor mutation
  const addInstructorMutation = useMutation({
    mutationFn: InstructorService.add,
    onSuccess: () => {
      queryClient.invalidateQueries(['instructors']);
      addNotification('Giảng viên đã được thêm thành công!', 'success');
      navigate('/dashboard/instructors');
    },
    onError: (error) => {
      console.error('Failed to add instructor:', error);
      addNotification('Không thể thêm giảng viên. Vui lòng thử lại.', 'danger');
    },
  });

  // Edit instructor mutation
  const editInstructorMutation = useMutation({
    mutationFn: InstructorService.edit,
    onSuccess: () => {
      queryClient.invalidateQueries(['instructors']);
      addNotification('Giảng viên đã được cập nhật thành công!', 'success');
      navigate('/dashboard/instructors');
    },
    onError: (error) => {
      console.error('Failed to edit instructor:', error);
      addNotification('Không thể cập nhật giảng viên. Vui lòng thử lại.', 'danger');
    },
  });

  // Enable instructor mutation
  const enableInstructorMutation = useMutation({
    mutationFn: InstructorService.enableInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries(['instructors']);
      addNotification('Giảng viên đã được kích hoạt!', 'success');
    },
    onError: (error) => {
      console.error('Failed to enable instructor:', error);
      addNotification('Không thể kích hoạt giảng viên.', 'danger');
    },
  });

  // Disable instructor mutation
  const disableInstructorMutation = useMutation({
    mutationFn: InstructorService.disableInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries(['instructors']);
      addNotification('Giảng viên đã được vô hiệu hóa!', 'success');
    },
    onError: (error) => {
      console.error('Failed to disable instructor:', error);
      addNotification('Không thể vô hiệu hóa giảng viên.', 'danger');
    },
  });

  // Delete instructor mutation
  const deleteInstructorMutation = useMutation({
    mutationFn: InstructorService.deleteInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries(['instructors']);
      addNotification('Giảng viên đã được xóa thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete instructor:', error);
      addNotification('Không thể xóa giảng viên.', 'danger');
    },
  });

  // Add instructor to account mutation
  const addInstructorToAccountMutation = useMutation({
    mutationFn: InstructorService.addInstructorToAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(['instructors']);
      addNotification('Giảng viên đã được thêm vào account thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to add instructor to account:', error);
      addNotification('Không thể thêm giảng viên vào account.', 'danger');
    },
  });

  return {
    instructors,
    isLoading,
    isError,
    error,
    
    addInstructor: addInstructorMutation.mutate,
    editInstructor: editInstructorMutation.mutate,
    enableInstructor: enableInstructorMutation.mutate,
    disableInstructor: disableInstructorMutation.mutate,
    deleteInstructor: deleteInstructorMutation.mutate,
    addInstructorToAccount: addInstructorToAccountMutation.mutate,

    addInstructorStatus: addInstructorMutation.status,
    editInstructorStatus: editInstructorMutation.status,
    enableInstructorStatus: enableInstructorMutation.status,
    disableInstructorStatus: disableInstructorMutation.status,
    deleteInstructorStatus: deleteInstructorMutation.status,
    addInstructorToAccountStatus: addInstructorToAccountMutation.status,
  };
};

export default useInstructors;
