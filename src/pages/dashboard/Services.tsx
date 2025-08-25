import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';
import { Table } from 'src/components/table';
import {
  useSupplierServices,
  useServicesTypes,
  useDeleteSupplierService,
  useUpdateSupplierServices,
  supplierServicesKeys,
} from 'src/sections/services/hooks';
import { useQueryClient } from '@tanstack/react-query';

// ----------------------------------------------------------------------

export default function Services() {
  const router = useRouter();
  const { data: servicesData, isLoading } = useSupplierServices();
  const { data: serviceTypesData } = useServicesTypes();

 
  const supplierServices: any[] = React.useMemo(() => {
    const raw = servicesData?.data ?? servicesData;
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.data)) return raw.data;
    if (raw && Array.isArray((raw as any).services)) return (raw as any).services;
    return [];
  }, [servicesData]);

  const serviceNameById = useMemo(() => {
    const map = new Map<string, string>();
    const raw = serviceTypesData?.data as any;
    let serviceTypes: any[] = [];
    if (Array.isArray(raw)) {
      serviceTypes = raw;
    } else if (raw?.services && Array.isArray(raw.services)) {
      serviceTypes = raw.services;
    } else {
      serviceTypes = [];
    }

    serviceTypes.forEach((s: any) => {
      if (s && s.id) map.set(s.id, s.name || s.label || '');
    });

    return map;
  }, [serviceTypesData]);

  


  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; row: any }>({
    open: false,
    row: null,
  });

  const deleteMutation = useDeleteSupplierService();
  const [isDeleting, setIsDeleting] = useState(false);
  const updateMutation = useUpdateSupplierServices();
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();


  const [editDialog, setEditDialog] = useState<{ open: boolean; row: any }>({
    open: false,
    row: null,
  });
  const [editDelivery, setEditDelivery] = useState('');
  const [editPrices, setEditPrices] = useState<Array<{ id?: string; price: string; type: any }>>(
    []
  );

  const handleDelete = (row: any) => {
    setDeleteDialog({ open: true, row });
  };

  const handleEdit = (row: any) => {
    
    setEditDialog({ open: true, row });
    setEditDelivery(row.delivery_time_slots || '');
    setEditPrices(
      Array.isArray(row.prices)
        ? row.prices.map((p: any) => ({ id: p.id, price: String(p.price), type: p.type }))
        : []
    );
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.row) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync(deleteDialog.row.id);

      try {
        await queryClient.invalidateQueries({ queryKey: supplierServicesKeys.all });
      } catch (e) {
        // ignore invalidate errors
        // console.debug('invalidate failed', e);
      }
    } catch (error) {
      console.error('Delete failed', error);
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ open: false, row: null });
    }
  };

  const handleCloseDelete = () => setDeleteDialog({ open: false, row: null });

  const handlePriceChange = (index: number, value: string) => {
    setEditPrices((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], price: value };
      return next;
    });
  };

  const handleCloseEdit = () => setEditDialog({ open: false, row: null });

  const handleConfirmEdit = async () => {
    if (!editDialog.row) return;
    setIsUpdating(true);
    try {
      const pricesPayload = editPrices.map((p) => ({
        id: p.id,
        price: p.price,
        type: typeof p.type === 'object' ? (p.type.value ?? p.type) : p.type,
      }));

      const payload = {
        services: [
          {
            id: editDialog.row.id,
            service_id: editDialog.row.service_id,
            delivery_time_slots: editDelivery || '',
            prices: pricesPayload,
          },
        ],
      };

      await updateMutation.mutateAsync(payload as any);
 
      try {
        await queryClient.invalidateQueries({ queryKey: supplierServicesKeys.all });
      } catch (e) {
        // noop
      }
    } catch (error) {
      console.error('Update failed', error);
    } finally {
      setIsUpdating(false);
      handleCloseEdit();
    }
  };

  const handleCreateService = () => {
    router.push('/dashboard/management/services/create');
  };

  return (
    <>
      <Helmet>
        <title>Services | Sahra Supplier</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
          <Typography variant="h4">Services</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleCreateService}
          >
            Add Service
          </Button>
        </Stack>

        <Card>
          <CardContent>
            {!isLoading && supplierServices.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 400,
                  textAlign: 'center',
                }}
              >
                <Iconify
                  icon="solar:box-bold-duotone"
                  width={120}
                  sx={{ color: 'text.disabled', mb: 3 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No services yet
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                  Start by adding your first service to showcase what you offer.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={handleCreateService}
                >
                  Add Your First Service
                </Button>
              </Box>
            ) : (
              <Table
                data={supplierServices}
                columns={[
                  {
                    key: 'service_id',
                    label: 'Service',
                    render: (value: any) => serviceNameById.get(value) || value || '-',
                  },
                  { key: 'delivery_time_slots', label: 'Delivery Time Slots' },
                  {
                    key: 'price_per_guest',
                    label: 'Per Guest',
                    render: (_: any, row: any) => {
                      const p = Array.isArray(row.prices)
                        ? row.prices.find((x: any) => x.type?.value === 1 || x.type === 1)
                        : undefined;
                      return p ? p.price : '-';
                    },
                  },
                  {
                    key: 'price_per_block',
                    label: 'Per Block',
                    render: (_: any, row: any) => {
                      const p = Array.isArray(row.prices)
                        ? row.prices.find((x: any) => x.type?.value === 2 || x.type === 2)
                        : undefined;
                      return p ? p.price : '-';
                    },
                  },
                  {
                    key: 'price_per_hour',
                    label: 'Per Hour',
                    render: (_: any, row: any) => {
                      const p = Array.isArray(row.prices)
                        ? row.prices.find((x: any) => x.type?.value === 3 || x.type === 3)
                        : undefined;
                      return p ? p.price : '-';
                    },
                  },
                  {
                    key: 'actions',
                    label: 'Actions',
                    render: (_: any, row: any) => (
                      <Stack direction="row" spacing={1}>
                        <Button size="small" onClick={() => handleEdit(row)}>
                          Edit
                        </Button>
                        <Button size="small" color="error" onClick={() => handleDelete(row)}>
                          Delete
                        </Button>
                      </Stack>
                    ),
                    width: 160,
                  },
                ]}
                rowIdField="id"
                title={isLoading ? 'Loading services...' : 'Services'}
              />
            )}
            <Dialog open={deleteDialog.open} onClose={handleCloseDelete}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>Are you sure you want to delete this service?</DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDelete}>Cancel</Button>
                <Button onClick={handleConfirmDelete} color="error" disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={editDialog.open} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  label="Delivery Time Slots"
                  fullWidth
                  value={editDelivery}
                  onChange={(e) => setEditDelivery(e.target.value)}
                />

                {editPrices.map((p, idx) => (
                  <TextField
                    key={p.id ?? idx}
                    margin="dense"
                    label={`Price (${p.type?.label ?? p.type})`}
                    fullWidth
                    value={p.price}
                    onChange={(e) => handlePriceChange(idx, e.target.value)}
                    sx={{ mt: 1 }}
                  />
                ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEdit} disabled={isUpdating}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmEdit} variant="contained" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
