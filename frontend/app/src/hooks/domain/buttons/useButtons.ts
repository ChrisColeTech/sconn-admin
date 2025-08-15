import { useQuery } from '@tanstack/react-query';
import { buttonService } from '@services/domain/buttonService';
import { GetButtonsParams } from '../../../types/domain/button';

interface UseButtonsOptions extends GetButtonsParams {
  enabled?: boolean;
}

export function useButtons(options: UseButtonsOptions = {}) {
  const { enabled = true, ...params } = options;
  
  return useQuery({
    queryKey: ['buttons', params],
    queryFn: () => buttonService.getButtons(params),
    enabled,
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}