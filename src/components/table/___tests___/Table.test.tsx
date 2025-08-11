import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Table } from '../table';

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active Host', avatar: '🧑', company: 'A', role: 'Dev', phone: '123', createdAt: '2024-01-01' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending Host', avatar: '👩', company: 'B', role: 'Designer', phone: '456', createdAt: '2024-01-02' },
];

const mockColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

describe('Table', () => {
  const defaultProps = {
    data: mockData,
    columns: mockColumns,
    rowIdField: 'id' as keyof typeof mockData[0],
    onRowSelect: jest.fn(),
    onRowEdit: jest.fn(),
    onRowAction: jest.fn(),
    title: 'Test Table',
  };

  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

  it('renders table with correct columns and rows', () => {
    renderWithTheme(<Table {...defaultProps} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('calls onRowSelect when a row is selected', () => {
    renderWithTheme(<Table<typeof mockData[0]> {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Select first row
    expect(defaultProps.onRowSelect).toHaveBeenCalled();
  });

  it('shows action menu when more options button is clicked', () => {
    renderWithTheme(<Table<typeof mockData[0]> {...defaultProps} />);
    const moreOptionsButton = screen.getAllByLabelText('more options')[0];
    fireEvent.click(moreOptionsButton);
    expect(screen.getByText('View Profile')).toBeInTheDocument();
  });

  it('calls onRowEdit when View Profile is clicked', () => {
    renderWithTheme(<Table<typeof mockData[0]> {...defaultProps} />);
    const moreOptionsButton = screen.getAllByLabelText('more options')[0];
    fireEvent.click(moreOptionsButton);
    const viewProfileButton = screen.getByText('View Profile');
    fireEvent.click(viewProfileButton);
    expect(defaultProps.onRowEdit).toHaveBeenCalled();
  });
}); 