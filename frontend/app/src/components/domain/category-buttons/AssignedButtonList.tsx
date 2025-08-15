import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CategoryButtonData } from '../../../types/api/index';
import { useRelationshipActions } from '../../../hooks/domain/category-buttons';
import { Button } from '@components/ui/Button/Button';

interface AssignedButtonListProps {
  categoryId: number;
  assignedButtons: CategoryButtonData[];
}

export const AssignedButtonList: React.FC<AssignedButtonListProps> = ({
  categoryId,
  assignedButtons,
}) => {
  const { removeButtonFromCategory } = useRelationshipActions();

  const handleRemoveButton = async (buttonId: number) => {
    try {
      await removeButtonFromCategory.mutateAsync({
        categoryId,
        buttonId,
      });
    } catch (error) {
      console.error('Failed to remove button from category:', error);
    }
  };

  if (assignedButtons.length === 0) {
    return (
      <div className="text-center py-8 text-white/70">
        No buttons assigned to this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assignedButtons.map((relationship, index) => {
        const button = relationship.button;
        return (
          <motion.div
            key={`${categoryId}-${button.id}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="glass-secondary rounded-lg p-4 group hover:glass-interactive transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-white text-sm">{button.name}</h4>
                <p className="text-white/60 text-xs mt-1 line-clamp-2">
                  {button.description}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-xs text-white/50">Order: {relationship.itemOrder}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    relationship.active ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {relationship.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveButton(button.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
                disabled={removeButtonFromCategory.isPending}
              >
                <XMarkIcon className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};