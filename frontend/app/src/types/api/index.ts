/**
 * SConnect Admin API Domain Models
 * 
 * This file contains all domain models extracted from the API Reference documentation
 * to ensure API compatibility and consistency across all features.
 * 
 * Source: /mnt/c/Projects/sconn-admin/frontend/docs/development/API_REFERENCE.md
 */

// ============================================================================
// COMMON API TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      roles: string[];
      permissions: string[];
    };
    token: string;
    refreshToken: string;
    expiresAt: string; // ISO date
  };
}

// ============================================================================
// BUTTON MANAGEMENT TYPES (from API Reference)
// ============================================================================

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

export interface ButtonListResponse {
  success: boolean;
  data: {
    buttons: ButtonData[];
    pagination: PaginationData;
  };
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

// ============================================================================
// CATEGORY MANAGEMENT TYPES (from API Reference)
// ============================================================================

export interface CategoryData {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  itemOrder: number;
  addUser?: string;
  addDate?: string;
  mtcUser?: string;
  mtcDate?: string;
  buttons?: ButtonData[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  active?: boolean;
  itemOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  active?: boolean;
  itemOrder?: number;
}

export interface CategoryListResponse {
  success: boolean;
  data: {
    categories: CategoryData[];
    pagination: PaginationData;
  };
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  sort?: 'name' | 'createdAt' | 'updatedAt' | 'itemOrder';
  order?: 'asc' | 'desc';
}

// ============================================================================
// BUTTON-CATEGORY RELATIONSHIP TYPES (from API Reference)
// ============================================================================

export interface CategoryButtonData {
  categoryId: number;
  buttonId: number;
  bannerDetail?: string;
  itemOrder?: number;
  active: boolean;
  addUser?: string;
  addDate?: string;
  mtcUser?: string;
  mtcDate?: string;
  atHome: boolean;
  pilotStores?: string;
  button: ButtonData; // Include full button data
}

export interface CreateCategoryButtonRequest {
  categoryId: number;
  buttonId: number;
  bannerDetail?: string;
  itemOrder?: number;
  active?: boolean;
  atHome?: boolean;
  pilotStores?: string;
}

export interface UpdateCategoryButtonRequest {
  bannerDetail?: string;
  itemOrder?: number;
  active?: boolean;
  atHome?: boolean;
  pilotStores?: string;
}

export interface CategoryButtonListResponse {
  success: boolean;
  data: {
    relationships: CategoryButtonData[];
    pagination: PaginationData;
  };
}

// ============================================================================
// USER MANAGEMENT TYPES (from API Reference)
// ============================================================================

export interface UserData {
  employeeId: string;
  firstName?: string;
  lastName?: string;
  storeNo?: string;
  supportCenter?: number;
  country?: string;
  locationType?: string;
  bannerDetailId?: string;
}

export interface CreateUserRequest {
  employeeId: string;
  firstName?: string;
  lastName?: string;
  storeNo?: string;
  supportCenter?: number;
  country?: string;
  locationType?: string;
  bannerDetailId?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  storeNo?: string;
  supportCenter?: number;
  country?: string;
  locationType?: string;
  bannerDetailId?: string;
}

export interface UserListResponse {
  success: boolean;
  data: {
    users: UserData[];
    pagination: PaginationData;
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  storeNo?: string;
  supportCenter?: number;
  country?: string;
}

// ============================================================================
// FAVORITES MANAGEMENT TYPES (from API Reference)
// ============================================================================

export interface FavoriteData {
  id: number;
  userId: string;
  name: string;
  url?: string;
  active: boolean;
}

export interface CreateFavoriteRequest {
  userId: string;
  name: string;
  url?: string;
  active?: boolean;
}

export interface UpdateFavoriteRequest {
  name?: string;
  url?: string;
  active?: boolean;
}

export interface FavoriteListResponse {
  success: boolean;
  data: {
    favorites: FavoriteData[];
    pagination: PaginationData;
  };
}

export interface GetFavoritesParams {
  userId?: string;
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
}

// ============================================================================
// SETTINGS MANAGEMENT TYPES (from API Reference)
// ============================================================================

export interface UserSettingData {
  id: number;
  employeeId: string;
  storeNumber?: string;
  bannerDetail?: string;
  atHome: boolean;
}

export interface UpdateSettingRequest {
  employeeId: string;
  storeNumber?: string;
  bannerDetail?: string;
  atHome?: boolean;
}

export interface SettingDetailResponse {
  success: boolean;
  data: UserSettingData;
}

// ============================================================================
// DATA PURGE TYPES (from API Reference)
// ============================================================================

export interface PurgeRequest {
  action: 'purge-all' | 'purge-table';
  tableName?: string; // Required for 'purge-table'
  confirm?: boolean;
  dryRun?: boolean;
  cascade?: boolean; // For single table purge
}

export interface PurgeResult {
  success: boolean;
  tablesCleared: string[];
  rowsDeleted: Record<string, number>;
  message: string;
  dryRun?: boolean;
}

export interface TableCountsResponse {
  success: boolean;
  data: {
    message: string;
    tableCounts: {
      buttons: number;
      categories: number;
      category_buttons: number;
      favorites: number;
      settings: number;
      users: number;
    };
    totalRows: number;
  };
}

// ============================================================================
// ANALYTICS TYPES (for Dashboard)
// ============================================================================

export interface AnalyticsData {
  totalButtons: number;
  totalCategories: number;
  totalUsers: number;
  totalFavorites: number;
  buttonUsageData: ChartDataPoint[];
  recentActivity: ActivityEvent[];
  topCategories: CategoryMetric[];
  userEngagement: EngagementMetric[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
}

export interface ActivityEvent {
  id: string;
  action: string;
  time: string;
  icon: string;
}

export interface CategoryMetric {
  id: number;
  name: string;
  buttonCount: number;
  usage: number;
}

export interface EngagementMetric {
  period: string;
  activeUsers: number;
  totalActions: number;
  averageSessionTime: number;
}

// ============================================================================
// API BASE URLS
// ============================================================================

export const API_BASE_URLS = {
  development: 'https://api-v2.sconn.dev.cloud.jewels.com/dev',
  test: 'https://api-v2.sconn.test.cloud.jewels.com/test',
  staging: 'https://api-v2.sconn.stage.cloud.jewels.com/stage',
  production: 'https://api-v2.sconn.cloud.jewels.com/prod'
} as const;
