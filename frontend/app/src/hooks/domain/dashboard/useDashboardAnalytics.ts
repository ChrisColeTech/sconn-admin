import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardMetrics } from '@services/analytics/dashboardService';

export function useDashboardAnalytics() {
  return useQuery<DashboardMetrics>({
    queryKey: ['dashboard', 'analytics'],
    queryFn: () => dashboardService.getDashboardMetrics(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}