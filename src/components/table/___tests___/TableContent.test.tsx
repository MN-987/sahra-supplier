import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TableContent } from '../table-content';
import { TableContentProps } from '../../../types/table-content-props';

type MockUser = {
  id: number;
  name: string;
  email: string;
  status: string;
};

// Mock data for testing
const mockData: MockUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active Host' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending Host' },
];

const mockColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={createTheme()}>
      {ui}
    </ThemeProvider>
  );
};

describe('TableContent', () => {
  const defaultProps: TableContentProps<MockUser> = {
    columns: mockColumns,
    data: mockData,
    selectedRowIds: new Set(),
    onRowSelect: jest.fn(),
    onSelectAll: jest.fn(),
    onRowEdit: jest.fn(),
    onRowAction: jest.fn(),
    rowIdField: 'id' as keyof MockUser,
    sortConfig: null,
    onSort: jest.fn(),
  };

  it('renders table with correct number of rows', () => {
    renderWithTheme(<TableContent {...defaultProps} />);
    const rows = screen.getAllByRole('row');
    // Add 1 for header row
    expect(rows.length).toBe(mockData.length + 1);
  });

  it('renders all columns', () => {
    renderWithTheme(<TableContent {...defaultProps} />);
    mockColumns.forEach(column => {
      expect(screen.getByText(column.label)).toBeInTheDocument();
    });
  });

  it('calls onRowSelect when checkbox is clicked', () => {
    renderWithTheme(<TableContent {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Click first row checkbox
    expect(defaultProps.onRowSelect).toHaveBeenCalledWith(mockData[0]);
  });

  it('calls onSelectAll when header checkbox is clicked', () => {
    renderWithTheme(<TableContent {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Click header checkbox
    expect(defaultProps.onSelectAll).toHaveBeenCalledWith(true);
  });

  it('shows action menu when more options button is clicked', () => {
    renderWithTheme(<TableContent {...defaultProps} />);
    const moreOptionsButton = screen.getAllByLabelText('more options')[0];
    fireEvent.click(moreOptionsButton);
    expect(screen.getByText('View Profile')).toBeInTheDocument();
  });

  it('calls onRowEdit when View Profile is clicked', () => {
    renderWithTheme(<TableContent {...defaultProps} />);
    const moreOptionsButton = screen.getAllByLabelText('more options')[0];
    fireEvent.click(moreOptionsButton);
    const viewProfileButton = screen.getByText('View Profile');
    fireEvent.click(viewProfileButton);
    expect(defaultProps.onRowEdit).toHaveBeenCalledWith(mockData[0]);
  });

  it('renders status chip with correct color', () => {
    renderWithTheme(<TableContent {...defaultProps} />);
    const activeChip = screen.getByText('Active Host');
    expect(activeChip).toHaveClass('MuiChip-label');
  });
}); 