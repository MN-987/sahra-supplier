import { ReactNode } from 'react';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
  searchable?: boolean;
  width?: number | string;
}

export interface StatusTab {
  label: string;
  value: string;
  count: number;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  statusTabs?: StatusTab[];
  statusField?: keyof T;
  searchableFields?: (keyof T)[];
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: number[];
  onRowSelect?: (selectedRows: T[]) => void;
  onRowEdit?: (row: T) => void;
  onRowAction?: (row: T) => void;
  title?: string;
  filterOptions?: Array<{
    label: string;
    field: keyof T;
    options: Array<{ label: string; value: any }>;
  }>;
  rowIdField?: keyof T;
} 