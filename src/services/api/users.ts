import {
  User,
  CreateUserData,
  UpdateUserData,
  PaginationParams,
  PaginatedResponse,
} from 'src/types/api';
import { api } from './base';

export const usersApi = {
  // Get paginated users list
  getUsers: async (params: PaginationParams): Promise<PaginatedResponse<User>> =>
    api.get('/api/users', { params }),

  // Get single user by ID
  getUser: async (id: string): Promise<User> => api.get(`/api/users/${id}`),

  // Create new user
  createUser: async (data: CreateUserData): Promise<User> => api.post('/api/users', data),

  // Update user
  updateUser: async (id: string, data: UpdateUserData): Promise<User> =>
    api.put(`/api/users/${id}`, data),

  // Delete user
  deleteUser: async (id: string): Promise<void> => api.delete(`/api/users/${id}`),

  // Update user status
  updateUserStatus: async (id: string, status: 'active' | 'inactive' | 'pending'): Promise<User> =>
    api.patch(`/api/users/${id}/status`, { status }),

  // Bulk delete users
  bulkDeleteUsers: async (ids: string[]): Promise<void> =>
    api.post('/api/users/bulk-delete', { ids }),

  // Export users
  exportUsers: async (params: PaginationParams): Promise<Blob> =>
    api.get('/api/users/export', {
      params,
      responseType: 'blob',
    }),
};
