import React from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick: _onMenuClick }) => {
  return (
    <div>
      {/* Header component placeholder */}
    </div>
  );
};