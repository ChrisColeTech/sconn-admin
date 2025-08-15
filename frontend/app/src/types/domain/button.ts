/**
 * Button domain types for SConnect Admin
 * 
 * CRITICAL: These types are extracted from API_REFERENCE.md to ensure
 * API compatibility. Any changes must be synchronized with the API.
 * 
 * Source: /mnt/c/Projects/sconn-admin/frontend/docs/development/API_REFERENCE.md
 */

// Import CategoryData from API types
import { CategoryData } from '../api';

export interface ButtonData {
  id: number;
  name: string;
  description?: string;
  url: string;
  itemOrder: number;
  image?: string;
  active: boolean;
  externalBrowser: boolean;
  atHome: boolean;
  addUser?: string;
  addDate?: string; // ISO date
  mtcUser?: string;
  mtcDate?: string; // ISO date
  categories?: CategoryData[];
}

export interface CreateButtonRequest {
  name: string;
  description?: string;
  url: string;
  itemOrder?: number;
  image?: string;
  active?: boolean;
  externalBrowser?: boolean;
  atHome?: boolean;
}

export interface UpdateButtonRequest {
  name?: string;
  description?: string;
  url?: string;
  itemOrder?: number;
  image?: string;
  active?: boolean;
  externalBrowser?: boolean;
  atHome?: boolean;
}

export interface GetButtonsParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  categoryId?: number;
  sort?: 'name' | 'createdAt' | 'updatedAt' | 'itemOrder';
  order?: 'asc' | 'desc';
}

export interface ButtonListResponse {
  success: boolean;
  data: {
    buttons: ButtonData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Legacy types for compatibility - to be removed
export interface ButtonFilters extends GetButtonsParams {
  search?: string;
  is_active?: boolean;
  action_type?: string;
  created_after?: string;
  created_before?: string;
}

export interface ButtonUsageAnalytics {
  button_id: string;
  total_clicks: number;
  unique_users: number;
  last_clicked_at?: string;
  click_trend: ClickTrendData[];
}

export interface ClickTrendData {
  date: string;
  clicks: number;
}