// src/hooks/useCategory.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CategoryService from '../services/categoryService';
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const useCategory = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useContext(NotificationContext);

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: CategoryService.fetchAll,
    onError: (err) => {
      console.error('Error fetching categories:', err);
      addNotification('Không thể tải danh sách danh mục.', 'danger');
    },
    staleTime: 5 * 60 * 1000,
  });

  const createCategoryMutation = useMutation(CategoryService.createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      addNotification('Tạo danh mục thành công!', 'success');
    },
    onError: (error) => {
      console.error('Failed to create category:', error);
      addNotification('Không thể tạo danh mục.', 'danger');
    },
  });

  const updateCategoryMutation = useMutation(
    ({ id, data }) => CategoryService.updateCategory(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
        addNotification('Cập nhật danh mục thành công!', 'success');
      },
      onError: (error) => {
        console.error('Failed to update category:', error);
        addNotification('Không thể cập nhật danh mục.', 'danger');
      },
    }
  );

  const deleteCategoryMutation = useMutation(CategoryService.deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      addNotification('Xóa danh mục thành công!', 'success');
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
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    createCategoryStatus: createCategoryMutation.status,
    updateCategoryStatus: updateCategoryMutation.status,
    deleteCategoryStatus: deleteCategoryMutation.status,
  };
};

export default useCategory;
