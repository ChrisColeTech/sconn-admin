import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { ButtonData, GetButtonsParams } from '../../../types/api/index';
import { useButtons } from '@hooks/domain/buttons/useButtons';
import { useDeleteButton } from '@hooks/domain/buttons/useButtonActions';
import { Loading } from '@components/ui/Loading/Loading';
import { createButtonColumns } from './ButtonTableColumns';
import { ButtonTable } from './ButtonTable';

interface ButtonListProps {
  searchTerm?: string;
  filters?: Partial<GetButtonsParams>;
  onEditButton?: (button: ButtonData) => void;
}

export const ButtonList: React.FC<ButtonListProps> = ({
  searchTerm,
  filters,
  onEditButton,
}) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

  const { data, isLoading, error } = useButtons({
    search: searchTerm,
    ...filters,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const { mutate: deleteButton } = useDeleteButton();

  const columns = createButtonColumns(onEditButton, deleteButton);

  const table = useReactTable({
    data: data?.data?.buttons || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
    pageCount: data?.data?.pagination?.totalPages || 0,
    manualPagination: true,
  });

  if (isLoading) {
    return <Loading className="h-64" />;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        Error loading buttons. Please try again.
      </div>
    );
  }

  return <ButtonTable table={table} />;
};