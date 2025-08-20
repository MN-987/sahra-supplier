import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
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
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField } from 'src/components/hook-form';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import Iconify from 'src/components/iconify';
// types
import { SupplierEventType } from 'src/services/api/events';
// hooks
import { useEventTypes } from '../hooks';

// ----------------------------------------------------------------------

interface EditEventTypeFormData {
  event_type_id: string;
  min_capacity: number;
  max_capacity: number;
}

interface EditEventTypeModalProps {
  open: boolean;
  eventType: SupplierEventType | null;
  onClose: () => void;
  onSave: (id: string, data: Partial<SupplierEventType>) => void;
  isLoading?: boolean;
}

const EditEventTypeSchema = Yup.object().shape({
  event_type_id: Yup.string().required('Event type is required'),
  min_capacity: Yup.number()
    .required('Minimum capacity is required')
    .positive('Must be a positive number')
    .integer('Must be a whole number'),
  max_capacity: Yup.number()
    .required('Maximum capacity is required')
    .positive('Must be a positive number')
    .integer('Must be a whole number')
    .test(
      'max-greater-than-min',
      'Maximum capacity must be greater than minimum capacity',
      (value, context) => {
        const { min_capacity } = context.parent;
        if (min_capacity && value) {
          return value > min_capacity;
        }
        return true;
      }
    ),
});

export default function EditEventTypeModal({
  open,
  eventType,
  onClose,
  onSave,
  isLoading = false,
}: EditEventTypeModalProps) {
  const { data: eventTypesData, isLoading: isLoadingEventTypes } = useEventTypes();
  const eventTypes = eventTypesData?.data?.event_types || [];

  const defaultValues: EditEventTypeFormData = {
    event_type_id: eventType?.event_type_id || '',
    min_capacity: eventType?.min_capacity || 0,
    max_capacity: eventType?.max_capacity || 0,
  };

  const methods = useForm({
    resolver: yupResolver(EditEventTypeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Reset form when eventType changes
  React.useEffect(() => {
    if (eventType) {
      reset({
        event_type_id: eventType.event_type_id,
        min_capacity: eventType.min_capacity,
        max_capacity: eventType.max_capacity,
      });
    }
  }, [eventType, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (eventType) {
      await onSave(eventType.id, {
        event_type_id: data.event_type_id,
        min_capacity: data.min_capacity,
        max_capacity: data.max_capacity,
      });
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
        <Typography variant="h6">Edit Event Type</Typography>
      </DialogTitle>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent dividers>
          {isLoadingEventTypes ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading event types...</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Event Type Dropdown */}
              <Grid item xs={12}>
                <RHFSelect
                  name="event_type_id"
                  label="Event Type"
                  placeholder="Select an event type"
                  disabled={isLoadingEventTypes}
                >
                  <MenuItem value="">
                    <em>Select an event type</em>
                  </MenuItem>
                  {eventTypes.map((eventTypeOption) => (
                    <MenuItem key={eventTypeOption.id} value={eventTypeOption.id}>
                      {eventTypeOption.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              {/* Minimum Capacity */}
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="min_capacity"
                  label="Minimum Capacity"
                  placeholder="Enter minimum capacity"
                  type="number"
                  inputProps={{ min: 1 }}
                  InputProps={{
                    endAdornment: <Box sx={{ ml: 1, color: 'text.secondary' }}>people</Box>,
                  }}
                />
              </Grid>

              {/* Maximum Capacity */}
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="max_capacity"
                  label="Maximum Capacity"
                  placeholder="Enter maximum capacity"
                  type="number"
                  inputProps={{ min: 1 }}
                  InputProps={{
                    endAdornment: <Box sx={{ ml: 1, color: 'text.secondary' }}>people</Box>,
                  }}
                />
              </Grid>
            </Grid>
          )}
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
