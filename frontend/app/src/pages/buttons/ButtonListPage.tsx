import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ButtonData, GetButtonsParams } from '../../types/api/index';
import { ButtonList } from '@components/domain/buttons/ButtonList';
import { ButtonForm } from '@components/domain/buttons/ButtonForm';

import { Button } from '@components/ui/Button/Button';
import { Input } from '@components/ui/Input/Input';
import { useDebounce } from '@hooks/ui/useDebounce';
import { Modal } from '@components/ui/Modal/Modal';

export const ButtonListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<ButtonData | null>(null);
  const [filters, setFilters] = useState<Partial<GetButtonsParams>>({
    active: undefined,
    categoryId: undefined,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleEditButton = (button: ButtonData) => {
    setSelectedButton(button);
    setIsEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedButton(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Button Management</h1>
            <p className="text-white/70 mt-2">
              Create, edit, and manage application buttons with live preview
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Create Button
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search buttons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border-white/20"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filters.active?.toString() || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  active: e.target.value === '' ? undefined : e.target.value === 'true'
                }))}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <select
                value={filters.sort || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  sort: e.target.value as any || undefined
                }))}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              >
                <option value="">Sort By</option>
                <option value="name">Name</option>
                <option value="itemOrder">Order</option>
                <option value="createdAt">Created</option>
                <option value="updatedAt">Updated</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Button List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ButtonList
            searchTerm={debouncedSearchTerm}
            filters={filters}
            onEditButton={handleEditButton}
          />
        </motion.div>

        {/* Create Button Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModals}
          title="Create New Button"
        >
          <ButtonForm
            onSuccess={handleCloseModals}
            onCancel={handleCloseModals}
          />
        </Modal>

        {/* Edit Button Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          title="Edit Button"
        >
          {selectedButton && (
            <ButtonForm
              button={selectedButton}
              onSuccess={handleCloseModals}
              onCancel={handleCloseModals}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};