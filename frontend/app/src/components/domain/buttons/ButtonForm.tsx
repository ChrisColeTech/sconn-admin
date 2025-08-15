import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ButtonData, CreateButtonRequest } from '../../../types/api/index';
import { useCreateButton, useUpdateButton } from '@hooks/domain/buttons/useButtonActions';
import { Button } from '@components/ui/Button/Button';
import { ButtonFormFields, ButtonFormData } from './ButtonFormFields';

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
        <ButtonFormFields register={register} errors={errors} />

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