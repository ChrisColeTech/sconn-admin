import React from 'react';
import { motion } from 'framer-motion';
import { ButtonData } from '../../../types/api/index';

interface ButtonSelectionListProps {
  buttons: ButtonData[];
  selectedButtonIds: Set<number>;
  onSelectionChange: (buttonId: number, selected: boolean) => void;
}

export const ButtonSelectionList: React.FC<ButtonSelectionListProps> = ({
  buttons,
  selectedButtonIds,
  onSelectionChange,
}) => {
  if (buttons.length === 0) {
    return (
      <div className="text-center py-8 text-white/60">
        No buttons available for assignment.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {buttons.map((button) => (
        <motion.div
          key={button.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
            selectedButtonIds.has(button.id)
              ? 'bg-purple-500/20 border-purple-500/50'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
          onClick={() => onSelectionChange(button.id, !selectedButtonIds.has(button.id))}
        >
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedButtonIds.has(button.id)}
              onChange={() => onSelectionChange(button.id, !selectedButtonIds.has(button.id))}
              className="rounded border-white/20 bg-white/10 text-purple-500"
            />
            <div className="flex-1">
              <div className="text-white font-medium">{button.name}</div>
              {button.description && (
                <div className="text-white/60 text-sm">{button.description}</div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {button.active && (
                <span className="px-1.5 py-0.5 bg-green-500/20 text-green-300 text-xs rounded">
                  Active
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};