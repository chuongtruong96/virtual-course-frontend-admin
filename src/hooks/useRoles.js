// src/hooks/useRole.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RoleService from '../services/roleService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

/**
 * Custom hook to handle role-related actions.
 */
const useRole = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch all roles
  const {
    data: roles,
    isLoading,
    isError,
    error,
  } = useQuery(['roles'], RoleService.fetchAll, {
    onError: (err) => {
      console.error('Error fetching roles:', err);
      addNotification('Không thể tải danh sách vai trò.', 'danger');
    },
  });

  // Create Role Mutation
  const createRoleMutation = useMutation(RoleService.createRole, {
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      addNotification('Tạo vai trò thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to create role:', error);
      addNotification('Không thể tạo vai trò.', 'danger');
    },
  });

  // Update Role Mutation
  const updateRoleMutation = useMutation(
    ({ id, data }) => RoleService.updateRole(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['roles']);
        addNotification('Cập nhật vai trò thành công!', 'success');
      },
      onError: (error) => {
        console.error('Failed to update role:', error);
        addNotification('Không thể cập nhật vai trò.', 'danger');
      },
    }
  );

  // Delete Role Mutation
  const deleteRoleMutation = useMutation(RoleService.deleteRole, {
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      addNotification('Xóa vai trò thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete role:', error);
      addNotification('Không thể xóa vai trò.', 'danger');
    },
  });

  // Find Role by Name
  const findRoleByName = (roleName) =>
    useQuery(['role', roleName], () => RoleService.findByName(roleName), {
      enabled: !!roleName,
      onError: (err) => {
        console.error('Error finding role by name:', err);
        addNotification('Không thể tìm vai trò theo tên.', 'danger');
      },
    });

  return {
    roles,
    isLoading,
    isError,
    error,

    createRole: createRoleMutation.mutate,
    updateRole: updateRoleMutation.mutate,
    deleteRole: deleteRoleMutation.mutate,
    findRoleByName,

    // Statuses
    createRoleStatus: createRoleMutation.status,
    updateRoleStatus: updateRoleMutation.status,
    deleteRoleStatus: deleteRoleMutation.status,
  };
};

export default useRole;
