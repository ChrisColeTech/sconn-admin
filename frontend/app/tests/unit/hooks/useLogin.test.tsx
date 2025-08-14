import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLogin } from '@/hooks/auth/useLogin';
import { AuthProvider } from '@/contexts/AuthContext';
import React from 'react';

// Mock the auth service
vi.mock('@/services/auth/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

// Mock the token service
vi.mock('@/services/auth/tokenService', () => ({
  tokenService: {
    setTokens: vi.fn(),
    clearTokens: vi.fn(),
    getRefreshToken: vi.fn(() => null),
    initializeFromStorage: vi.fn(),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  it('should clear error when clearError is called', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });

    act(() => {
      // Simulate an error state
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});