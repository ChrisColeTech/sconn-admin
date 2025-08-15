import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ButtonData, CreateButtonRequest } from '../../../types/domain/button';
import { useCreateButton, useUpdateButton } from '@hooks/domain/buttons/useButtonActions';
import { Button } from '@components/ui/Button/Button';
import { Input } from '@components/ui/Input/Input';
import { Select } from '@components/ui/Input/Select';

const buttonSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  display_text: z.string().min(1, 'Display text is required').max(100, 'Display text must be less than 100 characters'),
  icon: z.string().optional(),
  color: z.string().optional(),
  action_type: z.enum(['navigate', 'external', 'function', 'modal']),
  action_value: z.string().optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  is_active: z.boolean().default(true),
  order_index: z.number().min(0).optional(),
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
      display_text: button.display_text,
      icon: button.icon || '',
      color: button.color || '',
      action_type: button.action_type as any,
      action_value: button.action_value || '',
      description: button.description || '',
      is_active: button.is_active,
      order_index: button.order_index,
    } : {
      is_active: true,
      action_type: 'navigate' as const,
    },
  });

  const onSubmit = (data: ButtonFormData) => {
    const requestData: CreateButtonRequest = {
      name: data.name,
      display_text: data.display_text,
      icon: data.icon || undefined,
      color: data.color || undefined,
      action_type: data.action_type,
      action_value: data.action_value || undefined,
      description: data.description || undefined,
      is_active: data.is_active,
      order_index: data.order_index,
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
              Display Text *
            </label>
            <Input
              {...register('display_text')}
              error={errors.display_text?.message}
              placeholder="Text shown to users"
              className="bg-white/5 border-white/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Icon
            </label>
            <Input
              {...register('icon')}
              placeholder="📱 or icon name"
              className="bg-white/5 border-white/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Color
            </label>
            <Input
              {...register('color')}
              placeholder="#ffffff or color name"
              className="bg-white/5 border-white/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Action Type *
            </label>
            <Select
              {...register('action_type')}
              className="bg-white/5 border-white/20"
            >
              <option value="navigate">Navigate</option>
              <option value="external">External Link</option>
              <option value="function">Function</option>
              <option value="modal">Modal</option>
            </Select>
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