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
    development: 'https://api-v2.sconn.dev.cloud.jewels.com/dev',
    test: 'https://api-v2.sconn.test.cloud.jewels.com/test',
    staging: 'https://api-v2.sconn.stage.cloud.jewels.com/stage',
    production: 'https://api-v2.sconn.cloud.jewels.com/prod'
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
        '/auth/login',
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
        '/auth/refresh',
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
  async logout(): Promise<LogoutResponse> {
    try {
      const response: AxiosResponse<LogoutResponse> = await this.apiClient.post(
        '/auth/logout'
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