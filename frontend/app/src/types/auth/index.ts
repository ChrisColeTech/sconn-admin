// Authentication type definitions
export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
    expiresAt: string; // ISO date
  };
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  success: boolean;
  data: {
    token: string;
    expiresAt: string;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface TokenPayload {
  sub: string; // user ID
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export type Permission = 
  | 'read:buttons'
  | 'write:buttons'
  | 'delete:buttons'
  | 'read:categories'
  | 'write:categories'
  | 'delete:categories'
  | 'read:users'
  | 'write:users'
  | 'delete:users'
  | 'read:settings'
  | 'write:settings'
  | 'admin:system'
  | 'admin:purge';

export type Role = 'admin' | 'moderator' | 'user' | 'readonly';