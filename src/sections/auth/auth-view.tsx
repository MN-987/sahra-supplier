import React, { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useLocation } from 'react-router-dom';
// @mui
import { paths } from 'src/routes/paths';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
// hooks
import { useLogin } from 'src/hooks/api/use-auth';
// components
import FormProvider from '../../components/hook-form/form-provider';
import RHFTextField from '../../components/hook-form/rhf-text-field';
import Iconify from '../../components/iconify';
import RouterLink from '../../routes/components/router-link';
import FormErrorAlert from '../../components/form-error-alert';

// routes


// ----------------------------------------------------------------------

export default function LoginView() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  const successMessage = location.state?.message;

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await login.mutateAsync(data);

      // Check if user needs to reset password
      if (response.data.user.need_to_reset) {
        navigate(paths.auth.resetPassword, {
          state: {
            email: data.email,
            requireReset: true,
          },
          replace: true,
        });
      } else {
        navigate(paths.dashboard.root, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled by the mutation's onError
    }
  });

  const renderHead = (
    <Stack spacing={3} sx={{ mb: 2 }}>
      <Typography variant="h2">
        <span style={{ color: '#EF4523', fontStyle: '' }}>Sahra</span> Dashboard
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      {/* Display success message from password reset */}
      {successMessage && (
        <Alert
          severity="success"
          variant="filled"
          sx={{
            mb: 2,
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: 24 },
            background: 'linear-gradient(45deg, #4caf50 30%, #2e7d32 90%)',
          }}
        >
          {successMessage}
        </Alert>
      )}

      <RHFTextField
        name="email"
        label="Email address"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
          },
        }}
      />

      <RHFTextField
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
     
      <Link
        component={RouterLink}
        href=""
        variant="body2"
        color="primary"
        underline="hover"
        sx={{
          alignSelf: 'flex-end',
          fontWeight: 500,
          '&:hover': {
            color: 'primary.dark',
          },
        }}
      >
        Forgot password?
      </Link>
 {/* Display backend errors */}
      <FormErrorAlert error={login.error?.message} />
      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || login.isPending}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{
          justifyContent: 'space-between',
          pl: 3,
          pr: 2,
          py: 1.5,
          borderRadius: 2,
          background: 'linear-gradient(45deg, #EF4523 30%, #FF7A45 90%)',
          fontWeight: 600,
          fontSize: '1rem',
          textTransform: 'none',
          boxShadow: '0 4px 20px rgba(239, 69, 35, 0.4)',
          '&:hover': {
            background: 'linear-gradient(45deg, #D63A1E 30%, #FF6635 90%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 25px rgba(239, 69, 35, 0.6)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
          '&.Mui-focusVisible': {
            boxShadow: '0 4px 20px rgba(239, 69, 35, 0.4), 0 0 0 3px rgba(239, 69, 35, 0.2)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        Sign In
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
