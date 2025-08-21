import React, { useEffect, useState } from 'react';
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
  Avatar,
  Stack,
  Tab,
  Tabs,
  Button,
  IconButton,
  MenuItem,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'sonner';
// hooks
import { useCurrentUser } from 'src/hooks/api/use-auth';
import { useBusinessProfile, useUpdateBusinessProfile } from 'src/hooks/api/use-business-profile';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFMultiCheckbox, RHFSelect } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

interface SocialLink {
  platform: string;
  url: string;
}

interface PersonalProfileFormData {
  service_areas_covered?: string[];
  company_name: string;
  description?: string;
  location: string;
  address: string;
  registration_number: string;
  email: string;
  contact_number: string;
  contact_name: string;
  preferred_contact_method?: string[];
}

interface BusinessProfileFormData {
  repeat_rate: string;
  backup_emergency_options: string;
  cancellation_policy: string;
  deposit_requirements: string;
  bank_details: string;
  minimum_order_value_aed: number;
  minimum_lead_time_days: number;
  setup_teardown_time: string;
  any_other_information?: string;
  social_links?: SocialLink[];
}

const PersonalProfileSchema = Yup.object().shape({
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
});

const BusinessProfileSchema = Yup.object().shape({
  repeat_rate: Yup.string().required('Repeat rate is required'),
  backup_emergency_options: Yup.string().required('Backup/emergency options are required'),
  cancellation_policy: Yup.string().required('Cancellation policy is required'),
  deposit_requirements: Yup.string().required('Deposit requirements are required'),
  bank_details: Yup.string().required('Bank details are required'),
  minimum_order_value_aed: Yup.number()
    .required('Minimum order value is required')
    .positive('Must be a positive number'),
  minimum_lead_time_days: Yup.number()
    .required('Minimum lead time is required')
    .positive('Must be a positive number'),
  setup_teardown_time: Yup.string().required('Setup/teardown time is required'),
  any_other_information: Yup.string().optional(),
  social_links: Yup.array()
    .of(
      Yup.object().shape({
        platform: Yup.string().required('Platform is required'),
        url: Yup.string().url('Must be a valid URL').required('URL is required'),
      })
    )
    .optional(),
});

// Social media platform options
const SOCIAL_PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: 'ri:instagram-line' },
  { value: 'facebook', label: 'Facebook', icon: 'ri:facebook-line' },
  { value: 'twitter', label: 'Twitter', icon: 'ri:twitter-line' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'ri:linkedin-line' },
  { value: 'youtube', label: 'YouTube', icon: 'ri:youtube-line' },
  { value: 'tiktok', label: 'TikTok', icon: 'ri:tiktok-line' },
  { value: 'website', label: 'Website', icon: 'ri:global-line' },
  { value: 'other', label: 'Other', icon: 'ri:links-line' },
];

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

  // Only fetch business profile when business tab is active
  const { data: businessProfile, isLoading: isBusinessProfileLoading } = useBusinessProfile(
    currentTab === 'business'
  );
  const updateBusinessProfile = useUpdateBusinessProfile();

  // Personal Profile Form
  const personalDefaultValues: PersonalProfileFormData = {
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
  };

  const personalMethods = useForm({
    resolver: yupResolver(PersonalProfileSchema),
    defaultValues: personalDefaultValues,
  });

  // Business Profile Form
  const businessDefaultValues: BusinessProfileFormData = {
    repeat_rate: '',
    backup_emergency_options: '',
    cancellation_policy: '',
    deposit_requirements: '',
    bank_details: '',
    minimum_order_value_aed: 0,
    minimum_lead_time_days: 0,
    setup_teardown_time: '',
    any_other_information: '',
    social_links: [],
  };

  const businessMethods = useForm({
    resolver: yupResolver(BusinessProfileSchema),
    defaultValues: businessDefaultValues,
  });

  const {
    control: personalControl,
    handleSubmit: handlePersonalSubmit,
    reset: resetPersonal,
    formState: { isSubmitting: isPersonalSubmitting },
  } = personalMethods;

  const {
    control: businessControl,
    handleSubmit: handleBusinessSubmit,
    reset: resetBusiness,
    formState: { isSubmitting: isBusinessSubmitting },
  } = businessMethods;

  const { fields, append, remove } = useFieldArray({
    control: businessControl,
    name: 'social_links',
  });

  // Initialize with one empty social link if none exist
  useEffect(() => {
    if (fields.length === 0) {
      append({ platform: '', url: '' });
    }
  }, [fields.length, append]);

  // Update personal form when user data loads
  useEffect(() => {
    if (user) {
      resetPersonal({
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
      });
    }
  }, [user, resetPersonal]);

  // Update business form when business profile data loads
  useEffect(() => {
    if (businessProfile?.data && currentTab === 'business') {
      const profile = businessProfile.data;

      // Convert social_media_profiles to social_links format
      const socialLinks: SocialLink[] = [];
      if (profile.social_media_profiles) {
        Object.entries(profile.social_media_profiles).forEach(([platform, url]) => {
          if (url) {
            socialLinks.push({ platform, url });
          }
        });
      }

      resetBusiness({
        repeat_rate: profile.repeat_rate || '',
        backup_emergency_options: profile.backup_emergency_options || '',
        cancellation_policy: profile.cancellation_policy || '',
        deposit_requirements: profile.deposit_requirements || '',
        bank_details: profile.bank_details || '',
        minimum_order_value_aed: profile.minimum_order_value_aed || 0,
        minimum_lead_time_days: profile.minimum_lead_time_days || 0,
        setup_teardown_time: profile.setup_teardown_time || '',
        any_other_information: profile.any_other_information || '',
        social_links: socialLinks.length > 0 ? socialLinks : [{ platform: '', url: '' }],
      });
    }
  }, [businessProfile, resetBusiness, currentTab]);

  // Personal form submit handler
  const onPersonalSubmit = handlePersonalSubmit(async (data) => {
    try {
      // Handle personal profile update here
      // This would require a separate API endpoint for personal profile
      console.log('Personal profile data to save:', data);
      toast.success('Personal profile updated successfully!');
    } catch (error) {
      console.error('Failed to update personal profile:', error);
      toast.error('Failed to update personal profile. Please try again.');
    }
  });

  // Business form submit handler
  const onBusinessSubmit = handleBusinessSubmit(async (data) => {
    try {
      // Convert social_links back to social_media_profiles format
      const socialMediaProfiles: { [key: string]: string } = {};
      if (data.social_links) {
        data.social_links.forEach((link: SocialLink) => {
          if (link.platform && link.url) {
            socialMediaProfiles[link.platform] = link.url;
          }
        });
      }

      const businessData = {
        repeat_rate: data.repeat_rate,
        backup_emergency_options: data.backup_emergency_options,
        cancellation_policy: data.cancellation_policy,
        deposit_requirements: data.deposit_requirements,
        bank_details: data.bank_details,
        minimum_order_value_aed: data.minimum_order_value_aed,
        minimum_lead_time_days: data.minimum_lead_time_days,
        setup_teardown_time: data.setup_teardown_time,
        any_other_information: data.any_other_information || '',
        social_media_profiles: socialMediaProfiles,
      };

      await updateBusinessProfile.mutateAsync(businessData);
    } catch (error) {
      console.error('Failed to update business profile:', error);
      // Error handling is done in the mutation
    }
  });

  if (isLoading || (currentTab === 'business' && isBusinessProfileLoading)) {
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
                  <FormProvider methods={personalMethods} onSubmit={onPersonalSubmit}>
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

                      {/* Personal Profile Submit Button */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                          <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={isPersonalSubmitting}
                            loadingPosition="start"
                            startIcon={<Iconify icon="mingcute:save-line" />}
                            size="large"
                          >
                            Save Personal Profile
                          </LoadingButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </FormProvider>
                )}

                {/* Business Profile Tab */}
                {currentTab === 'business' && (
                  <FormProvider methods={businessMethods} onSubmit={onBusinessSubmit}>
                    <Grid container spacing={3}>
                      {/* Financial Information - Priority Questions */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                          Financial Information
                        </Typography>
                      </Grid>

                      {/* Minimum Order Value in AED */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="minimum_order_value_aed"
                          label="Minimum Order Value (AED)"
                          placeholder="Enter minimum order value"
                          type="number"
                          InputProps={{
                            startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>AED</Box>,
                          }}
                        />
                      </Grid>

                      {/* Deposit Requirements */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="deposit_requirements"
                          label="Deposit Requirements (%)"
                          placeholder="Enter deposit percentage"
                          type="number"
                          InputProps={{
                            endAdornment: <Box sx={{ ml: 1, color: 'text.secondary' }}>%</Box>,
                          }}
                        />
                      </Grid>

                      {/* Bank Details */}
                      <Grid item xs={12}>
                        <RHFTextField
                          name="bank_details"
                          label="Bank Details"
                          placeholder="Enter bank account details (IBAN, Account Number, etc.)"
                          multiline
                          rows={2}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                      </Grid>

                      {/* Operational Information */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                          Operational Information
                        </Typography>
                      </Grid>

                      {/* Minimum Lead Time in Days */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="minimum_lead_time_days"
                          label="Minimum Lead Time (Days)"
                          placeholder="Enter minimum lead time"
                          type="number"
                          InputProps={{
                            endAdornment: <Box sx={{ ml: 1, color: 'text.secondary' }}>days</Box>,
                          }}
                        />
                      </Grid>

                      {/* Cancellation Policy */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="cancellation_policy"
                          label="Cancellation Policy"
                          placeholder="Describe your cancellation policy"
                          multiline
                          rows={2}
                        />
                      </Grid>

                      {/* Setup and Teardown Time */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="setup_teardown_time"
                          label="Setup and Teardown Time"
                          placeholder="e.g. 2 hours, 30 minutes"
                        />
                      </Grid>

                      {/* Repeat Rate */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="repeat_rate"
                          label="Repeat Rate"
                          placeholder="e.g. Monthly, Weekly, etc."
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                      </Grid>

                      {/* Additional Information */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                          Additional Information
                        </Typography>
                      </Grid>

                      {/* Backup Emergency Options */}
                      <Grid item xs={12}>
                        <RHFTextField
                          name="backup_emergency_options"
                          label="Backup/Emergency Options"
                          placeholder="Describe your backup plans and emergency options"
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

                      {/* Any Other Information */}
                      <Grid item xs={12}>
                        <RHFTextField
                          name="any_other_information"
                          label="Any Other Information"
                          placeholder="Additional details about your services, special offerings, etc."
                          multiline
                          rows={3}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                      </Grid>

                      {/* Social Media Links */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                          Social Media Links
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Add your social media profiles to help customers find and connect with
                          you.
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Stack spacing={2}>
                          {fields.map((field, index) => (
                            <Card key={field.id} variant="outlined" sx={{ p: 2 }}>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={4}>
                                  <RHFSelect
                                    name={`social_links.${index}.platform`}
                                    label="Platform"
                                    placeholder="Select platform"
                                  >
                                    {SOCIAL_PLATFORMS.map((platform) => (
                                      <MenuItem key={platform.value} value={platform.value}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                          <Iconify icon={platform.icon} width={20} />
                                          <Typography>{platform.label}</Typography>
                                        </Stack>
                                      </MenuItem>
                                    ))}
                                  </RHFSelect>
                                </Grid>
                                <Grid item xs={12} sm={7}>
                                  <RHFTextField
                                    name={`social_links.${index}.url`}
                                    label="URL"
                                    placeholder="https://..."
                                  />
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                  <IconButton
                                    onClick={() => remove(index)}
                                    color="error"
                                    disabled={fields.length === 1}
                                  >
                                    <Iconify icon="mingcute:delete-2-line" />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </Card>
                          ))}

                          <Button
                            variant="outlined"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={() => append({ platform: '', url: '' })}
                            sx={{ alignSelf: 'flex-start' }}
                          >
                            Add Social Link
                          </Button>
                        </Stack>
                      </Grid>

                      {/* Business Profile Submit Button */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                          <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={isBusinessSubmitting || updateBusinessProfile.isPending}
                            loadingPosition="start"
                            startIcon={<Iconify icon="mingcute:save-line" />}
                            size="large"
                          >
                            Save Business Profile
                          </LoadingButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </FormProvider>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
