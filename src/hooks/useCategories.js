// src/hooks/useCategories.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CategoryService from '../services/categoryService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useCategories = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  // Fetch all categories
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.fetchAll({ signal: undefined }),
    onError: (err) => {
      console.error('Error fetching categories:', err);
      addNotification('Không thể tải danh sách danh mục.', 'danger');
    },
  });

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: CategoryService.addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      addNotification('Danh mục đã được thêm thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to add category:', error);
      addNotification('Không thể thêm danh mục. Vui lòng thử lại.', 'danger');
    },
  });

  // Edit category mutation
  const editCategoryMutation = useMutation({
    mutationFn: CategoryService.editCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      addNotification('Danh mục đã được cập nhật thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to edit category:', error);
      addNotification('Không thể cập nhật danh mục.', 'danger');
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: CategoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      addNotification('Danh mục đã được xóa thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete category:', error);
      addNotification('Không thể xóa danh mục.', 'danger');
    },
  });

  return {
    categories,
    isLoading,
    isError,
    error,

    addCategory: addCategoryMutation.mutate,
    editCategory: editCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,

    addCategoryStatus: addCategoryMutation.status,
    editCategoryStatus: editCategoryMutation.status,
    deleteCategoryStatus: deleteCategoryMutation.status,
  };
};

export default useCategories;
