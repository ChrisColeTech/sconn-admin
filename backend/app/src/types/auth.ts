export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAdminUserRequest {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

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
    expiresAt: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    token: string;
    expiresAt: string;
  };
}

export interface JWTPayload {
  sub: string; // user id
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export type Permission = 
  | 'read:buttons' | 'write:buttons' | 'delete:buttons'
  | 'read:categories' | 'write:categories' | 'delete:categories'  
  | 'read:users' | 'write:users' | 'delete:users'
  | 'read:settings' | 'write:settings'
  | 'admin:system' | 'admin:purge';

export type Role = 'admin' | 'moderator' | 'user' | 'readonly';