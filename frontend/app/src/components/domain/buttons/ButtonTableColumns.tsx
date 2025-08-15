import { createColumnHelper } from '@tanstack/react-table';
import { ButtonData } from '../../../types/api/index';
import { Button } from '@components/ui/Button/Button';

const columnHelper = createColumnHelper<ButtonData>();

export const createButtonColumns = (
  onEditButton?: (button: ButtonData) => void,
  onDeleteButton?: (id: number) => void
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
    header: 'Button Name',
    cell: (info) => (
      <div className="flex items-center space-x-3">
        <div>
          <div className="font-medium text-white">{info.getValue()}</div>
          <div className="text-sm text-white/60">{info.row.original.description || 'No description'}</div>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('url', {
    header: 'URL',
    cell: (info) => (
      <a
        href={info.getValue()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-400 hover:text-purple-300 text-sm underline"
      >
        {info.getValue()}
      </a>
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
          onClick={() => onEditButton?.(row.original)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDeleteButton?.(row.original.id)}
          className="text-red-400 hover:text-red-300"
        >
          Delete
        </Button>
      </div>
    ),
  }),
];