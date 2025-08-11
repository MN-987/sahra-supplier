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
export const useCurrentUser = () =>
  useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authApi.getCurrentUser(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: false, // Don't retry on auth failures
  });

// Mutations
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response) => {
      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), response.user);

      toast.success('Login successful');
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
      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), response.user);

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
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Clear all queries
      queryClient.clear();

      toast.success('Logout successful');
    },
    onError: (error: Error) => {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();

      toast.error(error.message || 'Logout failed');
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
