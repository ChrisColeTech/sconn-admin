import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@services/domain/categoryService';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../../../types/api/index';
import { useToast } from '@hooks/ui/useToast';

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.createCategory(data),
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      showToast({
        type: 'success',
        title: 'Category Created',
        message: `Category "${newCategory.name}" has been created successfully.`,
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Creation Failed',
        message: error?.response?.data?.error || 'Failed to create category. Please try again.',
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) => 
      categoryService.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      showToast({
        type: 'success',
        title: 'Category Updated',
        message: `Category "${updatedCategory.name}" has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: error?.response?.data?.error || 'Failed to update category. Please try again.',
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      showToast({
        type: 'success',
        title: 'Category Deleted',
        message: 'Category has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Deletion Failed',
        message: error?.response?.data?.error || 'Failed to delete category. Please try again.',
      });
    },
  });
}

export function useReorderCategories() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (categoryIds: number[]) => categoryService.reorderCategories(categoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      showToast({
        type: 'success',
        title: 'Categories Reordered',
        message: 'Category order has been updated successfully.',
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Reorder Failed',
        message: error?.response?.data?.error || 'Failed to reorder categories. Please try again.',
      });
    },
  });
}