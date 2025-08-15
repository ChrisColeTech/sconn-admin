import { useMutation, useQueryClient } from '@tanstack/react-query';
import { relationshipService } from '@services/domain/relationshipService';
import { CreateCategoryButtonRequest, UpdateCategoryButtonRequest } from '../../../types/api/index';
import { useToast } from '@hooks/ui/useToast';

export function useAddButtonToCategory() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCategoryButtonRequest) => relationshipService.addButtonToCategory(data),
    onSuccess: (newRelationship) => {
      queryClient.invalidateQueries({ queryKey: ['category-buttons', newRelationship.categoryId] });
      queryClient.invalidateQueries({ queryKey: ['category-buttons'] });
      
      showToast({
        type: 'success',
        title: 'Button Added',
        message: 'Button has been successfully added to the category.',
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Addition Failed',
        message: error?.response?.data?.error || 'Failed to add button to category. Please try again.',
      });
    },
  });
}

export function useUpdateCategoryButton() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ categoryId, buttonId, data }: { 
      categoryId: number; 
      buttonId: number; 
      data: UpdateCategoryButtonRequest 
    }) => relationshipService.updateCategoryButton(categoryId, buttonId, data),
    onSuccess: (updatedRelationship) => {
      queryClient.invalidateQueries({ queryKey: ['category-buttons', updatedRelationship.categoryId] });
      
      showToast({
        type: 'success',
        title: 'Relationship Updated',
        message: 'Button relationship has been updated successfully.',
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: error?.response?.data?.error || 'Failed to update button relationship. Please try again.',
      });
    },
  });
}

export function useRemoveButtonFromCategory() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ categoryId, buttonId }: { categoryId: number; buttonId: number }) => 
      relationshipService.removeButtonFromCategory(categoryId, buttonId),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: ['category-buttons', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['category-buttons'] });
      
      showToast({
        type: 'success',
        title: 'Button Removed',
        message: 'Button has been removed from the category.',
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Removal Failed',
        message: error?.response?.data?.error || 'Failed to remove button from category. Please try again.',
      });
    },
  });
}

export function useRelationshipActions() {
  return {
    addButtonToCategory: useAddButtonToCategory(),
    updateCategoryButton: useUpdateCategoryButton(),
    removeButtonFromCategory: useRemoveButtonFromCategory(),
  };
}