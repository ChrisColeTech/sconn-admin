import axios, { AxiosResponse } from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  RefreshRequest, 
  RefreshResponse, 
  LogoutResponse 
} from '@/types/auth';

const getApiBaseUrl = (): string => {
  const env = import.meta.env.VITE_NODE_ENV || 'development';
  const baseUrls: Record<string, string> = {
    development: 'http://localhost:3001',
    test: 'http://localhost:3001',
    staging: 'http://localhost:3001',
    production: 'http://localhost:3001'
  };
  
  return baseUrls[env] || baseUrls.development;
};

class AuthService {
  private readonly apiClient = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Authenticate user with credentials
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.apiClient.post(
        '/api/auth/login',
        credentials
      );
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.error?.message || 'Login failed');
      }
      throw new Error('Network error during login');
    }
  }

  /**
   * Refresh expired access token
   */
  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    try {
      const response: AxiosResponse<RefreshResponse> = await this.apiClient.post(
        '/api/auth/refresh',
        { refreshToken } as RefreshRequest
      );
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.error?.message || 'Token refresh failed');
      }
      throw new Error('Network error during token refresh');
    }
  }

  /**
   * Logout user and invalidate session
   */
  async logout(refreshToken?: string): Promise<LogoutResponse> {
    try {
      const response: AxiosResponse<LogoutResponse> = await this.apiClient.post(
        '/api/auth/logout',
        { refreshToken }
      );
      
      return response.data;
    } catch (error) {
      // Logout should succeed even if server request fails
      console.warn('Logout request failed, proceeding with local logout');
      return {
        success: true,
        message: 'Logged out locally'
      };
    }
  }
}

export const authService = new AuthService();