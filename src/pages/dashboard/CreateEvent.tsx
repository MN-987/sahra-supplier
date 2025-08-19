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
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'sonner';
import { useRouter } from 'src/routes/hooks';
// components
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField } from 'src/components/hook-form';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const EVENT_TYPE_OPTIONS = [
  'Wedding',
  'Corporate Event',
  'Birthday Party',
  'Conference',
  'Exhibition',
  'Concert',
  'Festival',
  'Workshop',
  'Seminar',
  'Product Launch',
  'Gala Dinner',
  'Networking Event',
];

interface EventItem {
  event_type: string;
  min_capacity: string;
  max_capacity: string;
}

interface CreateEventFormData {
  events: EventItem[];
}

const CreateEventSchema = Yup.object().shape({
  events: Yup.array()
    .of(
      Yup.object().shape({
        event_type: Yup.string().required('Event type is required'),
        min_capacity: Yup.string()
          .required('Minimum capacity is required')
          .matches(/^\d+$/, 'Must be a valid number'),
        max_capacity: Yup.string()
          .required('Maximum capacity is required')
          .matches(/^\d+$/, 'Must be a valid number')
          .test(
            'max-greater-than-min',
            'Maximum capacity must be greater than minimum capacity',
            (value, context) => {
              const { min_capacity } = context.parent;
              if (min_capacity && value) {
                return parseInt(value, 10) > parseInt(min_capacity, 10);
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

  const defaultValues: CreateEventFormData = {
    events: [
      {
        event_type: '',
        min_capacity: '',
        max_capacity: '',
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
    name: 'events',
  });

  const handleAddEvent = () => {
    append({
      event_type: '',
      min_capacity: '',
      max_capacity: '',
    });
  };

  const handleRemoveEvent = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Events data to save:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Events created successfully!');
      router.push('/dashboard/management/events');
    } catch (error) {
      console.error('Failed to create events:', error);
      toast.error('Failed to create events. Please try again.');
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
                          name={`events.${index}.event_type`}
                          label="What type of events do you organize?"
                          placeholder="Select an event type"
                        >
                          <MenuItem value="">
                            <em>Select an event type</em>
                          </MenuItem>
                          {EVENT_TYPE_OPTIONS.map((eventType) => (
                            <MenuItem key={eventType} value={eventType}>
                              {eventType}
                            </MenuItem>
                          ))}
                        </RHFSelect>
                      </Grid>

                      {/* Minimum Capacity */}
                      <Grid item xs={12} sm={6} md={3}>
                        <RHFTextField
                          name={`events.${index}.min_capacity`}
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
                      <Grid item xs={12} sm={6} md={3}>
                        <RHFTextField
                          name={`events.${index}.max_capacity`}
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
        </FormProvider>
      </Container>
    </>
  );
}
