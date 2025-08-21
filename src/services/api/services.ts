import { api } from './base';

// Types for service prices
export interface ServicePrice {
  price: number;
  type: number;
}

// Types for supplier services
export interface SupplierService {
  id: string;
  service_id: string;
  supplier_id: string;
  delivery_time_slots: string;
  prices: ServicePrice[];
}

export interface SupplierServicesRequest {
  services: SupplierService[];
}

export interface SupplierServicesResponse {
  data: SupplierService[];
  message: string;
  status: number;
}

export const servicesApi = {
  // Get supplier services
  getSupplierServices: async (): Promise<SupplierServicesResponse> =>
    api.get('/supplier/supplier-services?embed=prices'),

  // Create supplier services
  createSupplierServices: async (
    data: SupplierServicesRequest
  ): Promise<SupplierServicesResponse> => api.post('/supplier/supplier-services', data),

  // Update supplier services
  updateSupplierServices: async (
    data: SupplierServicesRequest
  ): Promise<SupplierServicesResponse> => api.put('/supplier/supplier-services', data),

  // Delete supplier services (all)
  deleteSupplierServices: async (): Promise<void> => api.delete('/supplier/supplier-services'),

  // Delete individual supplier service
  deleteSupplierService: async (id: string): Promise<void> =>
    api.delete(`/supplier/supplier-services/${id}`),
};
