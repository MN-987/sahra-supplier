export interface TableToolbarProps<T> {
  filterOptions?: Array<{
    label: string;
    field: keyof T;
    options: Array<{ label: string; value: any }>;
  }>;
  filters: Record<string, any>;
  onFilterChange: (field: string, value: any) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onPrint: () => void;
  onExport: () => void;
} 