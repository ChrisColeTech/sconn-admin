import { createColumnHelper } from '@tanstack/react-table';
import { CategoryData } from '../../../types/api/index';
import { Button } from '@components/ui/Button/Button';

const columnHelper = createColumnHelper<CategoryData>();

export const createCategoryColumns = (
  onEditCategory?: (category: CategoryData) => void,
  onDeleteCategory?: (id: number) => void
) => [
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
  columnHelper.accessor('name', {
    header: 'Category Name',
    cell: (info) => (
      <div className="flex items-center space-x-3">
        <div>
          <div className="font-medium text-white">{info.getValue()}</div>
          <div className="text-sm text-white/60">{info.row.original.description || 'No description'}</div>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('itemOrder', {
    header: 'Order',
    cell: (info) => (
      <span className="text-white/80 text-sm">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('active', {
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
          onClick={() => onEditCategory?.(row.original)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDeleteCategory?.(row.original.id)}
          className="text-red-400 hover:text-red-300"
        >
          Delete
        </Button>
      </div>
    ),
  }),
];