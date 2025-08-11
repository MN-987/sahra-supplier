import { TableColumn } from './table-column';

export interface TableContentProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  selectedRowIds: Set<any>;
  onRowSelect: (row: T) => void;
  onSelectAll: (checked: boolean) => void;
  onRowEdit?: (row: T) => void;
  onRowAction?: (row: T) => void;
  rowIdField: keyof T;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (columnKey: string) => void;
} 