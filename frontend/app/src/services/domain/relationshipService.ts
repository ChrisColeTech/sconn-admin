import { 
  CategoryButtonData, 
  CreateCategoryButtonRequest, 
  UpdateCategoryButtonRequest, 
  CategoryButtonListResponse 
} from '../../types/api/index';
import { apiClient } from '../api/apiClient';

export class RelationshipService {
  async getCategoryButtons(categoryId: number): Promise<CategoryButtonData[]> {
    try {
      const response = await apiClient.get(`/categories/${categoryId}/buttons`);
      return response.data.data.relationships;
    } catch (error) {
      console.error('Failed to fetch category buttons:', error);
      throw error;
    }
  }

  async addButtonToCategory(data: CreateCategoryButtonRequest): Promise<CategoryButtonData> {
    try {
      const response = await apiClient.post(`/categories/${data.categoryId}/buttons`, data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to add button to category:', error);
      throw error;
    }
  }

  async updateCategoryButton(
    categoryId: number, 
    buttonId: number, 
    data: UpdateCategoryButtonRequest
  ): Promise<CategoryButtonData> {
    try {
      const response = await apiClient.put(`/categories/${categoryId}/buttons/${buttonId}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update category button:', error);
      throw error;
    }
  }

  async removeButtonFromCategory(categoryId: number, buttonId: number): Promise<void> {
    try {
      await apiClient.delete(`/categories/${categoryId}/buttons/${buttonId}`);
    } catch (error) {
      console.error('Failed to remove button from category:', error);
      throw error;
    }
  }

  async getAllRelationships(): Promise<CategoryButtonListResponse> {
    try {
      const response = await apiClient.get('/category-buttons');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all relationships:', error);
      throw error;
    }
  }
}

export const relationshipService = new RelationshipService();