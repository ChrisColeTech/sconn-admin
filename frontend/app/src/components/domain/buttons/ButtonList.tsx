import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { ButtonData } from '../../../types/domain/button';
import { useButtons } from '@hooks/domain/buttons/useButtons';
import { useDeleteButton } from '@hooks/domain/buttons/useButtonActions';
import { Button } from '@components/ui/Button/Button';
import { Loading } from '@components/ui/Loading/Loading';

interface ButtonListProps {
  searchTerm?: string;
  filters?: any;
  onEditButton?: (button: ButtonData) => void;
}

const columnHelper = createColumnHelper<ButtonData>();

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
    per_page: pagination.pageSize,
  });

  const { mutate: deleteButton } = useDeleteButton();

  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="rounded border-white/20 bg-white/10 text-purple-500"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded border-white/20 bg-white/10 text-purple-500"
        />
      ),
    }),
    columnHelper.accessor('display_text', {
      header: 'Button Name',
      cell: (info) => (
        <div className="flex items-center space-x-3">
          {info.row.original.icon && (
            <span className="text-xl">{info.row.original.icon}</span>
          )}
          <div>
            <div className="font-medium text-white">{info.getValue()}</div>
            <div className="text-sm text-white/60">{info.row.original.name}</div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('action_type', {
      header: 'Action Type',
      cell: (info) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${{
          navigate: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
          external: 'bg-green-500/20 text-green-300 border border-green-500/30',
          function: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
          modal: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
        }[info.getValue()] || 'bg-gray-500/20 text-gray-300'}`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('is_active', {
      header: 'Status',
      cell: (info) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          info.getValue() 
            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
            : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEditButton?.(row.original)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => deleteButton(row.original.id)}
            className="text-red-400 hover:text-red-300"
          >
            Delete
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: data?.buttons || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
    pageCount: data?.total_pages || 0,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/5">
            {table.getRowModel().rows.map((row) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                className="hover:bg-white/5 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};