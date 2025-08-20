import React, { useState } from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { TableColumn } from '../../types/table-column';
import { TableContentProps } from '../../types/table-content-props';

// Helper Components
const SortableHeader = ({
  column,
  sortConfig,
  onSort,
}: {
  column: TableColumn<any>;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
}) => {
  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: column.sortable ? 'pointer' : 'default',
        userSelect: 'none',
        padding: '16px',
        '&:hover': column.sortable
          ? {
              bgcolor: 'action.hover',
            }
          : undefined,
        transition: 'background-color 0.2s',
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (column.sortable) {
          onSort(column.key);
        }
      }}
    >
      {column.label}
      {column.sortable && (
        <Typography
          component="span"
          sx={{
            ml: 1,
            opacity: sortConfig?.key === column.key ? 1 : 0.5,
            transition: 'opacity 0.2s',
            fontSize: '0.875rem',
          }}
        >
          {getSortIcon(column.key) || '↕'}
        </Typography>
      )}
    </Box>
  );
};

const CellContent = ({ column, row }: { column: TableColumn<any>; row: any }) => {
  const value = row[column.key];

  if (column.render) {
    return column.render(value, row);
  }

  if (column.key.includes('status') && typeof value === 'string') {
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

    return (
      <Chip label={value} color={getStatusColor(value)} size="small" sx={{ fontWeight: 500 }} />
    );
  }

  if (column.key.includes('avatar') || column.key.includes('image')) {
    return <Avatar sx={{ width: 40, height: 40, bgcolor: 'transparent' }}>{value}</Avatar>;
  }

  return value;
};

const ActionMenu = ({
  anchorEl,
  onClose,
  onEdit,
  onDelete,
}: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
    PaperProps={{
      sx: { width: 150, maxWidth: '100%' },
    }}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    sx={{
      mb: 0.5,
      ml: 0.5,
    }}
  >
    {' '}
    {/* action menu */}
    <MenuItem onClick={onEdit}>
      <ListItemIcon>
        <EditIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Edit</ListItemText>
    </MenuItem>
    <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
      <ListItemIcon>
        <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
      </ListItemIcon>
      <ListItemText>Delete</ListItemText>
    </MenuItem>
  </Menu>
);

// Main Component
export const TableContent = <T extends Record<string, any>>({
  columns,
  data,
  selectedRowIds,
  onRowSelect,
  onSelectAll,
  onRowEdit,
  onRowAction,
  rowIdField,
  sortConfig,
  onSort,
}: TableContentProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>, row: T) => {
    setAnchorEl(event.currentTarget); // set the anchor element to the current target
    setSelectedRow(row); // set the selected row to the row
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleEdit = () => {
    // handle the edit action
    if (selectedRow && onRowEdit) {
      onRowEdit(selectedRow);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedRow && onRowAction) {
      onRowAction(selectedRow);
    }
    handleClose();
  };

  const isAllSelected = data.length > 0 && data.every((row) => selectedRowIds.has(row[rowIdField]));
  const isIndeterminate = data.some((row) => selectedRowIds.has(row[rowIdField])) && !isAllSelected;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <MuiTable>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    fontWeight: 600,
                    width: column.width,
                    padding: 0,
                  }}
                >
                  <SortableHeader column={column} sortConfig={sortConfig} onSort={onSort} />
                </TableCell>
              ))}
              {(onRowEdit || onRowAction) && (
                <TableCell sx={{ fontWeight: 600, width: 100 }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row[rowIdField] || index}
                sx={{
                  '&:hover': { bgcolor: 'grey.50' },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRowIds.has(row[rowIdField])}
                    onChange={() => onRowSelect(row)}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    <CellContent column={column} row={row} />
                  </TableCell>
                ))}
                {(onRowEdit || onRowAction) && (
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* {onRowEdit && (
                        <IconButton 
                          size="small" 
                          sx={{ color: 'grey.600' }}
                          onClick={() => onRowEdit(row)}
                          aria-label="edit row"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )} */}
                      {/* Action button for row - displays a menu with edit and delete options when clicked */}
                      {onRowAction && (
                        <IconButton
                          size="small"
                          sx={{ color: 'grey.600' }}
                          onClick={(e) => handleClick(e, row)}
                          aria-label="more options"
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>

      <ActionMenu
        anchorEl={anchorEl}
        onClose={handleClose}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Paper>
  );
};
