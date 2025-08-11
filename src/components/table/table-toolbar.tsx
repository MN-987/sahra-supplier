import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Menu,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { TableToolbarProps } from '../../types/table-toolbar-props';

export const TableToolbar = <T extends Record<string, any>>({
  filterOptions,
  filters,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onPrint,
  onExport,
}: TableToolbarProps<T>) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePrint = () => {
    onPrint();
    handleClose();
  };

  const handleExport = () => {
    onExport();
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', mb: 3, gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, flex: 0.99 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {filterOptions?.map((filter) => (
            <FormControl key={filter.field as string} size="medium" sx={{ minWidth: 180 }}>
              <Select
                value={filters[filter.field as string] || filter.label}
                displayEmpty
                sx={{ bgcolor: 'grey.10', color: 'grey.600' }}
                onChange={(e) => onFilterChange(filter.field as string, e.target.value)}
              >
                <MenuItem value={filter.label} sx={{ color: 'grey.600' }}>{filter.label}</MenuItem>
                {filter.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Box>
        
        <TextField
          size="medium"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'grey.400' }} />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
      </Box>

      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 1 }}
        aria-controls={open ? 'table-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="table-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handlePrint}>
          <PrintIcon sx={{ mr: 1 }} /> Print
        </MenuItem>
        <MenuItem onClick={handleExport}>
          <FileDownloadIcon sx={{ mr: 1 }} /> Export
        </MenuItem>
      </Menu>
    </Box>
  );
}; 