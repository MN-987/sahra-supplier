import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { authApi } from 'src/services/api';
import {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
} from 'src/types/api';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Queries
export const useCurrentUser = () => {
  const hasToken = !!localStorage.getItem('accessToken');
  
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authApi.getCurrentUser(),
    staleTime: 10 * 60 * 1000, 
    gcTime: 15 * 60 * 1000,
    retry: false, // Don't retry on auth failures
    enabled: hasToken, // Only run query if there's a token
  });
};

// Mutations
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response) => {
      // Store token from the API response
      localStorage.setItem('accessToken', response.data.token);
      
      // TODO: When API changes to return separate tokens, update to:
      // localStorage.setItem('accessToken', response.data.access_token);
      // localStorage.setItem('refreshToken', response.data.refresh_token);

      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), response.data.user);

      // Don't show toast here to avoid timing issues - let the component handle success feedback
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (response) => {
      // Store token from the API response
      localStorage.setItem('accessToken', response.data.token);
      
      // TODO: When API changes to return separate tokens, update to:
      // localStorage.setItem('accessToken', response.data.access_token);
      // localStorage.setItem('refreshToken', response.data.refresh_token);

      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), response.data.user);

      toast.success('Registration successful');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear token
      localStorage.removeItem('accessToken');
      
      // TODO: When API changes to return separate tokens, also clear:
      // localStorage.removeItem('refreshToken');

      // Clear all queries
      queryClient.clear();

      // Don't show toast here to avoid timing issues - let the component handle success feedback
    },
    onError: (error: Error) => {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('accessToken');
      // TODO: When API changes to return separate tokens, also clear:
      // localStorage.removeItem('refreshToken');
      
      queryClient.clear();

      // Don't show error toast - let the component handle it
      console.error('Logout error:', error);
    },
  });
};

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (data: ForgotPasswordData) => authApi.forgotPassword(data),
    onSuccess: () => {
      toast.success('Reset password email sent successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (data: ResetPasswordData) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });

export const useChangePassword = () =>
  useMutation({
    mutationFn: (data: ChangePasswordData) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });

export const useVerifyEmail = () =>
  useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verified successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to verify email');
    },
  });

export const useResendVerificationEmail = () =>
  useMutation({
    mutationFn: () => authApi.resendVerificationEmail(),
    onSuccess: () => {
      toast.success('Verification email sent successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send verification email');
    },
  });
