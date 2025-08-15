import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ButtonData, CreateButtonRequest } from '../../../types/api/index';
import { useCreateButton, useUpdateButton } from '@hooks/domain/buttons/useButtonActions';
import { Button } from '@components/ui/Button/Button';
import { Input } from '@components/ui/Input/Input';

const buttonSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  url: z.string().url('Must be a valid URL'),
  itemOrder: z.number().min(0, 'Order must be positive').optional(),
  image: z.string().url('Must be a valid image URL').optional(),
  active: z.boolean().default(true),
  externalBrowser: z.boolean().default(false),
  atHome: z.boolean().default(false),
});

type ButtonFormData = z.infer<typeof buttonSchema>;

interface ButtonFormProps {
  button?: ButtonData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ButtonForm: React.FC<ButtonFormProps> = ({
  button,
  onSuccess,
  onCancel,
}) => {
  const isEditing = !!button;
  const { mutate: createButton, isPending: isCreating } = useCreateButton();
  const { mutate: updateButton, isPending: isUpdating } = useUpdateButton();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ButtonFormData>({
    resolver: zodResolver(buttonSchema),
    defaultValues: button ? {
      name: button.name,
      description: button.description || '',
      url: button.url,
      itemOrder: button.itemOrder,
      image: button.image || '',
      active: button.active,
      externalBrowser: button.externalBrowser,
      atHome: button.atHome,
    } : {
      active: true,
      externalBrowser: false,
      atHome: false,
    },
  });

  const onSubmit = (data: ButtonFormData) => {
    const requestData: CreateButtonRequest = {
      name: data.name,
      description: data.description,
      url: data.url,
      itemOrder: data.itemOrder,
      image: data.image,
      active: data.active,
      externalBrowser: data.externalBrowser,
      atHome: data.atHome,
    };

    if (isEditing) {
      updateButton(
        { id: button.id, data: requestData },
        { onSuccess }
      );
    } else {
      createButton(requestData, { onSuccess });
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        {isEditing ? 'Edit Button' : 'Create New Button'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Name *
            </label>
            <Input
              {...register('name')}
              error={errors.name?.message}
              placeholder="Button identifier"
              className="bg-white/5 border-white/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              URL *
            </label>
            <Input
              {...register('url')}
              error={errors.url?.message}
              placeholder="https://example.com"
              className="bg-white/5 border-white/20"
            />
          </div>
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
              Image URL
            </label>
            <Input
              {...register('image')}
              error={errors.image?.message}
              placeholder="https://example.com/image.png"
              className="bg-white/5 border-white/20"
            />
          </div>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <input
              {...register('active')}
              type="checkbox"
              className="rounded border-white/20 bg-white/10 text-purple-500"
            />
            <label className="text-sm text-white/80">Active</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              {...register('externalBrowser')}
              type="checkbox"
              className="rounded border-white/20 bg-white/10 text-purple-500"
            />
            <label className="text-sm text-white/80">External Browser</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              {...register('atHome')}
              type="checkbox"
              className="rounded border-white/20 bg-white/10 text-purple-500"
            />
            <label className="text-sm text-white/80">At Home</label>
          </div>
        </div>

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
            {isEditing ? 'Update Button' : 'Create Button'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};