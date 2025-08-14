import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

const routeLabels: Record<string, string> = {
  'dashboard': 'Dashboard',
  'buttons': 'Button Management',
  'categories': 'Category Management',
  'relationships': 'Relationships',
  'users': 'User Management',
  'favorites': 'Favorites',
  'settings': 'Settings',
  'purge': 'Data Purge',
  'admin': 'System Admin',
  'app-settings': 'App Settings',
  'create': 'Create',
  'edit': 'Edit',
  'detail': 'Details',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    
    if (pathSegments.length === 0 || pathSegments[0] === 'dashboard') {
      return [{ label: 'Dashboard', href: '/dashboard', isLast: true }];
    }

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/dashboard', isLast: false }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index === 0 ? (
              <div className="flex items-center">
                <HomeIcon className="h-4 w-4 text-gray-400" />
                {!item.isLast ? (
                  <Link
                    to={item.href}
                    className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                {!item.isLast ? (
                  <Link
                    to={item.href}
                    className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};