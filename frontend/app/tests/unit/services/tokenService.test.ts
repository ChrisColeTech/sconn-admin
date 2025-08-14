import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { tokenService } from '@/services/auth/tokenService';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

describe('TokenService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tokenService.clearTokens();
  });

  afterEach(() => {
    tokenService.clearTokens();
  });

  describe('Token Management', () => {
    it('should set and get tokens correctly', () => {
      const token = 'test-token';
      const refreshToken = 'test-refresh-token';

      tokenService.setTokens(token, refreshToken);

      expect(tokenService.getToken()).toBe(token);
      expect(tokenService.getRefreshToken()).toBe(refreshToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_refresh_token', refreshToken);
    });

    it('should clear tokens correctly', () => {
      const token = 'test-token';
      const refreshToken = 'test-refresh-token';

      tokenService.setTokens(token, refreshToken);
      tokenService.clearTokens();

      expect(tokenService.getToken()).toBeNull();
      expect(tokenService.getRefreshToken()).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_refresh_token');
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
    });

    it('should check token existence correctly', () => {
      expect(tokenService.hasToken()).toBe(false);

      tokenService.setTokens('test-token', 'test-refresh-token');
      expect(tokenService.hasToken()).toBe(true);
    });
  });

  describe('Token Parsing', () => {
    it('should parse valid JWT token', () => {
      // Valid JWT token payload (base64 encoded)
      const payload = {
        sub: '123',
        username: 'testuser',
        email: 'test@example.com',
        roles: ['admin'],
        permissions: ['read', 'write'],
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      
      const encodedPayload = btoa(JSON.stringify(payload));
      const token = `header.${encodedPayload}.signature`;

      const parsedPayload = tokenService.parseToken(token);
      
      expect(parsedPayload).toEqual(payload);
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid-token';
      const parsedPayload = tokenService.parseToken(invalidToken);
      
      expect(parsedPayload).toBeNull();
    });
  });

  describe('Token Expiration', () => {
    it('should correctly identify expired tokens', () => {
      const expiredPayload = {
        sub: '123',
        username: 'testuser',
        email: 'test@example.com',
        roles: ['admin'],
        permissions: ['read'],
        iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago (expired)
      };
      
      const encodedPayload = btoa(JSON.stringify(expiredPayload));
      const token = `header.${encodedPayload}.signature`;

      expect(tokenService.isTokenExpired(token)).toBe(true);
    });

    it('should correctly identify valid tokens', () => {
      const validPayload = {
        sub: '123',
        username: 'testuser',
        email: 'test@example.com',
        roles: ['admin'],
        permissions: ['read'],
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      };
      
      const encodedPayload = btoa(JSON.stringify(validPayload));
      const token = `header.${encodedPayload}.signature`;

      expect(tokenService.isTokenExpired(token)).toBe(false);
    });
  });
});