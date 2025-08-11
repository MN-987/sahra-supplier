import React, { useState, useMemo } from 'react';
// @mui
import { Box, Container, Typography } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
import { Table } from 'src/components/table/table';
import { _userList } from '../../_mock/_user';
import NameAvatar from '../../components/avatar/name-avatar';
import { StatusTab } from '../../types/status-tab';
import { User } from 'src/types/user';
import { useNavigate } from 'react-router-dom';
import { TableColumn } from 'src/types/table';
// ----------------------------------------------------------------------

export default function UserView() {
  const settings = useSettingsContext();
  const navigate = useNavigate();
  
  // Process user list to match the User type
  const processedUserList = useMemo(() => _userList.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phoneNumber,
    company: user.company,
    role: user.role,
    status: user.status as User['status'],
    avatar: user.avatarUrl ,
    createdAt: user.createdAt.toISOString(),
    country: user.country,
    state: user.state,
    city: user.city,
    address: user.address,
    zipCode: user.zipCode
  })), []);

  console.log('processedUserList====================',{_userList});
  
 // Table columns
  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: any, row: User) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NameAvatar name={row.name} sx={{ width: 40, height: 40 }} />
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

  // Get unique roles from the user data
  const uniqueRoles = useMemo(() => {
    const roles = new Set(processedUserList.map(user => user.role));
    return Array.from(roles).map(role => ({
      label: role,
      value: role
    }));
  }, [processedUserList]);

  const filterOptions = [
    {
      label: 'Role',
      field: 'role' as keyof User,
      options: [
        { label: 'All', value: 'all' },
        { label: 'Content Creator', value: 'Content Creator' },
        { label: 'IT Administrator', value: 'IT Administrator' },
        { label: 'Financial Planner', value: 'Financial Planner' },
        { label: 'HR Recruiter', value: 'HR Recruiter' },
        { label: 'Graphic Designer', value: 'Graphic Designer' }
      ]
    }
  ];



  // Status tab configurations
  const STATUS_COLORS = {
    success: 'success',
    warning: 'warning',
    default: 'default'
  } as const;

  const HOST_STATUSES = [
    { label: 'Active Host', value: 'Active Host', color: STATUS_COLORS.success },
    { label: 'Pending Host', value: 'Pending Host', color: STATUS_COLORS.warning }
  ] as const;

  const GUEST_STATUSES = [
    { label: 'Active Guest', value: 'Active Guest', color: STATUS_COLORS.success },
    { label: 'Anonymous Guest', value: 'Anonymous Guest', color: STATUS_COLORS.default }
  ] as const;

  const statusTabs: StatusTab[] = [
    // All users tab
    { 
      label: 'All', 
      value: 'all', 
      count: processedUserList.length 
    },
    // Host status tabs
    ...HOST_STATUSES.map(status => ({
      ...status,
      count: processedUserList.filter(u => u.status === status.value).length
    })),
    // Guest status tabs
    ...GUEST_STATUSES.map(status => ({
      ...status,
      count: processedUserList.filter(u => u.status === status.value).length
    }))
  ];



  const handleEdit = (row: User) => {
    navigate('/dashboard/management/user/profile', { state: { userData: row } });
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h3" sx={{ mb: 3 }}> Users </Typography>

      <Box
        sx={{
          mb: { xs: 3, md: 3 },
          mt: { xs: 3, md: 3 },
          width: 1,
          borderRadius: 2,
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <Table
          data={processedUserList}
          columns={columns}
          statusTabs={statusTabs}
          statusField="status"
          searchableFields={['name', 'email', 'company', 'role']}
          onRowSelect={(selectedRows) => console.log('Selected:', selectedRows)}
          onRowEdit={handleEdit}
          onRowAction={(row) => console.log('Action:', row)}
          title="Users"
          filterOptions={filterOptions}
          rowIdField="id"
        />
      </Box>
    </Container>
  );
}
