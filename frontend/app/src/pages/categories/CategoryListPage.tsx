import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CategoryData, GetCategoriesParams } from '../../types/api/index';
import { CategoryList } from '@components/domain/categories/CategoryList';
import { CategoryForm } from '@components/domain/categories/CategoryForm';
import { Button } from '@components/ui/Button/Button';
import { Input } from '@components/ui/Input/Input';
import { useDebounce } from '@hooks/ui/useDebounce';
import { Modal } from '@components/ui/Modal/Modal';

export const CategoryListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [filters, setFilters] = useState<Partial<GetCategoriesParams>>({
    active: undefined,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleEditCategory = (category: CategoryData) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedCategory(null);
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
            <h1 className="text-3xl font-bold text-white">Category Management</h1>
            <p className="text-white/70 mt-2">
              Create, edit, and organize categories for application buttons
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Create Category
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
                placeholder="Search categories..."
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

        {/* Category List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CategoryList
            searchTerm={debouncedSearchTerm}
            filters={filters}
            onEditCategory={handleEditCategory}
          />
        </motion.div>

        {/* Create Category Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModals}
          title="Create New Category"
        >
          <CategoryForm
            onSuccess={handleCloseModals}
            onCancel={handleCloseModals}
          />
        </Modal>

        {/* Edit Category Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          title="Edit Category"
        >
          {selectedCategory && (
            <CategoryForm
              category={selectedCategory}
              onSuccess={handleCloseModals}
              onCancel={handleCloseModals}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};