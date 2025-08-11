import { ReactNode } from 'react';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
  searchable?: boolean;
  width?: number | string;
} 