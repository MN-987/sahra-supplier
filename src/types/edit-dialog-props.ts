export interface EditDialogProps<T> {
  open: boolean;
  onClose: () => void;
  onSave: (data: T) => void;
  data: T | null;
  columns: Array<{
    key: string;
    label: string;
    type?: 'text' | 'select' | 'email' | 'tel';
    options?: Array<{ label: string; value: string }>;
  }>;
} 