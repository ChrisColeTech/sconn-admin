import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { tokenService } from '@/services/auth/tokenService';
import { authService } from '@/services/auth/authService';

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

class ApiClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: getApiBaseUrl(),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = tokenService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
            // Wait for the ongoing refresh
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.axiosInstance.request(originalRequest));
              });
            });
          }

          this.isRefreshing = true;

          try {
            const refreshToken = tokenService.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const response = await authService.refreshToken(refreshToken);
            const newToken = response.data.token;

            tokenService.setTokens(newToken, refreshToken);
            
            // Notify all waiting requests
            this.refreshSubscribers.forEach(callback => callback(newToken));
            this.refreshSubscribers = [];

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            return this.axiosInstance.request(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            tokenService.clearTokens();
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const apiClient = new ApiClient().instance;