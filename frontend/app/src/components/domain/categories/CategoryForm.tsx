import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CategoryData, CreateCategoryRequest } from '../../../types/api/index';
import { useCreateCategory, useUpdateCategory } from '@hooks/domain/categories/useCategoryActions';
import { Button } from '@components/ui/Button/Button';
import { CategoryFormFields, CategoryFormData } from './CategoryFormFields';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  itemOrder: z.number().min(0, 'Order must be positive').optional(),
  active: z.boolean().default(true),
});

interface CategoryFormProps {
  category?: CategoryData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSuccess,
  onCancel,
}) => {
  const isEditing = !!category;
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? {
      name: category.name,
      description: category.description || '',
      itemOrder: category.itemOrder,
      active: category.active,
    } : {
      active: true,
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    const requestData: CreateCategoryRequest = {
      name: data.name,
      description: data.description,
      itemOrder: data.itemOrder,
      active: data.active,
    };

    if (isEditing) {
      updateCategory(
        { id: category.id, data: requestData },
        { onSuccess }
      );
    } else {
      createCategory(requestData, { onSuccess });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        {isEditing ? 'Edit Category' : 'Create New Category'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CategoryFormFields register={register} errors={errors} />

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isValid || isCreating || isUpdating}
            loading={isCreating || isUpdating}
          >
            {isEditing ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};