import React from 'react';
import { motion } from 'framer-motion';
import { ButtonData, CreateButtonRequest } from '../../../types/api/index';

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
  const getStatusColor = () => {
    if (button?.active === false) {
      return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
    return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showPreviewLabel && (
        <h3 className="text-lg font-semibold text-white/90">Button Preview</h3>
      )}
      
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <motion.button
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 border ${getStatusColor()}`}
          whileHover={animated ? { scale: 1.02 } : {}}
          whileTap={animated ? { scale: 0.98 } : {}}
        >
          {button?.name || 'Button Name'}
        </motion.button>
        
        <div className="mt-4 space-y-2 text-sm text-white/60">
          <div><strong>URL:</strong> {button?.url || 'Not specified'}</div>
          <div><strong>Description:</strong> {button?.description || 'No description'}</div>
          <div><strong>Status:</strong> {button?.active ? 'Active' : 'Inactive'}</div>
          <div><strong>External Browser:</strong> {button?.externalBrowser ? 'Yes' : 'No'}</div>
          <div><strong>At Home:</strong> {button?.atHome ? 'Yes' : 'No'}</div>
          {button?.itemOrder !== undefined && (
            <div><strong>Order:</strong> {button.itemOrder}</div>
          )}
        </div>
      </div>
    </div>
  );
};