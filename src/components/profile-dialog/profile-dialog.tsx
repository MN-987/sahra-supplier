import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
// @mui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  Box,
  Avatar,
  Typography,
  Stack,
  IconButton,
  MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { useCurrentUser } from 'src/hooks/api/use-auth';
// components
import FormProvider from '../hook-form/form-provider';
import { RHFTextField } from '../hook-form';
import { RHFSelect } from '../hook-form/rhf-select';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ProfileFormData {
  // Past Event References (upload - will handle as text for now)
  pastEventReferences?: string | null;

  // Service Areas Covered (dropdown)
  serviceAreasCovered?: string | null;

  // Company Details
  companyName: string;
  description?: string | null;
  location?: string | null;
  address?: string | null;
  registrationNumber?: string | null;

  // Contact Information
  email: string;
  contactNumber?: string | null;
  contactName: string;

  // Preferred Contact Method (dropdown)
  preferredContactMethod?: string | null;
}

// Service areas options for UAE
const SERVICE_AREAS = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ras Al Khaimah',
  'Ajman',
  'Umm Al Quwain',
  'Fujeirah',
];

// Contact method options
const CONTACT_METHODS = ['whatsapp', 'call', 'email'];

const ProfileSchema = Yup.object().shape({
  pastEventReferences: Yup.string().nullable(),
  serviceAreasCovered: Yup.string().nullable(),
  companyName: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  description: Yup.string().nullable(),
  location: Yup.string().nullable(),
  address: Yup.string().nullable(),
  registrationNumber: Yup.string()
    .nullable()
    .matches(/^[0-9]*$/, 'Registration number must contain only numbers'),
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  contactNumber: Yup.string()
    .nullable()
    .matches(/^[+]?[1-9][\d\-\s()]*$/, 'Contact number is not valid'),
  contactName: Yup.string()
    .required('Contact name is required')
    .min(2, 'Contact name must be at least 2 characters'),
  preferredContactMethod: Yup.string().nullable(),
});

export default function ProfileDialog({ open, onClose }: ProfileDialogProps) {
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const defaultValues: ProfileFormData = {
    pastEventReferences: '',
    serviceAreasCovered: '',
    companyName: '',
    description: '',
    location: '',
    address: '',
    registrationNumber: '',
    email: '',
    contactNumber: '',
    contactName: '',
    preferredContactMethod: '',
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
        pastEventReferences: '',
        serviceAreasCovered: '',
        companyName: user.name || '', // Use user name as company name initially
        description: user.description || '',
        location: '',
        address: user.address || '',
        registrationNumber: '',
        email: user.email || '',
        contactNumber: user.phone_number || '',
        contactName: user.name || '',
        preferredContactMethod: '',
      });
    }
  }, [user, reset]);

  const onSubmit = handleSubmit(async (data: ProfileFormData) => {
    try {
      // TODO: Implement profile update API call
      console.log('Profile data to save:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success toast
      toast.success('Profile updated successfully!');

      // Close dialog on success
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  });

  const handleClose = () => {
    reset(); // Reset form to original values
    onClose();
  };

  if (userLoading) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Edit Profile</Typography>
          <IconButton onClick={handleClose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Profile Avatar Section */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Box sx={{ position: 'relative', mb: 2 }}>
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
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'background.paper',
                      border: '2px solid',
                      borderColor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                    size="small"
                  >
                    <Iconify icon="solar:camera-bold" width={16} />
                  </IconButton>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {user?.name || user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supplier Account
                </Typography>
              </Box>
            </Grid>

            {/* Form Fields */}

            {/* Past Event References */}
            <Grid item xs={12}>
              <RHFTextField
                name="pastEventReferences"
                label="Past Event References"
                placeholder="Upload or describe your past event references"
                multiline
                rows={3}
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>📁</Box>,
                }}
              />
            </Grid>

            {/* Service Areas Covered */}
            <Grid item xs={12} sm={6}>
              <RHFSelect
                name="serviceAreasCovered"
                label="Service Areas Covered"
                placeholder="Select service area"
              >
                {SERVICE_AREAS.map((area) => (
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>

            {/* Company Name */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="companyName"
                label="Company Name"
                placeholder="Enter your company name"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>🏢</Box>,
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <RHFTextField
                name="description"
                label="Description"
                placeholder="Describe your company and services"
                multiline
                rows={4}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="location"
                label="Location"
                placeholder="Enter your location"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>📍</Box>,
                }}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="address"
                label="Address"
                placeholder="Enter your address"
                multiline
                rows={2}
              />
            </Grid>

            {/* Registration Number */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="registrationNumber"
                label="Registration Number"
                type="number"
                placeholder="Enter registration number"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>🆔</Box>,
                }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email address"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>✉️</Box>,
                }}
              />
            </Grid>

            {/* Contact Number */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="contactNumber"
                label="Contact Number"
                type="number"
                placeholder="Enter contact number"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>📞</Box>,
                }}
              />
            </Grid>

            {/* Contact Name */}
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="contactName"
                label="Contact Name"
                placeholder="Enter contact person name"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>👤</Box>,
                }}
              />
            </Grid>

            {/* Preferred Contact Method */}
            <Grid item xs={12}>
              <RHFSelect
                name="preferredContactMethod"
                label="Preferred Contact Method"
                placeholder="Select preferred contact method"
              >
                {CONTACT_METHODS.map((method) => (
                  <MenuItem key={method} value={method}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {method === 'whatsapp' && '💬'}
                      {method === 'call' && '📞'}
                      {method === 'email' && '✉️'}
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </Box>
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button variant="outlined" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
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
