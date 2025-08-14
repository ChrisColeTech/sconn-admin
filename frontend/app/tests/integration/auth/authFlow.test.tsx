import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/domain/auth/LoginForm';
import React from 'react';

// Mock the auth service
const mockAuthService = {
  login: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
};

vi.mock('@/services/auth/authService', () => ({
  authService: mockAuthService,
}));

// Mock the token service
const mockTokenService = {
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  getToken: vi.fn(),
  getRefreshToken: vi.fn(() => null),
  initializeFromStorage: vi.fn(),
  parseToken: vi.fn(),
  isTokenExpired: vi.fn(),
  hasToken: vi.fn(() => false),
};

vi.mock('@/services/auth/tokenService', () => ({
  tokenService: mockTokenService,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTokenService.getRefreshToken.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful login flow', async () => {
    const user = userEvent.setup();
    const mockLoginResponse = {
      success: true,
      data: {
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          roles: ['user'],
          permissions: ['read'],
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
    };

    mockAuthService.login.mockResolvedValueOnce(mockLoginResponse);

    const Wrapper = createWrapper();
    render(<LoginForm />, { wrapper: Wrapper });

    // Fill in login form
    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password',
        rememberMe: false,
      });
    });

    expect(mockTokenService.setTokens).toHaveBeenCalledWith(
      'mock-jwt-token',
      'mock-refresh-token'
    );
  });

  it('should handle login failure', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials';
    
    mockAuthService.login.mockRejectedValueOnce(new Error(errorMessage));

    const Wrapper = createWrapper();
    render(<LoginForm />, { wrapper: Wrapper });

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockTokenService.setTokens).not.toHaveBeenCalled();
  });

  it('should validate form fields', async () => {
    const user = userEvent.setup();
    const Wrapper = createWrapper();
    render(<LoginForm />, { wrapper: Wrapper });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    expect(mockAuthService.login).not.toHaveBeenCalled();
  });
});