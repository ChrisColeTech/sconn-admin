import { apiClient } from '@services/api/apiClient';

export interface DashboardMetrics {
  totalButtons: number;
  totalCategories: number;
  totalAdminUsers: number;
  systemHealth: number;
  recentActivity: ActivityEvent[];
  buttonUsageData: ButtonUsageData[];
}

export interface ActivityEvent {
  id: string;
  action: string;
  time: string;
  icon: string;
  details?: any;
}

export interface ButtonUsageData {
  date: string;
  clicks: number;
  views: number;
}

export class DashboardService {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await apiClient.get('/analytics/dashboard');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      // Return fallback data
      return {
        totalButtons: 0,
        totalCategories: 0,
        totalAdminUsers: 0,
        systemHealth: 0,
        recentActivity: [],
        buttonUsageData: []
      };
    }
  }

  async trackEvent(eventType: string, resourceType?: string, resourceId?: string, properties?: any): Promise<void> {
    try {
      await apiClient.post('/analytics/track', {
        eventType,
        resourceType,
        resourceId,
        properties
      });
    } catch (error) {
      console.error('Failed to track event:', error);
      // Don't throw error for tracking failures
    }
  }
}

export const dashboardService = new DashboardService();