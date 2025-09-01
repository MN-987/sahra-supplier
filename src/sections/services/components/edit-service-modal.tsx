import React from 'react';
import * as Yup from 'yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  MenuItem,
  IconButton,
  Card,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField } from 'src/components/hook-form';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import Iconify from 'src/components/iconify';
// types
import { SupplierService, ServicePrice } from 'src/services/api/services';

// ----------------------------------------------------------------------

interface EditServiceFormData {
  service_id: string;
  delivery_time_slots: string;
  // Policy Information
  minimum_order_value: string;
  minimum_lead_time: string;
  setup_time: string;
  teardown_time: string;
  cancellation_policy: string;
  deposit_requirement: string;
  repeat_rate: string;
  additional_requirements: string;
  // Prices
  prices: ServicePrice[];
}

interface EditServiceModalProps {
  open: boolean;
  service: SupplierService | null;
  onClose: () => void;
  onSave: (id: string, data: Partial<SupplierService>) => void;
  isLoading?: boolean;
}

// Static service options (as requested)
const SERVICE_OPTIONS = [
  { id: '1', name: 'Photography' },
  { id: '2', name: 'Videography' },
  { id: '3', name: 'Catering' },
  { id: '4', name: 'Decoration' },
  { id: '5', name: 'Music & Entertainment' },
  { id: '6', name: 'Transportation' },
  { id: '7', name: 'Venue' },
  { id: '8', name: 'Flowers' },
];

// Price type options
const PRICE_TYPE_OPTIONS = [
  { value: 1, label: 'Per Hour' },
  { value: 2, label: 'Per Day' },
  { value: 3, label: 'Fixed Price' },
  { value: 4, label: 'Per Person' },
];

const EditServiceSchema = Yup.object().shape({
  service_id: Yup.string().required('Service is required'),
  delivery_time_slots: Yup.string().required('Delivery time slots is required'),
  // Policy Information
  minimum_order_value: Yup.string().required('Minimum order value is required'),
  minimum_lead_time: Yup.string().required('Minimum lead time is required'),
  setup_time: Yup.string().required('Setup time is required'),
  teardown_time: Yup.string().required('Teardown time is required'),
  cancellation_policy: Yup.string().required('Cancellation policy is required'),
  deposit_requirement: Yup.string().required('Deposit requirement is required'),
  repeat_rate: Yup.string().required('Repeat rate is required'),
  additional_requirements: Yup.string(),
  // Prices
  prices: Yup.array()
    .of(
      Yup.object().shape({
        price: Yup.number().required('Price is required').positive('Must be a positive number'),
        type: Yup.number().required('Price type is required'),
      })
    )
    .min(1, 'At least one price is required'),
});

export default function EditServiceModal({
  open,
  service,
  onClose,
  onSave,
  isLoading = false,
}: EditServiceModalProps) {
  const defaultValues: EditServiceFormData = {
    service_id: service?.service_id || '',
    delivery_time_slots: service?.delivery_time_slots || '',
    // Policy Information
    minimum_order_value: (service as any)?.minimum_order_value || '',
    minimum_lead_time: (service as any)?.minimum_lead_time || '',
    setup_time: (service as any)?.setup_time || '',
    teardown_time: (service as any)?.teardown_time || '',
    cancellation_policy: (service as any)?.cancellation_policy || '',
    deposit_requirement: (service as any)?.deposit_requirement || '',
    repeat_rate: (service as any)?.repeat_rate || '',
    additional_requirements: (service as any)?.additional_requirements || '',
    // Prices
    prices: service?.prices || [{ price: 0, type: 1 }],
  };

  const methods = useForm({
    resolver: yupResolver(EditServiceSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prices',
  });

  // Reset form when service changes
  React.useEffect(() => {
    if (service) {
      reset({
        service_id: service.service_id,
        delivery_time_slots: service.delivery_time_slots,
        // Policy Information
        minimum_order_value: (service as any)?.minimum_order_value || '',
        minimum_lead_time: (service as any)?.minimum_lead_time || '',
        setup_time: (service as any)?.setup_time || '',
        teardown_time: (service as any)?.teardown_time || '',
        cancellation_policy: (service as any)?.cancellation_policy || '',
        deposit_requirement: (service as any)?.deposit_requirement || '',
        repeat_rate: (service as any)?.repeat_rate || '',
        additional_requirements: (service as any)?.additional_requirements || '',
        // Prices
        prices: service.prices.length > 0 ? service.prices : [{ price: 0, type: 1 }],
      });
    }
  }, [service, reset]);

  const handleAddPrice = () => {
    append({ price: 0, type: 1 });
  };

  const handleRemovePrice = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (service) {
      await onSave(service.id, {
        service_id: data.service_id,
        delivery_time_slots: data.delivery_time_slots,
        // Policy Information
        minimum_order_value: data.minimum_order_value,
        minimum_lead_time: data.minimum_lead_time,
        setup_time: data.setup_time,
        teardown_time: data.teardown_time,
        cancellation_policy: data.cancellation_policy,
        deposit_requirement: data.deposit_requirement,
        repeat_rate: data.repeat_rate,
        additional_requirements: data.additional_requirements,
        // Prices
        prices: data.prices,
      } as any);
      onClose();
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Edit Service</Typography>
      </DialogTitle>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Grid container spacing={3}>
            {/* Service Type and Delivery Time Slots */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
                Service Information
              </Typography>
            </Grid>

            {/* Service Dropdown */}
            <Grid item xs={12} md={6}>
              <RHFSelect name="service_id" label="Service Type" placeholder="Select a service">
                <MenuItem value="">
                  <em>Select a service</em>
                </MenuItem>
                {SERVICE_OPTIONS.map((serviceOption) => (
                  <MenuItem key={serviceOption.id} value={serviceOption.id}>
                    {serviceOption.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            {/* Delivery Time Slots */}
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="delivery_time_slots"
                label="Delivery Time Slots"
                placeholder="e.g. 2-4 Hours, Morning, Evening"
              />
            </Grid>

            {/* Policy Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2, color: 'primary.main' }}>
                Policy Information
              </Typography>
            </Grid>

            {/* Minimum Order Value */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="minimum_order_value"
                label="Minimum Order Value (AED)"
                placeholder="Enter minimum order value"
                type="number"
                InputProps={{
                  endAdornment: <Box sx={{ ml: 1, color: 'text.secondary' }}>AED</Box>,
                }}
              />
            </Grid>

            {/* Minimum Lead Time */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="minimum_lead_time"
                label="Minimum Lead Time (Days)"
                placeholder="Enter minimum lead time"
                type="number"
                InputProps={{
                  endAdornment: <Box sx={{ ml: 1, color: 'text.secondary' }}>days</Box>,
                }}
              />
            </Grid>

            {/* Setup Time */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="setup_time"
                label="Setup Time (Hours)"
                placeholder="Enter setup time"
                type="number"
                InputProps={{
                  endAdornment: <Box sx={{ ml: 1, color: 'text.secondary' }}>hours</Box>,
                }}
              />
            </Grid>

            {/* Teardown Time */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="teardown_time"
                label="Teardown Time (Hours)"
                placeholder="Enter teardown time"
                type="number"
                InputProps={{
                  endAdornment: <Box sx={{ ml: 1, color: 'text.secondary' }}>hours</Box>,
                }}
              />
            </Grid>

            {/* Cancellation Policy */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="cancellation_policy"
                label="Cancellation Policy (Days)"
                placeholder="Enter cancellation policy"
                type="number"
                InputProps={{
                  endAdornment: <Box sx={{ ml: 1, color: 'text.secondary' }}>days</Box>,
                }}
              />
            </Grid>

            {/* Deposit Requirement */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="deposit_requirement"
                label="Deposit Requirement (%)"
                placeholder="Enter deposit percentage"
                type="number"
                InputProps={{
                  endAdornment: <Box sx={{ ml: 1, color: 'text.secondary' }}>%</Box>,
                }}
              />
            </Grid>

            {/* Repeat Rate */}
            <Grid item xs={12}>
              <RHFTextField
                name="repeat_rate"
                label="Repeat Rate"
                placeholder="e.g., Monthly, Weekly, One-time"
              />
            </Grid>

            {/* Additional Requirements */}
            <Grid item xs={12}>
              <RHFTextField
                name="additional_requirements"
                label="Additional Requirements (Optional)"
                placeholder="Enter any additional requirements or special conditions"
                multiline
                rows={3}
              />
            </Grid>

            {/* Prices Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2, color: 'primary.main' }}>
                Pricing
              </Typography>

              {fields.map((field, index) => (
                <Card
                  key={field.id}
                  variant="outlined"
                  sx={{
                    p: 3,
                    mb: 2,
                    position: 'relative',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {/* Remove Price Button */}
                  {fields.length > 1 && (
                    <IconButton
                      onClick={() => handleRemovePrice(index)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'error.main',
                      }}
                    >
                      <Iconify icon="mingcute:close-line" />
                    </IconButton>
                  )}

                  <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                    Price #{index + 1}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <RHFTextField
                        name={`prices.${index}.price`}
                        label="Price"
                        placeholder="Enter price"
                        type="number"
                        inputProps={{ min: 0, step: 0.01 }}
                        InputProps={{
                          startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>AED</Box>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <RHFSelect
                        name={`prices.${index}.type`}
                        label="Price Type"
                        placeholder="Select price type"
                      >
                        {PRICE_TYPE_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </Grid>
                  </Grid>
                </Card>
              ))}

              {/* Add Price Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={handleAddPrice}
                  sx={{
                    borderStyle: 'dashed',
                    py: 1.5,
                    px: 3,
                  }}
                >
                  Add Another Price
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={isSubmitting || isLoading}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting || isLoading}
            loadingPosition="start"
            startIcon={<Iconify icon="mingcute:save-line" />}
          >
            Save Changes
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
