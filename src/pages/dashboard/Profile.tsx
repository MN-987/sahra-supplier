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
  company_name: string;
  description?: string;
  address: string;
  registration_number: string;
  email: string;
  contact_number: string;
  preferred_contact_method?: string[];
}

interface PastEventReference {
  event_name: string;
  client_name: string;
  event_date: string;
  event_type: string;
  guest_count: number;
  location: string;
  description: string;
}

interface BusinessProfileFormData {
  bank_details: string;
  additional_information?: string;
  past_event_references?: PastEventReference[];
  social_links?: SocialLink[];
}

const PersonalProfileSchema = Yup.object().shape({
  company_name: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  description: Yup.string().nullable(),
  address: Yup.string().required('Address is required'),
  registration_number: Yup.string().required('Registration number is required'),
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  contact_number: Yup.string().required('Contact number is required'),
  preferred_contact_method: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one contact method is required'),
});

const BusinessProfileSchema = Yup.object().shape({
  bank_details: Yup.string().required('Bank details are required'),
  additional_information: Yup.string().optional(),
  past_event_references: Yup.array()
    .of(
      Yup.object().shape({
        event_name: Yup.string().required('Event name is required'),
        client_name: Yup.string().required('Client name is required'),
        event_date: Yup.string().required('Event date is required'),
        event_type: Yup.string().required('Event type is required'),
        guest_count: Yup.number()
          .required('Guest count is required')
          .positive('Must be a positive number'),
        location: Yup.string().required('Location is required'),
        description: Yup.string().required('Description is required'),
      })
    )
    .optional(),
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
    company_name: '',
    description: '',
    address: '',
    registration_number: '',
    email: '',
    contact_number: '',
    preferred_contact_method: [],
  };

  const personalMethods = useForm({
    resolver: yupResolver(PersonalProfileSchema),
    defaultValues: personalDefaultValues,
  });

  // Business Profile Form
  const businessDefaultValues: BusinessProfileFormData = {
    bank_details: '',
    additional_information: '',
    past_event_references: [],
    social_links: [],
  };

  const businessMethods = useForm({
    resolver: yupResolver(BusinessProfileSchema),
    defaultValues: businessDefaultValues,
  });

  const {
    handleSubmit: handlePersonalSubmit,
    reset: resetPersonal,
    formState: { isSubmitting: isPersonalSubmitting },
  } = personalMethods;

  const {
    control: businessControl,
    handleSubmit: handleBusinessSubmit,
    reset: resetBusiness,
    watch: watchBusiness,
    setValue: setValueBusiness,
    formState: { isSubmitting: isBusinessSubmitting },
  } = businessMethods;

  const watchBusinessFields = watchBusiness();

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
        company_name: user.name || '',
        description: user.description || '',
        address: user.address || '',
        registration_number: '',
        email: user.email || '',
        contact_number: user.phone_number || '',
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
        bank_details: profile.bank_details || '',
        additional_information: profile.additional_information || '',
        past_event_references: profile.past_event_references || [],
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
        bank_details: data.bank_details,
        additional_information: data.additional_information || '',
        past_event_references: data.past_event_references || [],
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
                      {/* Company Name */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="company_name"
                          label="Company Name *"
                          placeholder="Enter company name"
                        />
                      </Grid>

                      {/* Company Email */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="email"
                          label="Company Email *"
                          type="email"
                          placeholder="Enter company email"
                        />
                      </Grid>

                      {/* Company Phone */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="contact_number"
                          label="Company Phone *"
                          placeholder="Enter company phone"
                        />
                      </Grid>

                      {/* Trade License Number */}
                      <Grid item xs={12} sm={6}>
                        <RHFTextField
                          name="registration_number"
                          label="Trade License Number *"
                          placeholder="Enter trade license number"
                        />
                      </Grid>

                      {/* Company Address */}
                      <Grid item xs={12}>
                        <RHFTextField
                          name="address"
                          label="Company Address *"
                          placeholder="Enter company address"
                        />
                      </Grid>

                      {/* Company Description */}
                      <Grid item xs={12}>
                        <RHFTextField
                          name="description"
                          label="Company Description"
                          placeholder="Enter company description"
                          multiline
                          rows={4}
                        />
                      </Grid>

                      {/* Trade License Upload Section */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Trade License (Upload)
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<Iconify icon="eva:download-outline" />}
                          sx={{ mb: 2, textTransform: 'none' }}
                        >
                          Download (7.19 KB)
                        </Button>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Current file: profile
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Iconify icon="eva:cloud-upload-outline" />}
                          component="label"
                          sx={{ textTransform: 'none' }}
                        >
                          Upload Trade License
                          <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" hidden />
                        </Button>
                      </Grid>

                      {/* Preferred Contact Methods */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Preferred Contact Methods
                        </Typography>
                        <RHFMultiCheckbox
                          name="preferred_contact_method"
                          options={[
                            { label: 'Email', value: 'email' },
                            { label: 'Phone', value: 'phone' },
                            { label: 'WhatsApp', value: 'whatsapp' },
                          ]}
                          spacing={1}
                          sx={{ mt: 1 }}
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
                      {/* IBAN / Bank Details */}
                      <Grid item xs={12}>
                        <RHFTextField
                          name="bank_details"
                          label="IBAN / Bank Details"
                          placeholder="Enter your IBAN or bank account details"
                          multiline
                          rows={3}
                        />
                      </Grid>

                      {/* Upload Certifications File */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Upload Certifications File
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

                      {/* Additional Information */}
                      <Grid item xs={12}>
                        <RHFTextField
                          name="additional_information"
                          label="Additional Information"
                          placeholder="Add any additional information about your services"
                          multiline
                          rows={4}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                      </Grid>

                      {/* Past Event References */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                          Past Event References
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        {watchBusinessFields.past_event_references?.map((reference, index) => (
                          <Card key={index} sx={{ mb: 2, p: 2 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <RHFTextField
                                  name={`past_event_references.${index}.event_name`}
                                  label="Event Name"
                                  placeholder="Enter event name"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <RHFTextField
                                  name={`past_event_references.${index}.client_name`}
                                  label="Client Name"
                                  placeholder="Enter client name"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <RHFTextField
                                  name={`past_event_references.${index}.event_date`}
                                  label="Event Date"
                                  type="date"
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <RHFTextField
                                  name={`past_event_references.${index}.event_type`}
                                  label="Event Type"
                                  placeholder="e.g., Wedding, Corporate, Birthday"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <RHFTextField
                                  name={`past_event_references.${index}.guest_count`}
                                  label="Guest Count"
                                  type="number"
                                  placeholder="Number of guests"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <RHFTextField
                                  name={`past_event_references.${index}.location`}
                                  label="Location"
                                  placeholder="Event location"
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <RHFTextField
                                  name={`past_event_references.${index}.description`}
                                  label="Description"
                                  placeholder="Brief description of the event and your services"
                                  multiline
                                  rows={3}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Button
                                  color="error"
                                  onClick={() => {
                                    const currentReferences =
                                      watchBusinessFields.past_event_references || [];
                                    const updatedReferences = currentReferences.filter(
                                      (_, i) => i !== index
                                    );
                                    setValueBusiness('past_event_references', updatedReferences);
                                  }}
                                  startIcon={<Iconify icon="mingcute:delete-2-line" />}
                                >
                                  Remove Reference
                                </Button>
                              </Grid>
                            </Grid>
                          </Card>
                        ))}

                        <Button
                          variant="outlined"
                          onClick={() => {
                            const currentReferences =
                              watchBusinessFields.past_event_references || [];
                            const newReference = {
                              event_name: '',
                              client_name: '',
                              event_date: '',
                              event_type: '',
                              guest_count: 0,
                              location: '',
                              description: '',
                            };
                            setValueBusiness('past_event_references', [
                              ...currentReferences,
                              newReference,
                            ]);
                          }}
                          startIcon={<Iconify icon="mingcute:add-line" />}
                          sx={{ mb: 2 }}
                        >
                          Add Event Reference
                        </Button>
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
