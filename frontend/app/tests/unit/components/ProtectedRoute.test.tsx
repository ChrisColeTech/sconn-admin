import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import React from 'react';

// Mock the auth context
let mockAuthContext = {
  user: null as any,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  refreshAuth: vi.fn(),
  hasPermission: vi.fn(() => false),
  hasRole: vi.fn(() => false),
};

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const TestComponent = () => <div>Protected Content</div>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading when authentication is loading', () => {
    mockAuthContext.isLoading = true;
    mockAuthContext.isAuthenticated = false;

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    mockAuthContext.isLoading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      roles: ['user'],
      permissions: ['read'],
    };

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should check permissions when requiredPermissions is provided', () => {
    mockAuthContext.isLoading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.hasPermission = vi.fn(() => true);

    renderWithRouter(
      <ProtectedRoute requiredPermissions={['read:buttons']}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(mockAuthContext.hasPermission).toHaveBeenCalledWith('read:buttons');
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should check roles when requiredRoles is provided', () => {
    mockAuthContext.isLoading = false;
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.hasRole = vi.fn(() => true);

    renderWithRouter(
      <ProtectedRoute requiredRoles={['admin']}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(mockAuthContext.hasRole).toHaveBeenCalledWith('admin');
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});