import { TableColumn } from './table-column';
import { StatusTab } from './status-tab';

export interface TableProps<T extends Record<string, any>> {
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
  filterOptions?: {
    label: string;
    field: keyof T;
    options: { label: string; value: string }[];
  }[];
  rowIdField?: keyof T;
} 