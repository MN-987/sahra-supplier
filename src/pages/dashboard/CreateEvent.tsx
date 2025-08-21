import React from 'react';
import { Helmet } from 'react-helmet-async';
import * as Yup from 'yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Stack,
  IconButton,
  Divider,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'src/routes/hooks';
// components
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField } from 'src/components/hook-form';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import Iconify from 'src/components/iconify';
// hooks
import { useCreateSupplierEventTypes, useEventTypes } from 'src/sections/events/hooks';
import { useCurrentUser } from 'src/hooks/api/use-auth';

// ----------------------------------------------------------------------

interface EventItem {
  event_type_id: string;
  min_capacity: number;
  max_capacity: number;
}

interface CreateEventFormData {
  event_types: EventItem[];
}

const CreateEventSchema = Yup.object().shape({
  event_types: Yup.array()
    .of(
      Yup.object().shape({
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
      })
    )
    .min(1, 'At least one event type is required'),
});

export default function CreateEvent() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const createEventTypes = useCreateSupplierEventTypes();
  const {
    data: eventTypesData,
    isLoading: isLoadingEventTypes,
    error: eventTypesError,
  } = useEventTypes();
  const eventTypes = eventTypesData?.data?.event_types || [];
  const defaultValues: CreateEventFormData = {
    event_types: [
      {
        event_type_id: '',
        min_capacity: 0,
        max_capacity: 0,
      },
    ],
  };

  const methods = useForm({
    resolver: yupResolver(CreateEventSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'event_types',
  });

  const handleAddEvent = () => {
    append({
      event_type_id: '',
      min_capacity: 0,
      max_capacity: 0,
    });
  };

  const handleRemoveEvent = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Transform form data to API format - add supplier_id to each event type
      const apiPayload = {
        event_types: (data.event_types || []).map((eventType) => ({
          event_type_id: eventType.event_type_id,
          supplier_id: user?.id || '', // Use the current user's ID as supplier_id
          min_capacity: eventType.min_capacity,
          max_capacity: eventType.max_capacity,
        })),
      };

      // Use the mutation hook to create event types
      await createEventTypes.mutateAsync(apiPayload);

      router.push('/dashboard/management/events');
    } catch (error) {
      console.error('Failed to create events:', error);
      // Error handling is done through React Query in the hook
    }
  });

  const handleCancel = () => {
    router.push('/dashboard/management/events');
  };

  return (
    <>
      <Helmet>
        <title>Create Event | Sahra Supplier</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
          <IconButton onClick={handleCancel} sx={{ mr: 1 }}>
            <Iconify icon="eva:arrow-back-fill" />
          </IconButton>
          <Typography variant="h4">Create Events</Typography>
        </Stack>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          {isLoadingEventTypes && (
            <Card>
              <CardContent>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}
                >
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Loading event types...</Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {eventTypesError && !isLoadingEventTypes && (
            <Card>
              <CardContent>
                <Alert severity="error">
                  Failed to load event types. Please refresh the page and try again.
                </Alert>
              </CardContent>
            </Card>
          )}

          {!isLoadingEventTypes && !eventTypesError && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Event Information
                </Typography>

                <Stack spacing={3}>
                  {fields.map((field, index) => (
                    <Card
                      key={field.id}
                      variant="outlined"
                      sx={{
                        p: 3,
                        position: 'relative',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {/* Remove Event Button */}
                      {fields.length > 1 && (
                        <IconButton
                          onClick={() => handleRemoveEvent(index)}
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

                      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                        Event Type #{index + 1}
                      </Typography>

                      <Grid container spacing={3}>
                        {/* Event Type Dropdown */}
                        <Grid item xs={12} md={6}>
                          <RHFSelect
                            name={`event_types.${index}.event_type_id`}
                            label="What type of events do you organize?"
                            placeholder="Select an event type"
                            disabled={isLoadingEventTypes}
                          >
                            <MenuItem value="">
                              <em>Select an event type</em>
                            </MenuItem>
                            {eventTypes.map((eventType) => (
                              <MenuItem key={eventType.id} value={eventType.id}>
                                {eventType.name}
                              </MenuItem>
                            ))}
                          </RHFSelect>
                          {eventTypesError && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                              Failed to load event types. Please try again.
                            </Typography>
                          )}
                        </Grid>

                        {/* Minimum Capacity */}
                        <Grid item xs={12} sm={6} md={3}>
                          <RHFTextField
                            name={`event_types.${index}.min_capacity`}
                            label="Minimum Capacity"
                            placeholder="Enter minimum capacity"
                            type="number"
                            inputProps={{ min: 1 }}
                            InputProps={{
                              endAdornment: (
                                <Box sx={{ ml: 1, color: 'text.secondary' }}>people</Box>
                              ),
                            }}
                          />
                        </Grid>

                        {/* Maximum Capacity */}
                        <Grid item xs={12} sm={6} md={3}>
                          <RHFTextField
                            name={`event_types.${index}.max_capacity`}
                            label="Maximum Capacity"
                            placeholder="Enter maximum capacity"
                            type="number"
                            inputProps={{ min: 1 }}
                            InputProps={{
                              endAdornment: (
                                <Box sx={{ ml: 1, color: 'text.secondary' }}>people</Box>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  ))}

                  {/* Add Event Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="mingcute:add-line" />}
                      onClick={handleAddEvent}
                      sx={{
                        borderStyle: 'dashed',

                        py: 2,
                        px: 4,
                      }}
                    >
                      Add Another Event Type
                    </Button>
                  </Box>
                </Stack>

                <Divider sx={{ my: 4 }} />

                {/* Form Actions */}
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: 'flex-end',
                    pt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    loadingPosition="start"
                    startIcon={<Iconify icon="mingcute:save-line" />}
                    size="large"
                  >
                    Create Events
                  </LoadingButton>
                </Stack>
              </CardContent>
            </Card>
          )}
        </FormProvider>
      </Container>
    </>
  );
}
