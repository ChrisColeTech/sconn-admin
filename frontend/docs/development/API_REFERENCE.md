# SConnect Admin Application - API Reference

## 🌐 API Overview

This document provides comprehensive documentation for all API endpoints used by the SConnect Admin application. All endpoints follow RESTful conventions and return JSON responses with consistent error handling and authentication requirements.

## 🔗 Base URLs by Environment

```typescript
const API_BASE_URLS = {
  development: 'https://api-v2.sconn.dev.cloud.jewels.com/dev',
  test: 'https://api-v2.sconn.test.cloud.jewels.com/test',
  staging: 'https://api-v2.sconn.stage.cloud.jewels.com/stage',
  production: 'https://api-v2.sconn.cloud.jewels.com/prod'
};
```

## 🔐 Authentication

### **Authentication Method**
- **Type**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Token Refresh**: Automatic refresh when token expires
- **Session Timeout**: 8 hours of inactivity

### **Authentication Endpoints**

#### `POST /auth/login`
Authenticate user and receive JWT token.

**Request:**
```typescript
interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}
```

**Response:**
```typescript
interface LoginResponse {
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
```

#### `POST /auth/refresh`
Refresh expired JWT token.

**Request:**
```typescript
interface RefreshRequest {
  refreshToken: string;
}
```

**Response:**
```typescript
interface RefreshResponse {
  success: boolean;
  data: {
    token: string;
    expiresAt: string;
  };
}
```

#### `POST /auth/logout`
Invalidate current session.

**Request:** No body required
**Response:**
```typescript
interface LogoutResponse {
  success: boolean;
  message: string;
}
```

## 📊 Common Response Format

All API responses follow this consistent format:

```typescript
interface ApiResponse<T = unknown> {
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
```

## 🔲 Button Management Endpoints

### **GET /buttons**
Retrieve list of buttons with optional filtering and pagination.

**Query Parameters:**
- `page?: number` (default: 1)
- `limit?: number` (default: 20, max: 100)
- `search?: string` (search in name and description)
- `active?: boolean` (filter by active status)
- `categoryId?: number` (filter by category)
- `sort?: 'name' | 'createdAt' | 'updatedAt' | 'itemOrder'` (default: 'itemOrder')
- `order?: 'asc' | 'desc'` (default: 'asc')

**Response:**
```typescript
interface ButtonListResponse {
  success: boolean;
  data: {
    buttons: ButtonData[];
    pagination: PaginationData;
  };
}

interface ButtonData {
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
```

### **GET /buttons/{id}**
Retrieve specific button by ID.

**Path Parameters:**
- `id: number` - Button ID

**Response:**
```typescript
interface ButtonDetailResponse {
  success: boolean;
  data: ButtonData;
}
```

### **POST /buttons**
Create new button(s).

**Request (Single Button):**
```typescript
interface CreateButtonRequest {
  name: string;
  description?: string;
  url: string;
  itemOrder?: number;
  image?: string;
  active?: boolean;
  externalBrowser?: boolean;
  atHome?: boolean;
}
```

**Request (Bulk Creation):**
```typescript
interface BulkCreateButtonRequest {
  buttons: CreateButtonRequest[];
}
```

**Response:**
```typescript
interface CreateButtonResponse {
  success: boolean;
  data: ButtonData | { created: number; buttons: ButtonData[] };
}
```

### **PUT /buttons/{id}**
Update existing button.

**Path Parameters:**
- `id: number` - Button ID

**Request:**
```typescript
interface UpdateButtonRequest {
  name?: string;
  description?: string;
  url?: string;
  itemOrder?: number;
  image?: string;
  active?: boolean;
  externalBrowser?: boolean;
  atHome?: boolean;
}
```

**Response:**
```typescript
interface UpdateButtonResponse {
  success: boolean;
  data: ButtonData;
}
```

### **DELETE /buttons/{id}**
Delete button by ID.

**Path Parameters:**
- `id: number` - Button ID

**Response:**
```typescript
interface DeleteButtonResponse {
  success: boolean;
  message: string;
}
```

## 🏷️ Category Management Endpoints

### **GET /categories**
Retrieve list of categories with optional filtering.

**Query Parameters:**
- `page?: number`
- `limit?: number`
- `search?: string`
- `active?: boolean`
- `sort?: 'name' | 'createdAt' | 'updatedAt' | 'itemOrder'`
- `order?: 'asc' | 'desc'`

**Response:**
```typescript
interface CategoryListResponse {
  success: boolean;
  data: {
    categories: CategoryData[];
    pagination: PaginationData;
  };
}

interface CategoryData {
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
```

### **GET /categories/{id}**
Retrieve specific category by ID.

**Path Parameters:**
- `id: number` - Category ID

**Response:**
```typescript
interface CategoryDetailResponse {
  success: boolean;
  data: CategoryData;
}
```

### **POST /categories**
Create new category(s).

**Request:**
```typescript
interface CreateCategoryRequest {
  name: string;
  description?: string;
  active?: boolean;
  itemOrder?: number;
}
```

**Response:**
```typescript
interface CreateCategoryResponse {
  success: boolean;
  data: CategoryData;
}
```

### **PUT /categories/{id}**
Update existing category.

**Path Parameters:**
- `id: number` - Category ID

**Request:**
```typescript
interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  active?: boolean;
  itemOrder?: number;
}
```

**Response:**
```typescript
interface UpdateCategoryResponse {
  success: boolean;
  data: CategoryData;
}
```

### **DELETE /categories/{id}**
Delete category by ID.

**Path Parameters:**
- `id: number` - Category ID

**Response:**
```typescript
interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}
```

## 🔗 Button-Category Relationship Endpoints

### **GET /category-buttons**
Retrieve button-category relationships.

**Query Parameters:**
- `categoryId?: number` - Filter by category
- `buttonId?: number` - Filter by button
- `page?: number`
- `limit?: number`

**Response:**
```typescript
interface CategoryButtonListResponse {
  success: boolean;
  data: {
    relationships: CategoryButtonData[];
    pagination: PaginationData;
  };
}

interface CategoryButtonData {
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
}
```

### **POST /category-buttons**
Create button-category relationship.

**Request:**
```typescript
interface CreateCategoryButtonRequest {
  categoryId: number;
  buttonId: number;
  bannerDetail?: string;
  itemOrder?: number;
  active?: boolean;
  atHome?: boolean;
  pilotStores?: string;
}
```

**Response:**
```typescript
interface CreateCategoryButtonResponse {
  success: boolean;
  data: CategoryButtonData;
}
```

### **PUT /category-buttons**
Update button-category relationship.

**Query Parameters:**
- `categoryId: number` - Category ID
- `buttonId: number` - Button ID

**Request:**
```typescript
interface UpdateCategoryButtonRequest {
  bannerDetail?: string;
  itemOrder?: number;
  active?: boolean;
  atHome?: boolean;
  pilotStores?: string;
}
```

**Response:**
```typescript
interface UpdateCategoryButtonResponse {
  success: boolean;
  data: CategoryButtonData;
}
```

### **DELETE /category-buttons**
Delete button-category relationship.

**Query Parameters:**
- `categoryId: number` - Category ID
- `buttonId: number` - Button ID

**Response:**
```typescript
interface DeleteCategoryButtonResponse {
  success: boolean;
  message: string;
}
```

## 👥 User Management Endpoints

### **GET /users**
Retrieve list of users.

**Query Parameters:**
- `page?: number`
- `limit?: number`
- `search?: string` (search in employeeId, firstName, lastName)
- `storeNo?: string`
- `supportCenter?: number`
- `country?: string`

**Response:**
```typescript
interface UserListResponse {
  success: boolean;
  data: {
    users: UserData[];
    pagination: PaginationData;
  };
}

interface UserData {
  employeeId: string;
  firstName?: string;
  lastName?: string;
  storeNo?: string;
  supportCenter?: number;
  country?: string;
  locationType?: string;
  bannerDetailId?: string;
}
```

### **GET /users/{employeeId}**
Retrieve specific user by employee ID.

**Path Parameters:**
- `employeeId: string` - Employee ID

**Response:**
```typescript
interface UserDetailResponse {
  success: boolean;
  data: UserData;
}
```

### **POST /users**
Create new user(s).

**Request:**
```typescript
interface CreateUserRequest {
  employeeId: string;
  firstName?: string;
  lastName?: string;
  storeNo?: string;
  supportCenter?: number;
  country?: string;
  locationType?: string;
  bannerDetailId?: string;
}
```

**Response:**
```typescript
interface CreateUserResponse {
  success: boolean;
  data: UserData;
}
```

### **PUT /users/{employeeId}**
Update existing user.

**Path Parameters:**
- `employeeId: string` - Employee ID

**Request:**
```typescript
interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  storeNo?: string;
  supportCenter?: number;
  country?: string;
  locationType?: string;
  bannerDetailId?: string;
}
```

**Response:**
```typescript
interface UpdateUserResponse {
  success: boolean;
  data: UserData;
}
```

## ⭐ Favorites Management Endpoints

### **GET /favorites**
Retrieve list of favorites.

**Query Parameters:**
- `userId?: string` - Filter by user
- `page?: number`
- `limit?: number`
- `search?: string`
- `active?: boolean`

**Response:**
```typescript
interface FavoriteListResponse {
  success: boolean;
  data: {
    favorites: FavoriteData[];
    pagination: PaginationData;
  };
}

interface FavoriteData {
  id: number;
  userId: string;
  name: string;
  url?: string;
  active: boolean;
}
```

### **POST /favorites**
Create new favorite.

**Request:**
```typescript
interface CreateFavoriteRequest {
  userId: string;
  name: string;
  url?: string;
  active?: boolean;
}
```

**Response:**
```typescript
interface CreateFavoriteResponse {
  success: boolean;
  data: FavoriteData;
}
```

### **PUT /favorites/{id}**
Update existing favorite.

**Path Parameters:**
- `id: number` - Favorite ID

**Request:**
```typescript
interface UpdateFavoriteRequest {
  name?: string;
  url?: string;
  active?: boolean;
}
```

**Response:**
```typescript
interface UpdateFavoriteResponse {
  success: boolean;
  data: FavoriteData;
}
```

### **DELETE /favorites/{id}**
Delete favorite by ID.

**Path Parameters:**
- `id: number` - Favorite ID

**Response:**
```typescript
interface DeleteFavoriteResponse {
  success: boolean;
  message: string;
}
```

## ⚙️ Settings Management Endpoints

### **GET /settings/{employeeId}**
Retrieve user settings by employee ID.

**Path Parameters:**
- `employeeId: string` - Employee ID

**Response:**
```typescript
interface SettingDetailResponse {
  success: boolean;
  data: UserSettingData;
}

interface UserSettingData {
  id: number;
  employeeId: string;
  storeNumber?: string;
  bannerDetail?: string;
  atHome: boolean;
}
```

### **PUT /settings**
Update user settings.

**Request:**
```typescript
interface UpdateSettingRequest {
  employeeId: string;
  storeNumber?: string;
  bannerDetail?: string;
  atHome?: boolean;
}
```

**Response:**
```typescript
interface UpdateSettingResponse {
  success: boolean;
  data: UserSettingData;
}
```

## 🗑️ Data Purge Endpoints

### **GET /purge**
Get purge operation information and help.

**Query Parameters:**
- `action?: 'table-counts' | 'dry-run'`

**Response (table-counts):**
```typescript
interface TableCountsResponse {
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
```

**Response (dry-run):**
```typescript
interface DryRunResponse {
  success: boolean;
  data: {
    message: string;
    result: PurgeResult;
  };
}
```

**Response (help):**
```typescript
interface PurgeHelpResponse {
  success: boolean;
  data: {
    message: string;
    actions: Record<string, string>;
    examples: Record<string, string>;
    warning: string;
  };
}
```

### **POST /purge**
Execute purge operation.

**Request:**
```typescript
interface PurgeRequest {
  action: 'purge-all' | 'purge-table';
  tableName?: string; // Required for 'purge-table'
  confirm?: boolean;
  dryRun?: boolean;
  cascade?: boolean; // For single table purge
}
```

**Response:**
```typescript
interface PurgeResponse {
  success: boolean;
  data: {
    message: string;
    result: PurgeResult;
  };
}

interface PurgeResult {
  success: boolean;
  tablesCleared: string[];
  rowsDeleted: Record<string, number>;
  message: string;
  dryRun?: boolean;
}
```

### **DELETE /purge**
Alternative purge endpoint using DELETE method.

**Headers:**
- `X-Confirm-Purge: yes` - Required for confirmation

**Response:**
```typescript
interface DeletePurgeResponse {
  success: boolean;
  data: {
    message: string;
    result: PurgeResult;
  };
}
```

## 📊 SConnect Integration Endpoint

### **GET /sconnect/{id}**
Retrieve SConnect user data by ID.

**Path Parameters:**
- `id: string` - User ID

**Response:**
```typescript
interface SConnectResponse {
  success: boolean;
  data: {
    inError: boolean;
    message?: string;
    employeeId?: string;
    firstName?: string;
    lastName?: string;
    storeNumber?: string;
    supportCenter?: string;
    bannerDetail?: string | null;
    ipAddress?: string;
    lastLoginDate?: string;
    previousStoreNumber?: string;
    previousBannerDetail?: string | null;
    atHome: boolean;
    completedCovidSurveyToday: boolean;
    showCovidSurvey: boolean;
    categories?: CategoryData[];
    favorites?: FavoriteData[];
    adminBannerDetails?: BannerDetailData[];
  };
}

interface BannerDetailData {
  name: string;
  value: string;
  categories?: CategoryData[];
}
```

## 🏥 Health Check Endpoint

### **GET /health**
System health check.

**Response:**
```typescript
interface HealthResponse {
  success: boolean;
  data: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    uptime: number;
    environment: string;
    version: string;
  };
}
```

## 🚨 Error Handling

### **HTTP Status Codes**
- `200 OK` - Successful operation
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### **Error Response Format**
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: {
      field?: string;
      validation?: string[];
      stack?: string; // Only in development
    };
  };
}
```

### **Common Error Codes**
- `VALIDATION_ERROR` - Request validation failed
- `AUTHENTICATION_ERROR` - Authentication failed
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

## 🔒 Rate Limiting

### **Rate Limits by Endpoint Type**
- **Authentication**: 5 requests per minute
- **Read Operations**: 100 requests per minute
- **Write Operations**: 50 requests per minute
- **Purge Operations**: 5 requests per hour
- **Bulk Operations**: 10 requests per minute

### **Rate Limit Headers**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📝 Usage Examples

### **TypeScript Service Implementation**
```typescript
class ButtonService {
  private apiClient: ApiClient;
  
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }
  
  async getButtons(params?: GetButtonsParams): Promise<ButtonData[]> {
    const response = await this.apiClient.get<ButtonListResponse>('/buttons', { params });
    return response.data.buttons;
  }
  
  async createButton(data: CreateButtonRequest): Promise<ButtonData> {
    const response = await this.apiClient.post<CreateButtonResponse>('/buttons', data);
    return response.data;
  }
  
  async updateButton(id: number, data: UpdateButtonRequest): Promise<ButtonData> {
    const response = await this.apiClient.put<UpdateButtonResponse>(`/buttons/${id}`, data);
    return response.data;
  }
  
  async deleteButton(id: number): Promise<void> {
    await this.apiClient.delete(`/buttons/${id}`);
  }
}
```

### **React Query Integration**
```typescript
const useButtons = (params?: GetButtonsParams) => {
  return useQuery({
    queryKey: ['buttons', params],
    queryFn: () => buttonService.getButtons(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const useCreateButton = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: buttonService.createButton,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buttons'] });
    },
  });
};
```

This API reference provides comprehensive documentation for all endpoints used by the SConnect Admin application, ensuring consistent integration and proper error handling throughout the application.