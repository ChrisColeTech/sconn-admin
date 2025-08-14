import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginRequest } from '@/types/auth';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      await authLogin(credentials);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    login,
    isLoading,
    error,
    clearError,
  };
};