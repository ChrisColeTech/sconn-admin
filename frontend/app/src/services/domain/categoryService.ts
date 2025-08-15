import { 
  CategoryData, 
  CreateCategoryRequest, 
  UpdateCategoryRequest, 
  GetCategoriesParams, 
  CategoryListResponse 
} from '../../types/api/index';
import { apiClient } from '../api/apiClient';

export class CategoryService {
  async getCategories(params?: GetCategoriesParams): Promise<CategoryListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.search) queryParams.append('search', params.search);
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.sort) queryParams.append('sort', params.sort);
      if (params?.order) queryParams.append('order', params.order);

      const response = await apiClient.get(`/categories?${queryParams.toString()}`);
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  async getCategoryById(id: number): Promise<CategoryData> {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch category:', error);
      throw error;
    }
  }

  async createCategory(data: CreateCategoryRequest): Promise<CategoryData> {
    try {
      const response = await apiClient.post('/categories', data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  }

  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<CategoryData> {
    try {
      const response = await apiClient.put(`/categories/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await apiClient.delete(`/categories/${id}`);
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  }

  async reorderCategories(categoryIds: number[]): Promise<void> {
    try {
      await apiClient.post('/categories/reorder', { categoryIds });
    } catch (error) {
      console.error('Failed to reorder categories:', error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
