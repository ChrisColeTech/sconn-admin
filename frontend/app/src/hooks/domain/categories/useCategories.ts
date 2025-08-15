import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@services/domain/categoryService';
import { GetCategoriesParams } from '../../../types/api/index';

interface UseCategoriesOptions extends GetCategoriesParams {
  enabled?: boolean;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { enabled = true, ...params } = options;
  
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoryService.getCategories(params),
    enabled,
    staleTime: 30000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
