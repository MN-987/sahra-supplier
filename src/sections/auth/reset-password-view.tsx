import React, { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useLocation } from 'react-router-dom';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
// hooks
import { useResetPassword } from 'src/hooks/api/use-auth';
// components
import FormProvider from '../../components/hook-form/form-provider';
import RHFTextField from '../../components/hook-form/rhf-text-field';
import Iconify from '../../components/iconify';
import FormErrorAlert from '../../components/form-error-alert';
// routes
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function ResetPasswordView() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const resetPassword = useResetPassword();

  const { email, requireReset } = location.state || {};

  const ResetPasswordSchema = Yup.object().shape({
    current_password: Yup.string().required('Current password is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required'),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Password confirmation is required'),
  });

  const defaultValues = {
    current_password: '',
    password: '',
    password_confirmation: '',
  };

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await resetPassword.mutateAsync(data);
      // On success, navigate to login page
      navigate(paths.auth.login, {
        replace: true,
        state: {
          message: 'Password reset successfully! Please login with your new password.',
        },
      });
    } catch (error) {
      console.error('Reset password error:', error);
      // Error is already handled by the mutation's onError callback
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h2">
        <span style={{ color: '#EF4523' }}>Reset</span> Password
      </Typography>

      {requireReset && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You must reset your password before accessing the dashboard.
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary">
        {email && `Updating password for: ${email}`}
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField
        name="current_password"
        label="Current Password"
        type={showCurrentPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                <Iconify icon={showCurrentPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <RHFTextField
        name="password"
        label="New Password"
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <RHFTextField
        name="password_confirmation"
        label="Confirm New Password"
        type={showConfirmPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                <Iconify icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {/* Display backend errors */}
      <FormErrorAlert error={resetPassword.error?.message} />
      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || resetPassword.isPending}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{
          justifyContent: 'space-between',
          pl: 2,
          pr: 1.5,
          '&.Mui-focusVisible': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
          '&:hover': {
            backgroundColor: 'transparent',
            borderColor: 'primary.main',
            borderWidth: 2,
            color: 'primary.main',
            '& .MuiLoadingButton-endIcon': {
              color: 'primary.main',
            },
          },
        }}
      >
        Reset Password
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}
      {renderForm}
    </FormProvider>
  );
}
