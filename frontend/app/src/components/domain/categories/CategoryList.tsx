import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { CategoryData, GetCategoriesParams } from '../../../types/api/index';
import { useCategories } from '@hooks/domain/categories/useCategories';
import { useDeleteCategory } from '@hooks/domain/categories/useCategoryActions';
import { Loading } from '@components/ui/Loading/Loading';
import { createCategoryColumns } from './CategoryTableColumns';
import { CategoryTable } from './CategoryTable';

interface CategoryListProps {
  searchTerm?: string;
  filters?: Partial<GetCategoriesParams>;
  onEditCategory?: (category: CategoryData) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  searchTerm,
  filters,
  onEditCategory,
}) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

  const { data, isLoading, error } = useCategories({
    search: searchTerm,
    ...filters,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const { mutate: deleteCategory } = useDeleteCategory();
  const columns = createCategoryColumns(onEditCategory, deleteCategory);

  const table = useReactTable({
    data: data?.data?.categories || [],
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
        Error loading categories. Please try again.
      </div>
    );
  }

  return <CategoryTable table={table} />;
};