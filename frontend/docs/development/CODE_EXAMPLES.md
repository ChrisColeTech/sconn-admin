# SConnect Admin Application - Code Examples

## 📝 Implementation Patterns and Examples

This document provides detailed code examples and implementation patterns for the SConnect Admin application. These examples demonstrate how to implement the features outlined in the implementation plan while following the architectural principles defined in the architecture guide.

## 🏗️ Project Foundation Examples

### **Vite Configuration**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react', 'react-icons'],
        },
      },
    },
  },
});
```

### **Tailwind Configuration**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

### **Environment Configuration**

```typescript
// src/lib/config.ts
interface Environment {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENABLE_DEBUG: boolean;
  ENVIRONMENT: 'development' | 'test' | 'staging' | 'production';
}

const getEnvironmentConfig = (): Environment => {
  const env = import.meta.env.MODE;
  
  const baseConfig = {
    API_TIMEOUT: 10000,
    ENABLE_DEBUG: env === 'development',
    ENVIRONMENT: env as Environment['ENVIRONMENT'],
  };
  
  switch (env) {
    case 'development':
      return {
        ...baseConfig,
        API_BASE_URL: 'https://api-v2.sconn.dev.cloud.jewels.com/dev',
      };
    case 'test':
      return {
        ...baseConfig,
        API_BASE_URL: 'https://api-v2.sconn.test.cloud.jewels.com/test',
      };
    case 'staging':
      return {
        ...baseConfig,
        API_BASE_URL: 'https://api-v2.sconn.stage.cloud.jewels.com/stage',
      };
    case 'production':
      return {
        ...baseConfig,
        API_BASE_URL: 'https://api-v2.sconn.cloud.jewels.com/prod',
        ENABLE_DEBUG: false,
      };
    default:
      throw new Error(`Unknown environment: ${env}`);
  }
};

export const config = getEnvironmentConfig();
```

## 🔐 Authentication Implementation

### **Authentication Context**

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@services/auth';
import { User, AuthState } from '@types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = authService.getStoredToken();
      if (token) {
        const user = await authService.getCurrentUser();
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const { user, token } = await authService.login(username, password);
      authService.storeToken(token);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      authService.clearToken();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      // Even if logout fails, clear local state
      authService.clearToken();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const refreshToken = async () => {
    try {
      const { token } = await authService.refreshToken();
      authService.storeToken(token);
    } catch (error) {
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### **Protected Route Component**

```typescript
// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { LoadingSpinner } from '@components/ui/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermissions.length > 0 && user) {
    const hasPermission = requiredPermissions.every(permission =>
      user.permissions.includes(permission)
    );

    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
```

## 🎨 Component Examples

### **Reusable Button Component**

```typescript
// src/components/ui/Button/Button.tsx
import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'hover:bg-gray-100',
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

### **Data Table Component**

```typescript
// src/components/ui/Table/DataTable.tsx
import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center justify-between">
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-medium text-gray-900"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-b hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## 🎣 Custom Hooks Examples

### **API Data Hook**

```typescript
// src/hooks/api/useApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@services/api';

export const useApiQuery = <T>(
  key: string[],
  endpoint: string,
  params?: Record<string, unknown>
) => {
  return useQuery({
    queryKey: key,
    queryFn: () => apiService.get<T>(endpoint, { params }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useApiMutation = <TData, TVariables>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[][];
  }
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TVariables) => {
      switch (method) {
        case 'POST':
          return apiService.post<TData>(endpoint, variables);
        case 'PUT':
          return apiService.put<TData>(endpoint, variables);
        case 'DELETE':
          return apiService.delete(endpoint);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      options?.invalidateQueries?.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    onError: options?.onError,
  });
};
```

### **Form Hook with Validation**

```typescript
// src/hooks/form/useFormWithValidation.ts
import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema: ZodSchema<T>;
  onSubmit: (values: T) => Promise<void>;
}

export const useFormWithValidation = <T>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validate = useCallback((data: T = values) => {
    try {
      validationSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errorMap[err.path[0]] = err.message;
          }
        });
        setErrors(errorMap);
      }
      return false;
    }
  }, [values, validationSchema]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    validate,
    handleSubmit,
    reset,
  };
};
```

## 🏢 Service Layer Examples

### **API Service Base Class**

```typescript
// src/services/api/ApiService.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '@lib/config';
import { authService } from '@services/auth';

export class ApiService {
  private client: AxiosInstance;

  constructor(baseURL = config.API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: config.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = authService.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await authService.refreshToken();
            const token = authService.getStoredToken();
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            authService.clearToken();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();
```

### **Domain Service Example**

```typescript
// src/services/domain/ButtonService.ts
import { ApiService } from '@services/api/ApiService';
import { ButtonData, CreateButtonRequest, UpdateButtonRequest } from '@types/domain/button';

export class ButtonService extends ApiService {
  private readonly baseEndpoint = '/buttons';

  async getButtons(params?: {
    page?: number;
    limit?: number;
    search?: string;
    active?: boolean;
    categoryId?: number;
  }): Promise<{ buttons: ButtonData[]; pagination: any }> {
    return this.get(`${this.baseEndpoint}`, { params });
  }

  async getButton(id: number): Promise<ButtonData> {
    return this.get(`${this.baseEndpoint}/${id}`);
  }

  async createButton(data: CreateButtonRequest): Promise<ButtonData> {
    return this.post(this.baseEndpoint, data);
  }

  async updateButton(id: number, data: UpdateButtonRequest): Promise<ButtonData> {
    return this.put(`${this.baseEndpoint}/${id}`, data);
  }

  async deleteButton(id: number): Promise<void> {
    return this.delete(`${this.baseEndpoint}/${id}`);
  }

  async bulkCreateButtons(buttons: CreateButtonRequest[]): Promise<{ created: number; buttons: ButtonData[] }> {
    return this.post(`${this.baseEndpoint}/bulk`, { buttons });
  }

  async bulkUpdateButtons(updates: Array<{ id: number; data: UpdateButtonRequest }>): Promise<void> {
    return this.put(`${this.baseEndpoint}/bulk`, { updates });
  }

  async bulkDeleteButtons(ids: number[]): Promise<void> {
    return this.delete(`${this.baseEndpoint}/bulk`, { data: { ids } });
  }
}

export const buttonService = new ButtonService();
```

## 📱 Page Component Examples

### **Button Management Page**

```typescript
// src/pages/buttons/ButtonListPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useButtons } from '@hooks/api/useButtons';
import { DataTable } from '@components/ui/Table';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { ButtonActions } from './components/ButtonActions';
import { buttonColumns } from './components/ButtonColumns';

export const ButtonListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedButtons, setSelectedButtons] = useState<number[]>([]);

  const {
    data: buttonsData,
    isLoading,
    error,
    refetch,
  } = useButtons({
    search: searchTerm,
    page: 1,
    limit: 20,
  });

  const columns = buttonColumns({
    onEdit: (button) => navigate(`/buttons/${button.id}/edit`),
    onDelete: (button) => console.log('Delete button:', button.id),
    onSelect: (button, selected) => {
      if (selected) {
        setSelectedButtons((prev) => [...prev, button.id]);
      } else {
        setSelectedButtons((prev) => prev.filter((id) => id !== button.id));
      }
    },
  });

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600">Error loading buttons: {error.message}</div>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Button Management</h1>
        <Button onClick={() => navigate('/buttons/create')}>
          Create Button
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <Input
          placeholder="Search buttons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        
        {selectedButtons.length > 0 && (
          <ButtonActions
            selectedIds={selectedButtons}
            onActionComplete={() => {
              setSelectedButtons([]);
              refetch();
            }}
          />
        )}
      </div>

      <DataTable
        columns={columns}
        data={buttonsData?.buttons || []}
        searchKey="name"
        isLoading={isLoading}
      />
    </div>
  );
};
```

### **Button Form Page**

```typescript
// src/pages/buttons/ButtonCreatePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateButton } from '@hooks/api/useButtons';
import { useNotifications } from '@hooks/ui/useNotifications';
import { ButtonForm } from './components/ButtonForm';
import { CreateButtonRequest } from '@types/domain/button';

export const ButtonCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: createButton, isPending } = useCreateButton();
  const { showNotification } = useNotifications();

  const handleSubmit = async (data: CreateButtonRequest) => {
    try {
      await createButton(data);
      showNotification('Button created successfully', 'success');
      navigate('/buttons');
    } catch (error) {
      showNotification('Failed to create button', 'error');
      throw error;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Button</h1>
        <p className="text-gray-600">Add a new button to the system</p>
      </div>

      <div className="max-w-2xl">
        <ButtonForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          onCancel={() => navigate('/buttons')}
        />
      </div>
    </div>
  );
};
```

## 🎭 State Management Examples

### **Zustand Store**

```typescript
// src/stores/ui/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  mode: 'light' | 'dark' | 'system';
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      setMode: (mode) => {
        set({ mode });
        updateDocumentClass(mode);
      },
      toggleMode: () => {
        const currentMode = get().mode;
        const newMode = currentMode === 'light' ? 'dark' : 'light';
        get().setMode(newMode);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          updateDocumentClass(state.mode);
        }
      },
    }
  )
);

const updateDocumentClass = (mode: 'light' | 'dark' | 'system') => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');

  if (mode === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    root.classList.add(mediaQuery.matches ? 'dark' : 'light');
  } else {
    root.classList.add(mode);
  }
};
```

## 🧪 Testing Examples

### **Component Test**

```typescript
// src/components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('Loading');
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });
});
```

### **Hook Test**

```typescript
// src/hooks/api/useButtons.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useButtons } from './useButtons';
import { buttonService } from '@services/domain/ButtonService';

// Mock the service
vi.mock('@services/domain/ButtonService', () => ({
  buttonService: {
    getButtons: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches buttons successfully', async () => {
    const mockButtons = [
      { id: 1, name: 'Test Button', url: 'https://example.com' },
    ];
    
    (buttonService.getButtons as any).mockResolvedValue({
      buttons: mockButtons,
      pagination: { page: 1, total: 1 },
    });

    const { result } = renderHook(() => useButtons(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.buttons).toEqual(mockButtons);
  });

  it('handles errors correctly', async () => {
    (buttonService.getButtons as any).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useButtons(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });
});
```

## 🚀 Performance Optimization Examples

### **Lazy Loading**

```typescript
// src/pages/index.tsx
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@components/ui/Loading';

// Lazy load page components
const DashboardPage = lazy(() => import('./dashboard/DashboardPage'));
const ButtonListPage = lazy(() => import('./buttons/ButtonListPage'));
const CategoryListPage = lazy(() => import('./categories/CategoryListPage'));

export const LazyPages = {
  Dashboard: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardPage />
    </Suspense>
  ),
  ButtonList: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <ButtonListPage />
    </Suspense>
  ),
  CategoryList: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <CategoryListPage />
    </Suspense>
  ),
};
```

### **Memoized Component**

```typescript
// src/components/domain/Button/ButtonCard.tsx
import React, { memo } from 'react';
import { ButtonData } from '@types/domain/button';

interface ButtonCardProps {
  button: ButtonData;
  onEdit: (button: ButtonData) => void;
  onDelete: (button: ButtonData) => void;
}

export const ButtonCard = memo<ButtonCardProps>(({ button, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{button.name}</h3>
          {button.description && (
            <p className="text-sm text-gray-600">{button.description}</p>
          )}
          <p className="text-xs text-gray-500">{button.url}</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(button)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(button)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="mt-2 flex items-center space-x-2">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            button.active ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-xs text-gray-500">
          {button.active ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
});

ButtonCard.displayName = 'ButtonCard';
```

These code examples provide a comprehensive foundation for implementing the SConnect Admin application while following the architectural principles and patterns outlined in the other documentation files.