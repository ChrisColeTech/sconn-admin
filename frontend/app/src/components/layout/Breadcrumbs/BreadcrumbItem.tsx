import React from 'react';

interface BreadcrumbItemProps {
  label: string;
  href?: string;
  isLast?: boolean;
}

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({ label, href: _href, isLast: _isLast }) => {
  return (
    <span>
      {/* BreadcrumbItem component placeholder */}
      {label}
    </span>
  );
};