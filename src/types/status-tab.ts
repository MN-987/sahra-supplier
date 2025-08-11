export interface StatusTab {
  label: string;
  value: string;
  count: number;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
} 