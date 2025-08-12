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
    api.post('/supplier/login', credentials),

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> =>
    api.post('/supplier/register', data),

  // Logout
  logout: async (): Promise<void> => api.post('/supplier/logout'),

  // Get current user
  getCurrentUser: async (): Promise<AuthUser> => api.get('/supplier/me'),

  // Refresh token - TODO: Re-enable when API returns separate access_token and refresh_token
  // Currently API returns single 'token' field, but will change to separate tokens later
  // refreshToken: async (refreshToken: string): Promise<AuthResponse> =>
  //   api.post('/supplier/refresh', { refreshToken }),

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData): Promise<void> =>
    api.post('/supplier/forgot-password', data),

  // Reset password
  resetPassword: async (data: ResetPasswordData): Promise<void> =>
    api.post('/supplier/reset-password', data),

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<void> =>
    api.post('/supplier/change-password', data),

  // Verify email
  verifyEmail: async (token: string): Promise<void> =>
    api.post('/supplier/verify-email', { token }),

  // Resend verification email
  resendVerificationEmail: async (): Promise<void> => api.post('/supplier/resend-verification'),
};
