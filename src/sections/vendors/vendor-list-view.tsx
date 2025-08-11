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
  Chip,
} from '@mui/material';

import {
  useVendors,
  useDeleteVendor,
  useBulkDeleteVendors,
  useUpdateVendorStatus,
} from 'src/hooks/api';
import { Vendor, PaginationParams } from 'src/types/api';

// ----------------------------------------------------------------------

export default function VendorListView() {
  const [filters, setFilters] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [selected, setSelected] = useState<string[]>([]);

  // API hooks
  const { data: vendorsData, isLoading, error, refetch } = useVendors(filters);

  const deleteVendor = useDeleteVendor();
  const bulkDeleteVendors = useBulkDeleteVendors();
  const updateVendorStatus = useUpdateVendorStatus();

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

  const handleDeleteVendor = useCallback(
    async (id: string) => {
      try {
        await deleteVendor.mutateAsync(id);
        setSelected((prev) => prev.filter((selectedId) => selectedId !== id));
      } catch (err) {
        console.error('Failed to delete vendor:', err);
      }
    },
    [deleteVendor]
  );

  const handleDeleteVendors = useCallback(async () => {
    try {
      await bulkDeleteVendors.mutateAsync(selected);
      setSelected([]);
    } catch (err) {
      console.error('Failed to delete vendors:', err);
    }
  }, [bulkDeleteVendors, selected]);

  const handleUpdateVendorStatus = useCallback(
    async (id: string, status: 'active' | 'inactive' | 'pending') => {
      try {
        await updateVendorStatus.mutateAsync({ id, status });
      } catch (err) {
        console.error('Failed to update vendor status:', err);
      }
    },
    [updateVendorStatus]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

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
          Vendors Management
        </Typography>

        {selected.length > 0 && (
          <Box mb={2}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteVendors}
              disabled={bulkDeleteVendors.isPending}
            >
              Delete Selected ({selected.length})
            </Button>
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableBody>
              {vendorsData?.data.map((vendor: Vendor) => (
                <tr key={vendor.id}>
                  <td style={{ padding: '16px' }}>
                    <Typography variant="body1" fontWeight="bold">
                      {vendor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {vendor.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {vendor.phone}
                    </Typography>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Typography variant="body2">{vendor.category}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Contact: {vendor.contactPerson}
                    </Typography>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Chip
                      label={vendor.status}
                      color={getStatusColor(vendor.status) as any}
                      size="small"
                    />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <Button
                      size="small"
                      onClick={() => handleDeleteVendor(vendor.id)}
                      disabled={deleteVendor.isPending}
                      color="error"
                    >
                      Delete
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        handleUpdateVendorStatus(
                          vendor.id,
                          vendor.status === 'active' ? 'inactive' : 'active'
                        )
                      }
                      disabled={updateVendorStatus.isPending}
                      sx={{ ml: 1 }}
                    >
                      Toggle Status
                    </Button>
                  </td>
                </tr>
              ))}

              {vendorsData && vendorsData.data.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                    No vendors found
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={(filters.page || 1) - 1}
          component="div"
          count={vendorsData?.total || 0}
          rowsPerPage={filters.limit || 10}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Card>
  );
}
