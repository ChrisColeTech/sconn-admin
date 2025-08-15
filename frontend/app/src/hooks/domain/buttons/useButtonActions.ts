import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buttonService } from '@services/domain/buttonService';
import { CreateButtonRequest, UpdateButtonRequest } from '../../../types/domain/button';
import { useToast } from '@hooks/ui/useToast';

export function useCreateButton() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: CreateButtonRequest) => buttonService.createButton(data),
    onSuccess: (newButton) => {
      // Invalidate and refetch buttons list
      queryClient.invalidateQueries({ queryKey: ['buttons'] });
      
      showToast({
        type: 'success',
        title: 'Button Created',
        message: `Button "${newButton.name}" has been created successfully.`,
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Creation Failed',
        message: error?.response?.data?.error || 'Failed to create button. Please try again.',
      });
    },
  });
}

export function useUpdateButton() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateButtonRequest }) => 
      buttonService.updateButton(id, data),
    onSuccess: (updatedButton) => {
      // Invalidate and refetch buttons list
      queryClient.invalidateQueries({ queryKey: ['buttons'] });
      
      showToast({
        type: 'success',
        title: 'Button Updated',
        message: `Button "${updatedButton.name}" has been updated successfully.`,
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: error?.response?.data?.error || 'Failed to update button. Please try again.',
      });
    },
  });
}

export function useDeleteButton() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: number) => buttonService.deleteButton(id),
    onSuccess: () => {
      // Invalidate and refetch buttons list
      queryClient.invalidateQueries({ queryKey: ['buttons'] });
      
      showToast({
        type: 'success',
        title: 'Button Deleted',
        message: 'Button has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Deletion Failed',
        message: error?.response?.data?.error || 'Failed to delete button. Please try again.',
      });
    },
  });
}

export function useBulkUpdateButtons() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (updates: Array<{id: number; data: UpdateButtonRequest}>) => 
      buttonService.bulkUpdateButtons(updates),
    onSuccess: (updatedButtons) => {
      queryClient.invalidateQueries({ queryKey: ['buttons'] });
      
      showToast({
        type: 'success',
        title: 'Bulk Update Complete',
        message: `${updatedButtons.length} buttons have been updated successfully.`,
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Bulk Update Failed',
        message: error?.response?.data?.error || 'Failed to update buttons. Please try again.',
      });
    },
  });
}

export function useReorderButtons() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (buttonIds: number[]) => buttonService.reorderButtons(buttonIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buttons'] });
      
      showToast({
        type: 'success',
        title: 'Buttons Reordered',
        message: 'Button order has been updated successfully.',
      });
    },
    onError: (error: any) => {
      showToast({
        type: 'error',
        title: 'Reorder Failed',
        message: error?.response?.data?.error || 'Failed to reorder buttons. Please try again.',
      });
    },
  });
}