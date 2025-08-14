import { useAuth } from '@/contexts/AuthContext';
import { Permission, Role } from '@/types/auth';

export const usePermissions = () => {
  const { user, hasPermission, hasRole } = useAuth();

  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(permission);
  };

  const checkRole = (role: Role): boolean => {
    return hasRole(role);
  };

  const checkMultiplePermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const checkAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const checkMultipleRoles = (roles: Role[]): boolean => {
    return roles.every(role => hasRole(role));
  };

  const checkAnyRole = (roles: Role[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isModerator = (): boolean => {
    return hasRole('admin') || hasRole('moderator');
  };

  return {
    user,
    checkPermission,
    checkRole,
    checkMultiplePermissions,
    checkAnyPermission,
    checkMultipleRoles,
    checkAnyRole,
    isAdmin,
    isModerator,
  };
};