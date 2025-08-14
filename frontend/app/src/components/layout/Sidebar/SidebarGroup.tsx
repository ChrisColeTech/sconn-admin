import React from 'react';

interface SidebarGroupProps {
  title?: string;
  children: React.ReactNode;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      {title && (
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {title}
        </h3>
      )}
      <nav className="space-y-1">
        {children}
      </nav>
    </div>
  );
};