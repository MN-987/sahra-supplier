import React, { useState, useMemo } from 'react';
import { Box, TablePagination } from '@mui/material';
import { TableProps } from 'src/types/table';
import { TableHeader } from './table-header';
import { TableToolbar } from './table-toolbar';
import { TableContent } from './table-content';

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

  // Get searchable field keys
  const searchFields =
    searchableFields ||
    columns.filter((col) => col.searchable !== false).map((col) => col.key as keyof T);

  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Filter by status tab
    if (statusTabs && statusField && currentTab > 0) {
      const selectedStatus = statusTabs[currentTab].value;
      filtered = filtered.filter((row) => row[statusField] === selectedStatus);
    }

    // Filter by search query
    if (searchQuery && searchFields.length > 0) {
      filtered = filtered.filter((row) =>
        searchFields.some((field) => {
          const value = row[field];
          return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply additional filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter((row) => row[field] === value);
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
        if (!Number.isNaN(Number(aStr)) && !Number.isNaN(Number(bStr))) {
          const aNum = Number(aStr);
          const bNum = Number(bStr);
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // String comparison
        const comparison = aStr.localeCompare(bStr, undefined, {
          numeric: true,
          sensitivity: 'base',
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
  const selectedRows = useMemo(
    () => data.filter((row) => selectedRowIds.has(row[rowIdField])),
    [data, selectedRowIds, rowIdField]
  );

  // Update parent component when selection changes
  React.useEffect(() => {
    onRowSelect?.(selectedRows);
  }, [selectedRows, onRowSelect]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelectedIds = new Set(selectedRowIds);
      paginatedData.forEach((row) => {
        newSelectedIds.add(row[rowIdField]);
      });
      setSelectedRowIds(newSelectedIds);
    } else {
      const newSelectedIds = new Set(selectedRowIds);
      paginatedData.forEach((row) => {
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

  // Check if all rows on current page are selected

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPage(0);
  };

  const handleSort = (columnKey: string) => {
    setSortConfig((prevSort) => {
      if (prevSort?.key === columnKey) {
        // Toggle direction if same column
        return {
          key: columnKey,
          direction: prevSort.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      // New column, start with ascending
      return {
        key: columnKey,
        direction: 'asc',
      };
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Create CSV content
    const headers = columns.map((col) => col.label).join(',');
    const rows = data.map((row) => columns.map((col) => row[col.key]).join(',')).join('\n');
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
    <Box
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        p: 3,
        borderRadius: 2,
        boxShadow:
          '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
        elevation: 6,
      }}
    >
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
          borderColor: 'grey.200',
        }}
      />
    </Box>
  );
}

export default Table;
