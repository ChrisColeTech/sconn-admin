import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { logout: authLogout } = useAuth();

  const logout = async () => {
    setIsLoading(true);
    try {
      await authLogout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
  };
};