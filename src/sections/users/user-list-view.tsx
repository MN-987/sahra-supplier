import { useState, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  TableBody,
  TableContainer,
  TablePagination,
  CircularProgress,
  Alert,
  Typography,
  Box,
} from '@mui/material';

import { useUsers, useDeleteUser, useBulkDeleteUsers, useUpdateUserStatus } from 'src/hooks/api';
import { User, PaginationParams } from 'src/types/api';

// ----------------------------------------------------------------------

export default function UserListView() {
  const [filters, setFilters] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [selected, setSelected] = useState<string[]>([]);

  // API hooks
  const { data: usersData, isLoading, error, refetch } = useUsers(filters);

  const deleteUser = useDeleteUser();
  const bulkDeleteUsers = useBulkDeleteUsers();
  const updateUserStatus = useUpdateUserStatus();

  // Handlers
  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage + 1 }));
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      limit: parseInt(event.target.value, 10),
    }));
  }, []);

  const handleDeleteUser = useCallback(
    async (id: string) => {
      try {
        await deleteUser.mutateAsync(id);
        setSelected((prev) => prev.filter((selectedId) => selectedId !== id));
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    },
    [deleteUser]
  );

  const handleDeleteUsers = useCallback(async () => {
    try {
      await bulkDeleteUsers.mutateAsync(selected);
      setSelected([]);
    } catch (err) {
      console.error('Failed to delete users:', err);
    }
  }, [bulkDeleteUsers, selected]);

  const handleUpdateUserStatus = useCallback(
    async (id: string, status: 'active' | 'inactive' | 'pending') => {
      try {
        await updateUserStatus.mutateAsync({ id, status });
      } catch (err) {
        console.error('Failed to update user status:', err);
      }
    },
    [updateUserStatus]
  );

  if (error) {
    return (
      <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
        {error.message}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Users Management
        </Typography>

        {selected.length > 0 && (
          <Box mb={2}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteUsers}
              disabled={bulkDeleteUsers.isPending}
            >
              Delete Selected ({selected.length})
            </Button>
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableBody>
              {usersData?.data.map((user: User) => (
                <tr key={user.id}>
                  <td style={{ padding: '16px' }}>
                    <Typography variant="body1">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Typography variant="body2">{user.role}</Typography>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Typography variant="body2">{user.status}</Typography>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Button
                      size="small"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deleteUser.isPending}
                      color="error"
                    >
                      Delete
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        handleUpdateUserStatus(
                          user.id,
                          user.status === 'active' ? 'inactive' : 'active'
                        )
                      }
                      disabled={updateUserStatus.isPending}
                      sx={{ ml: 1 }}
                    >
                      Toggle Status
                    </Button>
                  </td>
                </tr>
              ))}

              {usersData && usersData.data.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                    No users found
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={(filters.page || 1) - 1}
          component="div"
          count={usersData?.total || 0}
          rowsPerPage={filters.limit || 10}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Card>
  );
}
