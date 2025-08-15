import { useQuery } from '@tanstack/react-query';
import { buttonService } from '@services/domain/buttonService';
import { ButtonFilters } from '../../../types/domain/button';

interface UseButtonsOptions extends ButtonFilters {
  page?: number;
  per_page?: number;
  enabled?: boolean;
}

export function useButtons(options: UseButtonsOptions = {}) {
  const { enabled = true, ...filters } = options;
  
  return useQuery({
    queryKey: ['buttons', filters],
    queryFn: () => buttonService.getButtons(filters),
    enabled,
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}