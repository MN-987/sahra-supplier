import React, { useState, useMemo } from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  TablePagination,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  FileDownload as FileDownloadIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { TableProps, TableColumn, StatusTab } from 'src/types/table';
import { TableHeader } from './table-header';
import { TableToolbar } from './table-toolbar';
import { TableContent } from './table-content';
import { EditDialog } from './edit-dialog';

export function Table<T extends Record<string, any>>({
  data,
  columns,
  statusTabs,
  statusField,
  searchableFields,
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  onRowSelect,
  onRowEdit,
  onRowAction,
  title,
  filterOptions,
  rowIdField = 'id' as keyof T,
}: TableProps<T>) {
  const [selectedRowIds, setSelectedRowIds] = useState<Set<any>>(new Set());
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  // Get searchable field keys
  const searchFields = searchableFields || columns
    .filter(col => col.searchable !== false)
    .map(col => col.key as keyof T);

  const filteredData = useMemo(() => {
    let filtered = [...data];
    
    // Filter by status tab
    if (statusTabs && statusField && currentTab > 0) {
      const selectedStatus = statusTabs[currentTab].value;
      filtered = filtered.filter(row => row[statusField] === selectedStatus);
    }
    
    // Filter by search query
    if (searchQuery && searchFields.length > 0) {
      filtered = filtered.filter(row =>
        searchFields.some(field => {
          const value = row[field];
          return value && 
            value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply additional filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(row => row[field] === value);
      }
    });
    
    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        // Convert to string for comparison if needed
        const aStr = typeof aValue === 'string' ? aValue : String(aValue);
        const bStr = typeof bValue === 'string' ? bValue : String(bValue);
        
        // Numeric comparison if both are numbers
        if (!isNaN(Number(aStr)) && !isNaN(Number(bStr))) {
          const aNum = Number(aStr);
          const bNum = Number(bStr);
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // String comparison
        const comparison = aStr.localeCompare(bStr, undefined, { 
          numeric: true, 
          sensitivity: 'base' 
        });
        
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }
    
    return filtered;
  }, [data, currentTab, searchQuery, filters, statusTabs, statusField, searchFields, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Get the actual selected rows based on IDs
  const selectedRows = useMemo(() => {
    return data.filter(row => selectedRowIds.has(row[rowIdField]));
  }, [data, selectedRowIds, rowIdField]);

  // Update parent component when selection changes
  React.useEffect(() => {
    onRowSelect?.(selectedRows);
  }, [selectedRows, onRowSelect]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelectedIds = new Set(selectedRowIds);
      paginatedData.forEach(row => {
        newSelectedIds.add(row[rowIdField]);
      });
      setSelectedRowIds(newSelectedIds);
    } else {
      const newSelectedIds = new Set(selectedRowIds);
      paginatedData.forEach(row => {
        newSelectedIds.delete(row[rowIdField]);
      });
      setSelectedRowIds(newSelectedIds);
    }
  };

  const handleSelectRow = (row: T) => {
    const rowId = row[rowIdField];
    const newSelectedIds = new Set(selectedRowIds);
    
    if (newSelectedIds.has(rowId)) {
      newSelectedIds.delete(rowId);
    } else {
      newSelectedIds.add(rowId);
    }
    
    setSelectedRowIds(newSelectedIds);
  };

  const isRowSelected = (row: T) => {
    return selectedRowIds.has(row[rowIdField]);
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status?.toLowerCase()) {
      case 'active host':
      case 'active guest':
        return 'success';
      case 'pending host':
        return 'warning';
      case 'anonymous guest':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTabChipColor = (tab: StatusTab, index: number) => {
    if (tab.color) {
      return { bgcolor: `${tab.color}.main`, color: 'white' };
    }
    
    // Default colors based on index
    const colors = [
      { bgcolor: 'grey.900', color: 'white' },
      { bgcolor: 'success.main', color: 'white' },
      { bgcolor: 'warning.main', color: 'white' },
      { bgcolor: 'error.main', color: 'white' },
      { bgcolor: 'grey.500', color: 'white' }
    ];
    
    return colors[index] || colors[colors.length - 1];
  };

  // Check if all rows on current page are selected
  const isAllPageRowsSelected = paginatedData.length > 0 && 
    paginatedData.every(row => selectedRowIds.has(row[rowIdField]));
  
  // Check if some (but not all) rows on current page are selected
  const isIndeterminate = paginatedData.some(row => selectedRowIds.has(row[rowIdField])) && 
    !isAllPageRowsSelected;

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(0);
  };

  const handleSort = (columnKey: string) => {
    setSortConfig(prevSort => {
      if (prevSort?.key === columnKey) {
        // Toggle direction if same column
        return {
          key: columnKey,
          direction: prevSort.direction === 'asc' ? 'desc' : 'asc'
        };
      } else {
        // New column, start with ascending
        return {
          key: columnKey,
          direction: 'asc'
        };
      }
    });
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const renderCellContent = (column: TableColumn<T>, row: T) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    // Default rendering for common types
    if (column.key.includes('status') && typeof value === 'string') {
      return (
        <Chip
          label={value}
          color={getStatusColor(value)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      );
    }
    
    if (column.key.includes('avatar') || column.key.includes('image')) {
      return (
        <Avatar sx={{ width: 40, height: 40, bgcolor: 'transparent' }}>
          {value}
        </Avatar>
      );
    }
    
    return value;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Create CSV content
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(row => 
      columns.map(col => row[col.key]).join(',')
    ).join('\n');
    const csvContent = `${headers}\n${rows}`;
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'table-export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (row: T) => {
    if (onRowEdit) {
      onRowEdit(row);
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      bgcolor: 'background.paper', 
      p: 3,
      borderRadius: 2,
      boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
      elevation: 6
    }}>
      <TableHeader
        title={title}
        statusTabs={statusTabs}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      <TableToolbar
        filterOptions={filterOptions}
        filters={filters}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onPrint={handlePrint}
        onExport={handleExport}
      />

      <TableContent
        columns={columns}
        data={paginatedData}
        selectedRowIds={selectedRowIds}
        onRowSelect={handleSelectRow}
        onSelectAll={handleSelectAll}
        onRowEdit={handleEdit}
        onRowAction={onRowAction}
        rowIdField={rowIdField}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid',
          borderColor: 'grey.200'
        }}
      />
    </Box>
  );
}

// Example usage with your user data
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: 'Active Host' | 'Pending Host' | 'Active Guest' | 'Anonymous Guest';
  avatar: string;
  createdAt: string;
}

const ExampleUsage: React.FC = () => {
  const userData: User[] = [
    {
      id: 1,
      name: 'Angelique Morse',
      email: 'benny89@yahoo.com',
      phone: '+46 8 123 456',
      company: 'Wuckert Inc',
      role: 'Content Creator',
      status: 'Active Host',
      avatar: '👩‍🦰',
      createdAt: '2024-03-15T08:30:00Z'
    },
    {
      id: 2,
      name: 'Ariana Lang',
      email: 'avery43@hotmail.com',
      phone: '+54 11 1234-5678',
      company: 'Feest Group',
      role: 'IT Administrator',
      status: 'Pending Host',
      avatar: '👨‍💼',
      createdAt: '2024-03-14T15:45:00Z'
    },
    // ... more users
  ];

  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'transparent' }}>
            {row.avatar}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    { key: 'phone', label: 'Phone number', sortable: true },
    { key: 'company', label: 'Company', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  const statusTabs: StatusTab[] = [
    { label: 'All', value: 'all', count: 20 },
    { label: 'Active', value: 'Active', count: 2, color: 'success' },
    { label: 'Pending', value: 'Pending', count: 10, color: 'warning' },
    { label: 'Banned', value: 'Banned', count: 6, color: 'error' },
    { label: 'Rejected', value: 'Rejected', count: 2 }
  ];

  const filterOptions = [
    {
      label: 'Role',
      field: 'role' as keyof User,
      options: [
        { label: 'Content Creator', value: 'Content Creator' },
        { label: 'IT Administrator', value: 'IT Administrator' },
        { label: 'Financial Planner', value: 'Financial Planner' },
        { label: 'HR Recruiter', value: 'HR Recruiter' },
        { label: 'Graphic Designer', value: 'Graphic Designer' }
      ]
    }
  ];

  return (
    <Table
      data={userData}
      columns={columns}
      statusTabs={statusTabs}
      statusField="status"
      searchableFields={['name', 'email', 'company', 'role']}
      onRowSelect={(selectedRows) => console.log('Selected:', selectedRows)}
      onRowEdit={(row) => console.log('Edit:', row)}
      onRowAction={(row) => console.log('Action:', row)}
      title="User Management"
      filterOptions={filterOptions}
      rowIdField="id" // Specify the unique identifier field
    />
  );
};

export default ExampleUsage;