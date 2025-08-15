import { 
  ButtonData, 
  CreateButtonRequest, 
  UpdateButtonRequest, 
  GetButtonsParams, 
  ButtonListResponse 
} from '../../types/api/index';
import { apiClient } from '../api/apiClient';

export class ButtonService {
  async getButtons(params?: GetButtonsParams): Promise<ButtonListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.search) queryParams.append('search', params.search);
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());
      if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.sort) queryParams.append('sort', params.sort);
      if (params?.order) queryParams.append('order', params.order);

      const response = await apiClient.get(`/buttons?${queryParams.toString()}`);
      
      // Response matches API Reference format
      return response.data;
    } catch (error) {
      console.error('Failed to fetch buttons:', error);
      throw error;
    }
  }

  async getButtonById(id: number): Promise<ButtonData> {
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

  async updateButton(id: number, data: UpdateButtonRequest): Promise<ButtonData> {
    try {
      const response = await apiClient.put(`/buttons/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update button:', error);
      throw error;
    }
  }

  async deleteButton(id: number): Promise<void> {
    try {
      await apiClient.delete(`/buttons/${id}`);
    } catch (error) {
      console.error('Failed to delete button:', error);
      throw error;
    }
  }

  async bulkUpdateButtons(updates: Array<{id: number; data: UpdateButtonRequest}>): Promise<ButtonData[]> {
    try {
      const response = await apiClient.post('/buttons/bulk-update', { updates });
      return response.data.data;
    } catch (error) {
      console.error('Failed to bulk update buttons:', error);
      throw error;
    }
  }

  async reorderButtons(buttonIds: number[]): Promise<void> {
    try {
      await apiClient.post('/buttons/reorder', { buttonIds });
    } catch (error) {
      console.error('Failed to reorder buttons:', error);
      throw error;
    }
  }

  async trackButtonClick(buttonId: number, properties?: any): Promise<void> {
    try {
      await apiClient.post('/analytics/track', {
        eventType: 'button_click',
        resourceType: 'button',
        resourceId: buttonId.toString(),
        properties
      });
    } catch (error) {
      console.error('Failed to track button click:', error);
      // Don't throw error for tracking failures
    }
  }
}

export const buttonService = new ButtonService();