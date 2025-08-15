import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCategories } from '@hooks/domain/categories/useCategories';
import { CategoryRelationshipCard } from './CategoryRelationshipCard';
import { ButtonSelectionModal } from './ButtonSelectionModal';
import { CategoryData } from '../../../types/api/index';
import { Loading } from '@components/ui/Loading/Loading';

export const RelationshipMatrix: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: categoriesData, isLoading, error } = useCategories();

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddButtons = (category: CategoryData) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  if (isLoading) {
    return <Loading className="h-64" />;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        Error loading categories. Please try again.
      </div>
    );
  }

  const categories = categoriesData?.data?.categories || [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Category-Button Relationships</h1>
          <p className="text-white/70 mt-2">
            Manage which buttons are assigned to each category
          </p>
        </div>
      </motion.div>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <CategoryRelationshipCard
            key={category.id}
            category={category}
            isExpanded={expandedCategories.has(category.id)}
            onToggle={() => toggleCategory(category.id)}
            onAddButtons={() => handleAddButtons(category)}
            animationDelay={index * 0.1}
          />
        ))}
      </div>

      <ButtonSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
      />
    </div>
  );
};