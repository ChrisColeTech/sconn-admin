import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoginForm } from '@/components/domain/auth/LoginForm';
import { Loading } from '@/components/ui/Loading';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to access your SConnect Admin dashboard"
    >
      <LoginForm />
    </AuthLayout>
  );
};