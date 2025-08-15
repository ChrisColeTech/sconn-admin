// Button domain types for SConnect Admin

export interface ButtonData {
  id: string;
  name: string;
  display_text: string;
  icon?: string;
  color?: string;
  action_type: 'navigate' | 'external' | 'function' | 'modal';
  action_value?: string;
  description?: string;
  is_active: boolean;
  order_index: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateButtonRequest {
  name: string;
  display_text: string;
  icon?: string;
  color?: string;
  action_type: 'navigate' | 'external' | 'function' | 'modal';
  action_value?: string;
  description?: string;
  is_active?: boolean;
  order_index?: number;
}

export interface UpdateButtonRequest {
  name?: string;
  display_text?: string;
  icon?: string;
  color?: string;
  action_type?: 'navigate' | 'external' | 'function' | 'modal';
  action_value?: string;
  description?: string;
  is_active?: boolean;
  order_index?: number;
}

export interface ButtonFilters {
  search?: string;
  is_active?: boolean;
  action_type?: string;
  created_after?: string;
  created_before?: string;
}

export interface ButtonListResponse {
  buttons: ButtonData[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
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