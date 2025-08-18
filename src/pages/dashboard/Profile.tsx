import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Avatar,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'sonner';
// hooks
import { useCurrentUser } from 'src/hooks/api/use-auth';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFMultiCheckbox } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

interface ProfileFormData {
  // Personal Profile Fields
  service_areas_covered?: string[];
  company_name: string;
  description?: string | null;
  location: string;
  address: string;
  registration_number: string;
  email: string;
  contact_number: string;
  contact_name: string;
  preferred_contact_method?: string[];

  // Business Profile Fields
  repeat_rate?: string | null;
  social_media_profiles?: string | null;
  any_other_information?: string | null;
  setup_and_teardown_time?: string | null;
  backup_emergency_options?: string | null;
  licenses_and_certifications?: string | null;
  cancellation_policy_days?: number | null;
  deposit_requirements?: number | null;
  bank_details?: string | null;
  minimum_order_value_aed?: number | null;
  minimum_lead_time_days?: number | null;
}

const ProfileSchema = Yup.object().shape({
  // Personal Profile Validation
  service_areas_covered: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one service area is required'),
  company_name: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  description: Yup.string().nullable(),
  location: Yup.string().required('Location is required'),
  address: Yup.string().required('Address is required'),
  registration_number: Yup.string().required('Registration number is required'),
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  contact_number: Yup.string().required('Contact number is required'),
  contact_name: Yup.string()
    .required('Contact name is required')
    .min(2, 'Contact name must be at least 2 characters'),
  preferred_contact_method: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one contact method is required'),

  // Business Profile Validation
  repeat_rate: Yup.string().nullable(),
  social_media_profiles: Yup.string().nullable(),
  any_other_information: Yup.string().nullable(),
  setup_and_teardown_time: Yup.string().nullable(),
  backup_emergency_options: Yup.string().nullable(),
  licenses_and_certifications: Yup.string().nullable(),
  cancellation_policy_days: Yup.number().nullable().positive('Must be a positive number'),
  deposit_requirements: Yup.number().nullable().positive('Must be a positive number'),
  bank_details: Yup.string().nullable(),
  minimum_order_value_aed: Yup.number().nullable().positive('Must be a positive number'),
  minimum_lead_time_days: Yup.number().nullable().positive('Must be a positive number'),
});

const SERVICE_AREAS = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ras Al Khaimah',
  'Ajman',
  'Umm Al Quwain',
  'Fujeirah',
];

const CONTACT_METHODS = ['whatsapp', 'call', 'email'];

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();
  const [currentTab, setCurrentTab] = useState('personal');

  const defaultValues: ProfileFormData = {
    // Personal Profile Fields
    service_areas_covered: [],
    company_name: '',
    description: '',
    location: '',
    address: '',
    registration_number: '',
    email: '',
    contact_number: '',
    contact_name: '',
    preferred_contact_method: [],

    // Business Profile Fields
    repeat_rate: '',
    social_media_profiles: '',
    any_other_information: '',
    setup_and_teardown_time: '',
    backup_emergency_options: '',
    licenses_and_certifications: '',
    cancellation_policy_days: null,
    deposit_requirements: null,
    bank_details: '',
    minimum_order_value_aed: null,
    minimum_lead_time_days: null,
  };

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        // Personal Profile Fields
        service_areas_covered: [],
        company_name: user.name || '',
        description: user.description || '',
        location: '',
        address: user.address || '',
        registration_number: '',
        email: user.email || '',
        contact_number: user.phone_number || '',
        contact_name: user.name || '',
        preferred_contact_method: [],

        // Business Profile Fields
        repeat_rate: '',
        social_media_profiles: '',
        any_other_information: '',
        setup_and_teardown_time: '',
        backup_emergency_options: '',
        licenses_and_certifications: '',
        cancellation_policy_days: null,
        deposit_requirements: null,
        bank_details: '',
        minimum_order_value_aed: null,
        minimum_lead_time_days: null,
      });
    }
  }, [user, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Profile data to save:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title>Profile | Sahra Supplier</title>
      </Helmet>

      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Profile
        </Typography>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            {/* Profile Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Stack spacing={3} alignItems="center">
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        fontSize: '3rem',
                        bgcolor: 'primary.main',
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box textAlign="center">
                      <Typography variant="h6" gutterBottom>
                        {user?.name || 'User Name'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Supplier Account
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Profile Form with Tabs */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Profile Information
                  </Typography>

                  {/* Tabs */}
                  <Tabs
                    value={currentTab}
                    onChange={(event, newValue) => setCurrentTab(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
                  >
                    <Tab label="Personal" value="personal" />
                    <Tab label="Business" value="business" />
                  </Tabs>

                  {/* Personal Profile Tab */}
                  {currentTab === 'personal' && (
                    <Grid container spacing={3}>
                      {/* Past Event References */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Past Event References
                        </Typography>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9',
                          }}
                        />
                      </Grid>

                      {/* Service Areas Covered */}
                      <Grid item xs={12}>
                        <RHFMultiCheckbox
                          name="service_areas_covered"
                          label="Service Areas Covered"
                          options={SERVICE_AREAS.map((area) => ({ label: area, value: area }))}
                          row
                          spacing={1}
                          sx={{ mt: 1 }}
                        />
                      </Grid>

                      {/* Company Name */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="company_name"
                          label="Company Name"
                          placeholder="Enter company name"
                        />
                      </Grid>

                      {/* Location */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="location"
                          label="Location"
                          placeholder="Enter location"
                        />
                      </Grid>

                      {/* Registration Number */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="registration_number"
                          label="Registration Number"
                          placeholder="Enter registration number"
                          type="number"
                        />
                      </Grid>

                      {/* Email */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="email"
                          label="Email"
                          type="email"
                          placeholder="Enter email address"
                        />
                      </Grid>

                      {/* Contact Number */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="contact_number"
                          label="Contact Number"
                          placeholder="Enter contact number"
                          type="number"
                        />
                      </Grid>

                      {/* Contact Name */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="contact_name"
                          label="Contact Name"
                          placeholder="Enter contact name"
                        />
                      </Grid>

                      {/* Preferred Contact Method */}
                      <Grid item xs={12}>
                        <RHFMultiCheckbox
                          name="preferred_contact_method"
                          label="Preferred Contact Method"
                          options={CONTACT_METHODS.map((method) => ({
                            label: method.charAt(0).toUpperCase() + method.slice(1),
                            value: method,
                          }))}
                          row
                          spacing={1}
                          sx={{ mt: 1 }}
                        />
                      </Grid>

                      {/* Address */}
                      <Grid item xs={12}>
                        <RHFTextField
                          name="address"
                          label="Address"
                          placeholder="Enter address"
                          multiline
                          rows={2}
                        />
                      </Grid>

                      {/* Description */}
                      <Grid item xs={12}>
                        <RHFTextField
                          name="description"
                          label="Description"
                          placeholder="Enter description"
                          multiline
                          rows={4}
                        />
                      </Grid>
                    </Grid>
                  )}

                  {/* Business Profile Tab */}
                  {currentTab === 'business' && (
                    <Grid container spacing={3}>
                      {/* Repeat Rate */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="repeat_rate"
                          label="Repeat Rate"
                          placeholder="Enter repeat rate"
                        />
                      </Grid>

                      {/* Social Media Profiles */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="social_media_profiles"
                          label="Social Media Profiles"
                          placeholder="Enter social media profiles"
                        />
                      </Grid>

                      {/* Any Other Information */}
                      <Grid item xs={12}>
                        <RHFTextField
                          name="any_other_information"
                          label="Any Other Information"
                          placeholder="Enter any other information"
                          multiline
                          rows={3}
                        />
                      </Grid>

                      {/* Setup and Teardown Time */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="setup_and_teardown_time"
                          label="Setup and Teardown Time"
                          placeholder="e.g. 2 Hours"
                        />
                      </Grid>

                      {/* Backup Emergency Options */}
                      <Grid item xs={12}>
                        <RHFTextField
                          name="backup_emergency_options"
                          label="Backup Emergency Options"
                          placeholder="Enter backup emergency options"
                          multiline
                          rows={3}
                        />
                      </Grid>

                      {/* Licenses and Certifications */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Licenses and Certifications
                        </Typography>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9',
                          }}
                        />
                      </Grid>

                      {/* Cancellation Policy */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="cancellation_policy_days"
                          label="Cancellation Policy (Days Before Event)"
                          placeholder="Enter number of days"
                          type="number"
                        />
                      </Grid>

                      {/* Deposit Requirements */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="deposit_requirements"
                          label="Deposit Requirements"
                          placeholder="Enter deposit amount"
                          type="number"
                        />
                      </Grid>

                      {/* Bank Details */}
                      <Grid item xs={12}>
                        <RHFTextField
                          name="bank_details"
                          label="Bank Details"
                          placeholder="Enter bank details"
                          multiline
                          rows={3}
                        />
                      </Grid>

                      {/* Minimum Order Value in AED */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="minimum_order_value_aed"
                          label="Minimum Order Value in AED"
                          placeholder="Enter minimum order value"
                          type="number"
                        />
                      </Grid>

                      {/* Minimum Lead Time in Days */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="minimum_lead_time_days"
                          label="Minimum Lead Time in Days"
                          placeholder="Enter minimum lead time"
                          type="number"
                        />
                      </Grid>
                    </Grid>
                  )}

                  {/* Submit Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                      loadingPosition="start"
                      startIcon={<Iconify icon="mingcute:save-line" />}
                      size="large"
                    >
                      Save Changes
                    </LoadingButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}
