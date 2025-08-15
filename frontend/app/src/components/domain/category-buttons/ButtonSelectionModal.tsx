import React, { useState, useMemo } from 'react';
import { CategoryData } from '../../../types/api/index';
import { useButtons } from '../../../hooks/domain/buttons/useButtons';
import { useCategoryButtons, useRelationshipActions } from '../../../hooks/domain/category-buttons';
import { Modal } from '@components/ui/Modal/Modal';
import { Input } from '@components/ui/Input/Input';
import { Button } from '@components/ui/Button/Button';
import { ButtonSelectionList } from './ButtonSelectionList';

interface ButtonSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryData | null;
}

export const ButtonSelectionModal: React.FC<ButtonSelectionModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedButtonIds, setSelectedButtonIds] = useState<Set<number>>(new Set());

  const { data: buttonsData } = useButtons();
  const { data: assignedButtons } = useCategoryButtons(category?.id || 0, !!category);
  const { addButtonToCategory } = useRelationshipActions();

  const availableButtons = useMemo(() => {
    if (!buttonsData?.data?.buttons) return [];
    
    const assignedButtonIds = new Set(
      assignedButtons?.map(rel => rel.button.id) || []
    );
    
    return buttonsData.data.buttons
      .filter(button => !assignedButtonIds.has(button.id))
      .filter(button => 
        searchTerm === '' || 
        button.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (button.description && button.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [buttonsData, assignedButtons, searchTerm]);

  const handleSelectionChange = (buttonId: number, selected: boolean) => {
    const newSelection = new Set(selectedButtonIds);
    if (selected) {
      newSelection.add(buttonId);
    } else {
      newSelection.delete(buttonId);
    }
    setSelectedButtonIds(newSelection);
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedButtonIds(new Set());
    onClose();
  };

  if (!category) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Add Buttons to "${category.name}"`}>
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Search buttons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="max-h-96 overflow-y-auto">
          <ButtonSelectionList
            buttons={availableButtons}
            selectedButtonIds={selectedButtonIds}
            onSelectionChange={handleSelectionChange}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={async () => {
              if (!category) return;
              
              try {
                for (const buttonId of Array.from(selectedButtonIds)) {
                  await addButtonToCategory.mutateAsync({
                    categoryId: category.id,
                    buttonId,
                    itemOrder: 0,
                    active: true,
                  });
                }
                handleClose();
              } catch (error) {
                console.error('Failed to add buttons to category:', error);
              }
            }}
            disabled={selectedButtonIds.size === 0 || addButtonToCategory.isPending}
          >
            Add {selectedButtonIds.size} Button{selectedButtonIds.size === 1 ? '' : 's'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};