import {
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
} from 'src/types/api';
import { api } from './base';

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> =>
    api.post('/api/auth/login', credentials),

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> =>
    api.post('/api/auth/register', data),

  // Logout
  logout: async (): Promise<void> => api.post('/api/auth/logout'),

  // Get current user
  getCurrentUser: async (): Promise<AuthUser> => api.get('/api/auth/me'),

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> =>
    api.post('/api/auth/refresh', { refreshToken }),

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData): Promise<void> =>
    api.post('/api/auth/forgot-password', data),

  // Reset password
  resetPassword: async (data: ResetPasswordData): Promise<void> =>
    api.post('/api/auth/reset-password', data),

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<void> =>
    api.post('/api/auth/change-password', data),

  // Verify email
  verifyEmail: async (token: string): Promise<void> =>
    api.post('/api/auth/verify-email', { token }),

  // Resend verification email
  resendVerificationEmail: async (): Promise<void> => api.post('/api/auth/resend-verification'),
};
