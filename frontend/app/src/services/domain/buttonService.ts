import { apiClient } from '@services/api/apiClient';
import { 
  ButtonData, 
  CreateButtonRequest, 
  UpdateButtonRequest, 
  ButtonFilters, 
  ButtonListResponse 
} from '../../types/domain/button';

export class ButtonService {
  async getButtons(filters?: ButtonFilters & { page?: number; per_page?: number }): Promise<ButtonListResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.search) params.append('search', filters.search);
      if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
      if (filters?.action_type) params.append('action_type', filters.action_type);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.per_page) params.append('per_page', filters.per_page.toString());

      const response = await apiClient.get(`/buttons?${params.toString()}`);
      
      const { buttons, pagination } = response.data.data;
      
      return {
        buttons,
        total: pagination.total,
        page: pagination.page,
        per_page: pagination.per_page,
        total_pages: pagination.total_pages
      };
    } catch (error) {
      console.error('Failed to fetch buttons:', error);
      throw error;
    }
  }

  async getButtonById(id: string): Promise<ButtonData> {
    try {
      const response = await apiClient.get(`/buttons/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch button:', error);
      throw error;
    }
  }

  async createButton(data: CreateButtonRequest): Promise<ButtonData> {
    try {
      const response = await apiClient.post('/buttons', data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create button:', error);
      throw error;
    }
  }

  async updateButton(id: string, data: UpdateButtonRequest): Promise<ButtonData> {
    try {
      const response = await apiClient.put(`/buttons/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update button:', error);
      throw error;
    }
  }

  async deleteButton(id: string): Promise<void> {
    try {
      await apiClient.delete(`/buttons/${id}`);
    } catch (error) {
      console.error('Failed to delete button:', error);
      throw error;
    }
  }

  async bulkUpdateButtons(updates: Array<{id: string; data: UpdateButtonRequest}>): Promise<ButtonData[]> {
    try {
      const response = await apiClient.post('/buttons/bulk-update', { updates });
      return response.data.data;
    } catch (error) {
      console.error('Failed to bulk update buttons:', error);
      throw error;
    }
  }

  async reorderButtons(buttonIds: string[]): Promise<void> {
    try {
      await apiClient.post('/buttons/reorder', { buttonIds });
    } catch (error) {
      console.error('Failed to reorder buttons:', error);
      throw error;
    }
  }

  async trackButtonClick(buttonId: string, properties?: any): Promise<void> {
    try {
      await apiClient.post('/analytics/track', {
        eventType: 'button_click',
        resourceType: 'button',
        resourceId: buttonId,
        properties
      });
    } catch (error) {
      console.error('Failed to track button click:', error);
      // Don't throw error for tracking failures
    }
  }
}

export const buttonService = new ButtonService();