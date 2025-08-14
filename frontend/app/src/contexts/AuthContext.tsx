import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, LoginRequest, User } from '@/types/auth';
import { authService } from '@/services/auth/authService';
import { tokenService } from '@/services/auth/tokenService';
import { createUserFromToken, initializeAuthFromStorage } from '@/utils/auth/authHelpers';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = async (): Promise<void> => {
    const currentRefreshToken = tokenService.getRefreshToken();
    if (!currentRefreshToken) throw new Error('No refresh token available');

    const response = await authService.refreshToken(currentRefreshToken);
    if (response.success && response.data) {
      const { token: newToken } = response.data;
      const payload = tokenService.parseToken(newToken);
      
      if (payload) {
        const userData = createUserFromToken(payload);
        setUser(userData);
        setToken(newToken);
        tokenService.setTokens(newToken, currentRefreshToken);
      }
    } else {
      throw new Error('Token refresh failed');
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await initializeAuthFromStorage(refreshAuth);
      setIsLoading(false);
    };
    initialize();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        const { user: userData, token: accessToken, refreshToken: newRefreshToken } = response.data;
        setUser(userData);
        setToken(accessToken);
        setRefreshToken(newRefreshToken);
        tokenService.setTokens(accessToken, newRefreshToken);
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const currentRefreshToken = refreshToken || tokenService.getRefreshToken();
      await authService.logout(currentRefreshToken || undefined);
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      tokenService.clearTokens();
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => 
    user?.permissions.includes(permission) ?? false;

  const hasRole = (role: string): boolean => 
    user?.roles.includes(role) ?? false;

  const value: AuthContextType = {
    user, token, refreshToken, isAuthenticated: !!user, isLoading,
    login, logout, refreshAuth, hasPermission, hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
