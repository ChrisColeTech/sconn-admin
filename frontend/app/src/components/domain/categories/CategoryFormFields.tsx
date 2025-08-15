import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@components/ui/Input/Input';

export interface CategoryFormData {
  name: string;
  description?: string;
  itemOrder?: number;
  active: boolean;
}

interface CategoryFormFieldsProps {
  register: UseFormRegister<CategoryFormData>;
  errors: FieldErrors<CategoryFormData>;
}

export const CategoryFormFields: React.FC<CategoryFormFieldsProps> = ({
  register,
  errors,
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Name *
        </label>
        <Input
          {...register('name')}
          error={errors.name?.message}
          placeholder="Category name"
          className="bg-white/5 border-white/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Description
        </label>
        <Input
          {...register('description')}
          error={errors.description?.message}
          placeholder="Optional description"
          className="bg-white/5 border-white/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Order
          </label>
          <Input
            {...register('itemOrder', { valueAsNumber: true })}
            error={errors.itemOrder?.message}
            type="number"
            placeholder="0"
            className="bg-white/5 border-white/20"
          />
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <input
            {...register('active')}
            type="checkbox"
            className="rounded border-white/20 bg-white/10 text-purple-500"
          />
          <label className="text-sm text-white/80">Active</label>
        </div>
      </div>
    </>
  );
};