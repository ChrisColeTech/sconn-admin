import { User } from '@/types/auth';
import { tokenService } from '@/services/auth/tokenService';

/**
 * Convert JWT payload to User object
 */
export const createUserFromToken = (payload: any): User => {
  return {
    id: payload.sub,
    username: payload.username,
    email: payload.email,
    roles: payload.roles,
    permissions: payload.permissions,
  };
};

/**
 * Initialize authentication state from storage
 */
export const initializeAuthFromStorage = async (
  refreshAuth: () => Promise<void>
): Promise<void> => {
  tokenService.initializeFromStorage();
  const storedRefreshToken = tokenService.getRefreshToken();
  
  if (storedRefreshToken) {
    try {
      await refreshAuth();
    } catch (error) {
      console.warn('Failed to refresh token on init:', error);
      tokenService.clearTokens();
    }
  }
};