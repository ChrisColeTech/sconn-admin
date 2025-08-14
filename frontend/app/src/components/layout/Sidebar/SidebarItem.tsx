import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  badge?: string | number;
  isActive?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  to,
  badge,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
          isActive
            ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        )
      }
    >
      <Icon
        className={clsx(
          'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
          'group-hover:text-gray-500'
        )}
      />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="ml-3 inline-block py-0.5 px-2 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
};