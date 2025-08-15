import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CategoryData } from '../../../types/api/index';
import { AssignedButtonList } from './AssignedButtonList';
import { useCategoryButtons } from '../../../hooks/domain/category-buttons';

interface CategoryRelationshipCardProps {
  category: CategoryData;
  isExpanded: boolean;
  onToggle: () => void;
  onAddButtons: () => void;
  animationDelay: number;
}

export const CategoryRelationshipCard: React.FC<CategoryRelationshipCardProps> = ({
  category,
  isExpanded,
  onToggle,
  onAddButtons,
  animationDelay,
}) => {
  const { data: assignedButtons, isLoading } = useCategoryButtons(category.id, true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className="glass-primary rounded-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg glass-interactive hover:scale-105 transition-transform"
          >
            <ChevronDownIcon
              className={`w-5 h-5 text-white transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          <div>
            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
            <p className="text-white/70 text-sm">{category.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
            {assignedButtons?.length || 0} buttons
          </span>
          
          <button
            onClick={onAddButtons}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Buttons</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          {isLoading ? (
            <div className="text-center py-8 text-white/70">
              Loading assigned buttons...
            </div>
          ) : (
            <AssignedButtonList
              categoryId={category.id}
              assignedButtons={assignedButtons || []}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};