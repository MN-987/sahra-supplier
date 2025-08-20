// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import React from 'react';
import { useRouter } from 'src/routes/hooks';
// components
import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { Table } from 'src/components/table/table';
import ConfirmationDialog from 'src/components/confirmation-dialog';
// types
import { TableColumn } from 'src/types/table';
import { SupplierEventType } from 'src/services/api/events';
// hooks
import {
  useSupplierEventTypes,
  useDeleteSupplierEventTypes,
  useDeleteSupplierEventType,
  useUpdateSupplierEventTypes,
} from './hooks';
import { EditEventTypeModal } from './components';

// ----------------------------------------------------------------------

export default function EventsView() {
  const router = useRouter();
  const { data: eventTypes, isLoading, error } = useSupplierEventTypes();
  const deleteEventTypes = useDeleteSupplierEventTypes();
  const deleteEventType = useDeleteSupplierEventType();
  const updateEventTypes = useUpdateSupplierEventTypes();

  // State for confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [eventTypeToDelete, setEventTypeToDelete] = React.useState<SupplierEventType | null>(null);

  // State for edit modal
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [eventTypeToEdit, setEventTypeToEdit] = React.useState<SupplierEventType | null>(null);

  const handleCreateEvent = () => {
    router.push('/dashboard/management/events/create');
  };

  const handleDeleteAllEventTypes = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete all event types? This action cannot be undone.'
      )
    ) {
      await deleteEventTypes.mutateAsync();
    }
  };

  const handleEditEventType = (row: SupplierEventType) => {
    setEventTypeToEdit(row);
    setEditModalOpen(true);
  };

  const handleSaveEventType = async (id: string, data: Partial<SupplierEventType>) => {
    // Find the event type to update and merge with new data
    const currentEventTypes = eventTypes?.data || [];
    const eventTypeToUpdate = currentEventTypes.find((et) => et.id === id);

    if (eventTypeToUpdate) {
      // Create the updated event type
      const updatedEventType = { ...eventTypeToUpdate, ...data };

      // Create the API payload with the updated event type
      const apiPayload = {
        event_types: [updatedEventType],
      };

      await updateEventTypes.mutateAsync(apiPayload);
      setEditModalOpen(false);
      setEventTypeToEdit(null);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEventTypeToEdit(null);
  };

  const handleDeleteEventType = (row: SupplierEventType) => {
    setEventTypeToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (eventTypeToDelete) {
      await deleteEventType.mutateAsync(eventTypeToDelete.id);
      setDeleteDialogOpen(false);
      setEventTypeToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setEventTypeToDelete(null);
  };

  const columns: TableColumn<SupplierEventType>[] = [
    {
      key: 'event_type_id',
      label: 'Event Type',
      sortable: true,
      searchable: true,
    },
    {
      key: 'min_capacity',
      label: 'Min Capacity',
      sortable: true,
      render: (value) => (
        <Chip label={`${value} people`} size="small" color="primary" variant="outlined" />
      ),
    },
    {
      key: 'max_capacity',
      label: 'Max Capacity',
      sortable: true,
      render: (value) => (
        <Chip label={`${value} people`} size="small" color="secondary" variant="outlined" />
      ),
    },
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" color="error">
          Error loading event types: {error.message}
        </Typography>
      </Container>
    );
  }

  const hasEventTypes = eventTypes?.data && eventTypes.data.length > 0;
  const tableData = eventTypes?.data || [];

  return (
    <Container maxWidth="lg">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Typography variant="h4">Events</Typography>

        <Stack direction="row" spacing={2}>
          {hasEventTypes && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Iconify icon="mingcute:delete-2-line" />}
              onClick={handleDeleteAllEventTypes}
              disabled={deleteEventTypes.isPending}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleCreateEvent}
            size="large"
          >
            Create Event
          </Button>
        </Stack>
      </Stack>

      {hasEventTypes ? (
        <Table
          data={tableData}
          columns={columns}
          title="Event Types"
          rowIdField="id"
          searchableFields={['event_type_id']}
          onRowEdit={handleEditEventType}
          onRowAction={handleDeleteEventType}
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
            No events created yet. Click &quot;Create Event&quot; to get started.
          </Typography>
        </Box>
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Event Type"
        message={`Are you sure you want to delete "${eventTypeToDelete?.event_type_id}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteEventType.isPending}
      />

      <EditEventTypeModal
        open={editModalOpen}
        eventType={eventTypeToEdit}
        onClose={handleCloseEditModal}
        onSave={handleSaveEventType}
        isLoading={updateEventTypes.isPending}
      />
    </Container>
  );
}
