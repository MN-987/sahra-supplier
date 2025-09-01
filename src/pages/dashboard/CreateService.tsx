import React from 'react';
import { Helmet } from 'react-helmet-async';
import * as Yup from 'yup';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
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
import { useCreateSupplierServices, useServicesTypes } from 'src/sections/services/hooks';

// ----------------------------------------------------------------------

// Price type options
const PRICE_TYPE_OPTIONS = [
  { value: 'per_guest', label: 'Per Guest' },
  { value: 'per_hour', label: 'Per Hour' },
  { value: 'per_event', label: 'Per Event' },
  { value: 'fixed', label: 'Fixed' },
];

// Service Form Card Component
interface ServiceFormCardProps {
  index: number;
  serviceTypes: ServiceType[];
  onRemove: () => void;
  canRemove: boolean;
}

function ServiceFormCard({ index, serviceTypes, onRemove, canRemove }: ServiceFormCardProps) {
  const { control } = useFormContext<CreateServiceFormData>();
  const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({
    control,
    name: `services.${index}.prices`,
  });

  const handleAddPrice = () => {
    appendPrice({
      price: '',
      type: 'per_guest',
    });
  };

  const handleRemovePrice = (priceIndex: number) => {
    if (priceFields.length > 1) {
      removePrice(priceIndex);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        position: 'relative',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Remove Service Button */}
      {canRemove && (
        <IconButton
          onClick={onRemove}
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
        <Grid item xs={12} sm={6}>
          <RHFSelect
            name={`services.${index}.service_type`}
            label="Service Type *"
            placeholder="Select a service"
          >
            <MenuItem value="">
              <em>Select a service</em>
            </MenuItem>
            {serviceTypes?.map((service: ServiceType) => (
              <MenuItem key={service.id} value={service.id}>
                {service.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>

        {/* Delivery Time Slots */}
        <Grid item xs={12} sm={6}>
          <RHFTextField
            name={`services.${index}.delivery_time_slots`}
            label="Delivery Time Slots"
            placeholder="e.g. 2-4 Hours, Morning, Evening"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Policy Information Section */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'primary.main' }}>
        Policy Information
      </Typography>

      <Grid container spacing={3}>
        {/* Minimum Order Value */}
        <Grid item xs={12} sm={6}>
          <RHFTextField
            name={`services.${index}.minimum_order_value`}
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
            name={`services.${index}.minimum_lead_time`}
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
            name={`services.${index}.setup_time`}
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
            name={`services.${index}.teardown_time`}
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
            name={`services.${index}.cancellation_policy`}
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
            name={`services.${index}.deposit_requirement`}
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
            name={`services.${index}.repeat_rate`}
            label="Repeat Rate"
            placeholder="e.g., Monthly, Weekly, One-time"
          />
        </Grid>

        {/* Additional Requirements */}
        <Grid item xs={12}>
          <RHFTextField
            name={`services.${index}.additional_requirements`}
            label="Additional Requirements (Optional)"
            placeholder="Enter any additional requirements or special conditions"
            multiline
            rows={3}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Prices Section */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Prices
      </Typography>

      <Stack spacing={2}>
        {priceFields.map((priceField, priceIndex) => (
          <Card key={priceField.id} variant="outlined" sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <RHFTextField
                  name={`services.${index}.prices.${priceIndex}.price`}
                  label="Price"
                  placeholder="Enter price"
                  type="number"
                  InputProps={{
                    startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>AED</Box>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFSelect
                  name={`services.${index}.prices.${priceIndex}.type`}
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
              <Grid item xs={12} sm={2}>
                {priceFields.length > 1 && (
                  <IconButton
                    onClick={() => handleRemovePrice(priceIndex)}
                    color="error"
                    sx={{ mt: 1 }}
                  >
                    <Iconify icon="mingcute:delete-2-line" />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Card>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAddPrice}
            sx={{ borderStyle: 'dashed' }}
          >
            Add Price
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

// Service type from API
interface ServiceType {
  id: string;
  name: string;
  description: string;
  event_type_id: string | null;
  parent_id: string | null;
  status: {
    label: string;
    value: number;
  };
}

interface ServiceItem {
  service_type: string;
  delivery_time_slots: string;
  // Policy Information for each service
  minimum_order_value: string;
  minimum_lead_time: string;
  setup_time: string;
  teardown_time: string;
  cancellation_policy: string;
  deposit_requirement: string;
  repeat_rate: string;
  additional_requirements: string;
  // Prices
  prices: {
    price: string;
    type: string;
  }[];
}

interface CreateServiceFormData {
  services: ServiceItem[];
}

// Create service request format
interface CreateServiceRequest {
  services: {
    service_id: string;
    delivery_time_slots: string;
    prices: {
      price: number;
      type: number;
    }[];
  }[];
}

const CreateServiceSchema = Yup.object().shape({
  services: Yup.array()
    .of(
      Yup.object().shape({
        service_type: Yup.string().required('Service type is required'),
        delivery_time_slots: Yup.string().required('Delivery time slots are required'),
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
              price: Yup.string().required('Price is required'),
              type: Yup.string().required('Price type is required'),
            })
          )
          .min(1, 'At least one price is required'),
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
        delivery_time_slots: '',
        // Policy Information
        minimum_order_value: '',
        minimum_lead_time: '',
        setup_time: '',
        teardown_time: '',
        cancellation_policy: '',
        deposit_requirement: '',
        repeat_rate: '',
        additional_requirements: '',
        // Prices
        prices: [
          {
            price: '',
            type: 'per_guest',
          },
        ],
      },
    ],
  };
  const createServiceMutation = useCreateSupplierServices();
  const {
    data: servicesTypesData,
    isLoading: isLoadingServicesTypes,
    error: servicesTypesError,
  } = useServicesTypes();

  const serviceTypes: ServiceType[] = (servicesTypesData?.data as any)?.services || [];
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
      delivery_time_slots: '',
      // Policy Information
      minimum_order_value: '',
      minimum_lead_time: '',
      setup_time: '',
      teardown_time: '',
      cancellation_policy: '',
      deposit_requirement: '',
      repeat_rate: '',
      additional_requirements: '',
      // Prices
      prices: [
        {
          price: '',
          type: 'per_guest',
        },
      ],
    });
  };

  const handleRemoveService = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Transform form data to API format
      const apiData: CreateServiceRequest = {
        services: (data.services || []).map((service) => {
          const prices = (service.prices || []).map((price) => {
            // Map price type to API format
            let typeId = 1; // Default to per guest
            switch (price.type) {
              case 'per_guest':
                typeId = 1;
                break;
              case 'per_hour':
                typeId = 2;
                break;
              case 'per_event':
                typeId = 3;
                break;
              case 'fixed':
                typeId = 4;
                break;
              default:
                typeId = 1;
            }

            return {
              price: Number(price.price),
              type: typeId,
            };
          });

          return {
            service_id: service.service_type,
            delivery_time_slots: service.delivery_time_slots || '',
            prices: prices.filter((p) => p.price > 0), // Only include prices with values
          };
        }),
      };

      await createServiceMutation.mutateAsync(apiData as any);
      router.push('/dashboard/management/services');
    } catch (error) {
      console.error('Failed to create services:', error);
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
          {isLoadingServicesTypes && (
            <Card>
              <CardContent>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}
                >
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Loading service types...</Typography>
                </Box>
              </CardContent>
            </Card>
          )}
          {servicesTypesError && !isLoadingServicesTypes && (
            <Card>
              <CardContent>
                <Alert severity="error">
                  Failed to load service types. Please refresh the page and try again.
                </Alert>
              </CardContent>
            </Card>
          )}
          {!isLoadingServicesTypes && !servicesTypesError && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                  Service Information
                </Typography>

                <Stack spacing={3}>
                  {fields.map((field, index) => (
                    <ServiceFormCard
                      key={field.id}
                      index={index}
                      serviceTypes={serviceTypes}
                      onRemove={() => handleRemoveService(index)}
                      canRemove={fields.length > 1}
                    />
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
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isSubmitting || createServiceMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting || createServiceMutation.isPending}
                    loadingPosition="start"
                    startIcon={<Iconify icon="mingcute:save-line" />}
                  >
                    Create Services
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
