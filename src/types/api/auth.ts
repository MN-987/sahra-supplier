export interface AuthUser {
  id: string;
  name: string;
  description?: string;
  address?: string;
  email: string;
  phone_number?: string;
  need_to_reset: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  //    accessToken: string;
  // refreshToken: string;
  };
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
