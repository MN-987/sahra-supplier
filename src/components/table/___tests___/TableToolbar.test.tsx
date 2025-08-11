import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TableToolbar } from '../table-toolbar';
import React from 'react';

describe('TableToolbar', () => {
  const filterOptions = [
    {
      label: 'Role',
      field: 'role',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
  ];

  const filters = { role: 'admin' };
  const searchQuery = 'test';
  const onFilterChange = jest.fn();
  const onSearchChange = jest.fn();
  const onPrint = jest.fn();
  const onExport = jest.fn();

  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

  it('renders filter options and search field', () => {
    renderWithTheme(
      <TableToolbar
        filterOptions={filterOptions}
        filters={filters}
        onFilterChange={onFilterChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onPrint={onPrint}
        onExport={onExport}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('calls onFilterChange when a filter option is selected', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <TableToolbar
        filterOptions={filterOptions}
        filters={filters}
        onFilterChange={onFilterChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onPrint={onPrint}
        onExport={onExport}
      />
    );

    const filterSelect = screen.getByRole('combobox');
    await user.click(filterSelect);
    const userOption = screen.getByText('User');
    await user.click(userOption);
    expect(onFilterChange).toHaveBeenCalledWith('role', 'user');
  });

  it('calls onSearchChange when the search field is updated', async () => {
    const user = userEvent.setup();
    // Wrapper to control searchQuery state
    const Wrapper = () => {
      const [query, setQuery] = React.useState('');
      return (
        <TableToolbar
          filterOptions={filterOptions}
          filters={filters}
          onFilterChange={onFilterChange}
          searchQuery={query}
          onSearchChange={val => {
            setQuery(val);
            onSearchChange(val);
          }}
          onPrint={onPrint}
          onExport={onExport}
        />
      );
    };
    renderWithTheme(<Wrapper />);

    const searchField = screen.getByPlaceholderText('Search...');
    await user.clear(searchField);
    await user.type(searchField, 'new search');
    expect(onSearchChange).toHaveBeenLastCalledWith('new search');
  });

  it('calls onPrint when the print menu item is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <TableToolbar
        filterOptions={filterOptions}
        filters={filters}
        onFilterChange={onFilterChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onPrint={onPrint}
        onExport={onExport}
      />
    );

    const menuButton = screen.getByRole('button', { name: '' });
    await user.click(menuButton);
    const printMenuItem = screen.getByText('Print');
    await user.click(printMenuItem);
    expect(onPrint).toHaveBeenCalled();
  });

  it('calls onExport when the export menu item is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <TableToolbar
        filterOptions={filterOptions}
        filters={filters}
        onFilterChange={onFilterChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onPrint={onPrint}
        onExport={onExport}
      />
    );

    const menuButton = screen.getByRole('button', { name: '' });
    await user.click(menuButton);
    const exportMenuItem = screen.getByText('Export');
    await user.click(exportMenuItem);
    expect(onExport).toHaveBeenCalled();
  });
}); 