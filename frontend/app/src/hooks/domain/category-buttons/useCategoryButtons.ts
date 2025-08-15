import { useQuery } from '@tanstack/react-query';
import { relationshipService } from '@services/domain/relationshipService';

export function useCategoryButtons(categoryId: number, enabled = true) {
  return useQuery({
    queryKey: ['category-buttons', categoryId],
    queryFn: () => relationshipService.getCategoryButtons(categoryId),
    enabled: enabled && !!categoryId,
    staleTime: 30000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}