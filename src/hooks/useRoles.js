// src/hooks/useRoles.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RoleService from '../services/roleService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useRoles = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch all roles
  const {
    data: roles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RoleService.fetchAll({ signal: undefined }),
    onError: (err) => {
      console.error('Error fetching roles:', err);
      addNotification('Không thể tải danh sách vai trò.', 'danger');
    },
  });

  // Add role mutation
  const addRoleMutation = useMutation({
    mutationFn: RoleService.add,
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      addNotification('Vai trò đã được thêm thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to add role:', error);
      addNotification('Không thể thêm vai trò. Vui lòng thử lại.', 'danger');
    },
  });

  // Edit role mutation
  const editRoleMutation = useMutation({
    mutationFn: RoleService.edit,
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      addNotification('Vai trò đã được cập nhật thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to edit role:', error);
      addNotification('Không thể cập nhật vai trò.', 'danger');
    },
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: RoleService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      addNotification('Vai trò đã được xóa thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete role:', error);
      addNotification('Không thể xóa vai trò.', 'danger');
    },
  });

  return {
    roles,
    isLoading,
    isError,
    error,

    addRole: addRoleMutation.mutate,
    editRole: editRoleMutation.mutate,
    deleteRole: deleteRoleMutation.mutate,

    addRoleStatus: addRoleMutation.status,
    editRoleStatus: editRoleMutation.status,
    deleteRoleStatus: deleteRoleMutation.status,
  };
};

export default useRoles;
