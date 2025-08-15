import React from 'react';
import { motion } from 'framer-motion';
import { ButtonData, CreateButtonRequest } from '../../../types/domain/button';

interface ButtonPreviewProps {
  button?: Partial<ButtonData | CreateButtonRequest>;
  showPreviewLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const ButtonPreview: React.FC<ButtonPreviewProps> = ({
  button,
  showPreviewLabel = true,
  animated = true,
  className = '',
}) => {
  const getButtonStyle = () => {
    if (!button?.color) return {};
    
    // Handle different color formats
    if (button.color.startsWith('#')) {
      return { backgroundColor: button.color };
    }
    
    // Handle named colors or CSS classes
    return { backgroundColor: button.color };
  };

  const getActionTypeIcon = () => {
    switch (button?.action_type) {
      case 'navigate':
        return '🧭';
      case 'external':
        return '🔗';
      case 'function':
        return '⚙️';
      case 'modal':
        return '📋';
      default:
        return '🔘';
    }
  };

  const ButtonComponent = animated ? motion.button : 'button';

  const buttonElement = (
    <ButtonComponent
      {...(animated && {
        whileHover: { scale: 1.05, y: -2 },
        whileTap: { scale: 0.95 },
        transition: { duration: 0.2 }
      })}
      className={`
        relative px-6 py-3 rounded-xl font-medium text-white
        bg-gradient-to-r from-purple-500 to-pink-500
        hover:from-purple-600 hover:to-pink-600
        shadow-lg hover:shadow-xl
        border border-white/20
        backdrop-blur-sm
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${button?.is_active === false ? 'opacity-50 grayscale' : ''}
        ${className}
      `}
      style={getButtonStyle()}
      disabled={button?.is_active === false}
    >
      <div className="flex items-center justify-center space-x-2">
        {button?.icon && (
          <span className="text-lg">{button.icon}</span>
        )}
        <span>{button?.display_text || 'Button Preview'}</span>
        <span className="text-sm opacity-75">
          {getActionTypeIcon()}
        </span>
      </div>
      
      {button?.action_type === 'external' && (
        <span className="absolute -top-1 -right-1 text-xs">
          ↗️
        </span>
      )}
    </ButtonComponent>
  );

  return (
    <div className="space-y-4">
      {showPreviewLabel && (
        <h3 className="text-lg font-semibold text-white/90">
          Live Preview
        </h3>
      )}
      
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center space-y-2">
            <div className="text-sm text-white/60">
              Button Appearance
            </div>
            {buttonElement}
          </div>
          
          <div className="w-full max-w-xs space-y-3 text-sm">
            <div className="flex justify-between text-white/70">
              <span>Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                button?.is_active !== false 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {button?.is_active !== false ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            {button?.action_type && (
              <div className="flex justify-between text-white/70">
                <span>Action:</span>
                <span className="capitalize">{button.action_type}</span>
              </div>
            )}
            
            {button?.action_value && (
              <div className="flex justify-between text-white/70">
                <span>Target:</span>
                <span className="truncate max-w-32 text-xs">
                  {button.action_value}
                </span>
              </div>
            )}
            
            {button?.description && (
              <div className="text-white/60 text-xs">
                {button.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};