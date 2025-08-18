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

const SERVICE_OPTIONS = [
  'Catering',
  'Decorations',
  'Venues',
  'Audio Visual',
  'Furniture',
  'Staff',
  'Music',
];

interface ServiceItem {
  service_type: string;
  price_per_guest: string;
  price_per_hour: string;
  fixed_price: string;
  delivery_time_slots: string;
}

interface CreateServiceFormData {
  services: ServiceItem[];
}

const CreateServiceSchema = Yup.object().shape({
  services: Yup.array()
    .of(
      Yup.object().shape({
        service_type: Yup.string().required('Service type is required'),
        price_per_guest: Yup.string(),
        price_per_hour: Yup.string(),
        fixed_price: Yup.string(),
        delivery_time_slots: Yup.string(),
      })
    )
    .min(1, 'At least one service is required'),
});

export default function CreateService() {
  const router = useRouter();

  const defaultValues: CreateServiceFormData = {
    services: [
      {
        service_type: '',
        price_per_guest: '',
        price_per_hour: '',
        fixed_price: '',
        delivery_time_slots: '',
      },
    ],
  };

  const methods = useForm({
    resolver: yupResolver(CreateServiceSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  });

  const handleAddService = () => {
    append({
      service_type: '',
      price_per_guest: '',
      price_per_hour: '',
      fixed_price: '',
      delivery_time_slots: '',
    });
  };

  const handleRemoveService = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Services data to save:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Services created successfully!');
      router.push('/dashboard/management/services');
    } catch (error) {
      console.error('Failed to create services:', error);
      toast.error('Failed to create services. Please try again.');
    }
  });

  const handleCancel = () => {
    router.push('/dashboard/management/services');
  };

  return (
    <>
      <Helmet>
        <title>Create Service | Sahra Supplier</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
          <IconButton onClick={handleCancel} sx={{ mr: 1 }}>
            <Iconify icon="eva:arrow-back-fill" />
          </IconButton>
          <Typography variant="h4">Create Services</Typography>
        </Stack>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Service Information
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
                    {/* Remove Service Button */}
                    {fields.length > 1 && (
                      <IconButton
                        onClick={() => handleRemoveService(index)}
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
                      Service #{index + 1}
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Service Type Dropdown */}
                      <Grid item xs={12}>
                        <RHFSelect
                          name={`services.${index}.service_type`}
                          label="What services do you offer?"
                          placeholder="Select a service"
                        >
                          <MenuItem value="">
                            <em>Select a service</em>
                          </MenuItem>
                          {SERVICE_OPTIONS.map((service) => (
                            <MenuItem key={service} value={service}>
                              {service}
                            </MenuItem>
                          ))}
                        </RHFSelect>
                      </Grid>

                      {/* Price per Guest */}
                      <Grid item xs={12} sm={6} md={3}>
                        <RHFTextField
                          name={`services.${index}.price_per_guest`}
                          label="Price per guest"
                          placeholder="Enter price per guest"
                          type="number"
                          InputProps={{
                            startAdornment: <Box sx={{ mr: 1 }}>AED</Box>,
                          }}
                        />
                      </Grid>

                      {/* Price per Hour */}
                      <Grid item xs={12} sm={6} md={3}>
                        <RHFTextField
                          name={`services.${index}.price_per_hour`}
                          label="Price per hour"
                          placeholder="Enter price per hour"
                          type="number"
                          InputProps={{
                            startAdornment: <Box sx={{ mr: 1 }}>AED</Box>,
                          }}
                        />
                      </Grid>

                      {/* Fixed Price */}
                      <Grid item xs={12} sm={6} md={3}>
                        <RHFTextField
                          name={`services.${index}.fixed_price`}
                          label="Fixed price"
                          placeholder="Enter fixed price"
                          type="number"
                          InputProps={{
                            startAdornment: <Box sx={{ mr: 1 }}>AED</Box>,
                          }}
                        />
                      </Grid>

                      {/* Delivery Time Slots */}
                      <Grid item xs={12} sm={6} md={3}>
                        <RHFTextField
                          name={`services.${index}.delivery_time_slots`}
                          label="Delivery time slots"
                          placeholder="e.g. 2-4 Hours"
                        />
                      </Grid>
                    </Grid>
                  </Card>
                ))}

                {/* Add Service Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleAddService}
                    sx={{
                      borderStyle: 'dashed',
                      py: 1.5,
                      px: 3,
                    }}
                  >
                    Add Another Service
                  </Button>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  loadingPosition="start"
                  startIcon={<Iconify icon="mingcute:save-line" />}
                >
                  Create Services
                </LoadingButton>
              </Stack>
            </CardContent>
          </Card>
        </FormProvider>
      </Container>
    </>
  );
}
