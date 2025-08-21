// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import React from 'react';
import { useRouter } from 'src/routes/hooks';
// components
import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { Table } from 'src/components/table/table';
import ConfirmationDialog from 'src/components/confirmation-dialog';
// types
import { TableColumn } from 'src/types/table';
import { SupplierService } from 'src/services/api/services';
// hooks
import {
  useSupplierServices,
  useDeleteSupplierServices,
  useDeleteSupplierService,
  useUpdateSupplierServices,
} from './hooks';
import { EditServiceModal } from './components';

// ----------------------------------------------------------------------

// Price type mapping
const PRICE_TYPE_LABELS = {
  1: 'Per Hour',
  2: 'Per Day',
  3: 'Fixed Price',
  4: 'Per Person',
};

// Service type mapping
const SERVICE_TYPE_LABELS = {
  '1': 'Photography',
  '2': 'Videography',
  '3': 'Catering',
  '4': 'Decoration',
  '5': 'Music & Entertainment',
  '6': 'Transportation',
  '7': 'Venue',
  '8': 'Flowers',
};

export default function ServicesView() {
  const router = useRouter();
  const { data: services, isLoading, error } = useSupplierServices();
  const deleteServices = useDeleteSupplierServices();
  const deleteService = useDeleteSupplierService();
  const updateServices = useUpdateSupplierServices();

  // State for confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] = React.useState<SupplierService | null>(null);

  // State for edit modal
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [serviceToEdit, setServiceToEdit] = React.useState<SupplierService | null>(null);

  const handleCreateService = () => {
    router.push('/dashboard/management/services/create');
  };

  const handleDeleteAllServices = async () => {
    if (
      window.confirm('Are you sure you want to delete all services? This action cannot be undone.')
    ) {
      await deleteServices.mutateAsync();
    }
  };

  const handleEditService = (row: SupplierService) => {
    setServiceToEdit(row);
    setEditModalOpen(true);
  };

  const handleSaveService = async (id: string, data: Partial<SupplierService>) => {
    // Find the service to update and merge with new data
    const currentServices = services?.data || [];
    const serviceToUpdate = currentServices.find((s) => s.id === id);

    if (serviceToUpdate) {
      // Create the updated service
      const updatedService = { ...serviceToUpdate, ...data };

      // Create the API payload with the updated service
      const apiPayload = {
        services: [updatedService],
      };

      await updateServices.mutateAsync(apiPayload);
      setEditModalOpen(false);
      setServiceToEdit(null);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setServiceToEdit(null);
  };

  const handleDeleteService = (row: SupplierService) => {
    setServiceToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (serviceToDelete) {
      await deleteService.mutateAsync(serviceToDelete.id);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" color="error">
          Error loading services
        </Typography>
      </Container>
    );
  }

  const servicesData = services?.data || [];
  const hasServices = servicesData.length > 0;

  // Transform data for table
  const tableData = servicesData.map((service) => ({
    ...service,
    service_name:
      SERVICE_TYPE_LABELS[service.service_id as keyof typeof SERVICE_TYPE_LABELS] || 'Unknown',
    price_summary: service.prices
      .map((p) => `$${p.price} (${PRICE_TYPE_LABELS[p.type as keyof typeof PRICE_TYPE_LABELS]})`)
      .join(', '),
  }));

  const columns: TableColumn[] = [
    {
      key: 'service_name',
      label: 'Service Type',
      sortable: true,
      searchable: true,
    },
    {
      key: 'delivery_time_slots',
      label: 'Delivery Time Slots',
      sortable: true,
      searchable: true,
      render: (value) => (
        <Typography variant="body2" sx={{ maxWidth: 200, wordBreak: 'break-word' }}>
          {value}
        </Typography>
      ),
    },
    {
      key: 'price_summary',
      label: 'Prices',
      sortable: false,
      render: (value) => (
        <Typography variant="body2" sx={{ maxWidth: 300, wordBreak: 'break-word' }}>
          {value}
        </Typography>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Typography variant="h4">Services Management</Typography>
        <Stack direction="row" spacing={2}>
          {hasServices && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Iconify icon="mingcute:delete-2-line" />}
              onClick={handleDeleteAllServices}
              disabled={deleteServices.isPending}
            >
              Delete All
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleCreateService}
            size="large"
          >
            Create Service
          </Button>
        </Stack>
      </Stack>

      {hasServices ? (
        <Table
          data={tableData}
          columns={columns}
          title="Services"
          rowIdField="id"
          searchableFields={['service_name', 'delivery_time_slots']}
          onRowEdit={handleEditService}
          onRowAction={handleDeleteService}
        />
      ) : (
        <Box
          sx={{
            mt: 5,
            width: 1,
            height: 320,
            borderRadius: 2,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No services created yet. Click &quot;Create Service&quot; to get started.
          </Typography>
        </Box>
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteService.isPending}
      />

      <EditServiceModal
        open={editModalOpen}
        service={serviceToEdit}
        onClose={handleCloseEditModal}
        onSave={handleSaveService}
        isLoading={updateServices.isPending}
      />
    </Container>
  );
}
