import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TableHeader } from '../table-header';
import React from 'react';

describe('TableHeader', () => {
  const statusTabs = [
    { label: 'All', value: 'all', count: 10, color: 'default' as const },
    { label: 'Active', value: 'active', count: 5, color: 'success' as const },
    { label: 'Pending', value: 'pending', count: 3, color: 'warning' as const },
  ];

  const renderWithTheme = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>);

  it('renders status tabs and their labels/counts', () => {
    renderWithTheme(
      <TableHeader
        currentTab={0}
        onTabChange={() => {}}
        statusTabs={statusTabs}
      />
    );
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onTabChange when a tab is clicked', async () => {
    const user = userEvent.setup();
    const handleTabChange = jest.fn();
    renderWithTheme(
      <TableHeader
        currentTab={0}
        onTabChange={handleTabChange}
        statusTabs={statusTabs}
      />
    );
    // Click the second tab (Active)
    const activeTab = screen.getByRole('tab', { name: /Active/i });
    await user.click(activeTab);
    expect(handleTabChange).toHaveBeenCalledWith(1);
  });

  it('renders nothing if no statusTabs are provided', () => {
    const { container } = renderWithTheme(
      <TableHeader currentTab={0} onTabChange={() => {}} />
    );
    // Should not render any tabs
    expect(container.querySelector('[role="tablist"]')).toBeNull();
  });
}); 