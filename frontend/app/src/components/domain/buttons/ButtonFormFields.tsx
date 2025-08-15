import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@components/ui/Input/Input';

export interface ButtonFormData {
  name: string;
  description?: string;
  url: string;
  itemOrder?: number;
  image?: string;
  active: boolean;
  externalBrowser: boolean;
  atHome: boolean;
}

interface ButtonFormFieldsProps {
  register: UseFormRegister<ButtonFormData>;
  errors: FieldErrors<ButtonFormData>;
}

export const ButtonFormFields: React.FC<ButtonFormFieldsProps> = ({
  register,
  errors,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('name')}
          error={errors.name?.message}
          placeholder="Button identifier"
          className="bg-white/5 border-white/20"
          label="Name *"
        />
        <Input
          {...register('url')}
          error={errors.url?.message}
          placeholder="https://example.com"
          className="bg-white/5 border-white/20"
          label="URL *"
        />
      </div>

      <Input
        {...register('description')}
        error={errors.description?.message}
        placeholder="Optional description"
        className="bg-white/5 border-white/20"
        label="Description"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('image')}
          error={errors.image?.message}
          placeholder="https://example.com/image.png"
          className="bg-white/5 border-white/20"
          label="Image URL"
        />
        <Input
          {...register('itemOrder', { valueAsNumber: true })}
          error={errors.itemOrder?.message}
          type="number"
          placeholder="0"
          className="bg-white/5 border-white/20"
          label="Order"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <label className="flex items-center space-x-2">
          <input {...register('active')} type="checkbox" className="rounded border-white/20 bg-white/10 text-purple-500" />
          <span className="text-sm text-white/80">Active</span>
        </label>
        <label className="flex items-center space-x-2">
          <input {...register('externalBrowser')} type="checkbox" className="rounded border-white/20 bg-white/10 text-purple-500" />
          <span className="text-sm text-white/80">External Browser</span>
        </label>
        <label className="flex items-center space-x-2">
          <input {...register('atHome')} type="checkbox" className="rounded border-white/20 bg-white/10 text-purple-500" />
          <span className="text-sm text-white/80">At Home</span>
        </label>
      </div>
    </>
  );
};