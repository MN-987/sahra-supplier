import {
  Vendor,
  CreateVendorData,
  UpdateVendorData,
  PaginationParams,
  PaginatedResponse,
} from 'src/types/api';
import { api } from './base';

export const vendorsApi = {
  // Get paginated vendors list
  getVendors: async (params: PaginationParams): Promise<PaginatedResponse<Vendor>> =>
    api.get('/api/vendors', { params }),

  // Get single vendor by ID
  getVendor: async (id: string): Promise<Vendor> => api.get(`/api/vendors/${id}`),

  // Create new vendor
  createVendor: async (data: CreateVendorData): Promise<Vendor> => api.post('/api/vendors', data),

  // Update vendor
  updateVendor: async (id: string, data: UpdateVendorData): Promise<Vendor> =>
    api.put(`/api/vendors/${id}`, data),

  // Delete vendor
  deleteVendor: async (id: string): Promise<void> => api.delete(`/api/vendors/${id}`),

  // Update vendor status
  updateVendorStatus: async (
    id: string,
    status: 'active' | 'inactive' | 'pending'
  ): Promise<Vendor> => api.patch(`/api/vendors/${id}/status`, { status }),

  // Get vendors by category
  getVendorsByCategory: async (category: string): Promise<Vendor[]> =>
    api.get(`/api/vendors/category/${category}`),

  // Bulk delete vendors
  bulkDeleteVendors: async (ids: string[]): Promise<void> =>
    api.post('/api/vendors/bulk-delete', { ids }),

  // Export vendors
  exportVendors: async (params: PaginationParams): Promise<Blob> =>
    api.get('/api/vendors/export', {
      params,
      responseType: 'blob',
    }),
};
