import { api } from './base';

// Types for event types (available options)
export interface EventType {
  id: string;
  name: string;
  description?: string;
}

export interface EventTypesResponse {
  data: {
    event_types: EventType[];
  };
}

// Types for supplier event types
export interface SupplierEventType {
  id: string;
  event_type_id: string;
  supplier_id: string;
  min_capacity: number;
  max_capacity: number;
}

// Types for creating supplier event types (without id and supplier_id)
export interface SupplierEventTypeCreate {
  event_type_id: string;
  supplier_id: string;
  min_capacity: number;
  max_capacity: number;
}

export interface SupplierEventTypesRequest {
  event_types: SupplierEventType[];
}

export interface SupplierEventTypesCreateRequest {
  event_types: SupplierEventTypeCreate[];
}

export interface SupplierEventTypesResponse {
  data: SupplierEventType[];
  message: string;
  status: number;
}

export const eventsApi = {
  // Get available event types for selection
  getEventTypes: async (): Promise<EventTypesResponse> => api.get('/supplier/event-types'),

  // Supplier Event Types CRUD operations
  // Get supplier event types
  getSupplierEventTypes: async (): Promise<SupplierEventTypesResponse> =>
    api.get('/supplier/supplier-event-types'),

  // Create supplier event types
  createSupplierEventTypes: async (
    data: SupplierEventTypesCreateRequest

  ): Promise<SupplierEventTypesResponse> => api.post('/supplier/supplier-event-types', data),

  // Update supplier event types
  updateSupplierEventTypes: async (
    data: SupplierEventTypesRequest
  ): Promise<SupplierEventTypesResponse> => api.put('/supplier/supplier-event-types', data),

  // Delete supplier event types (all)
  deleteSupplierEventTypes: async (): Promise<void> => api.delete('/supplier/supplier-event-types'),

  // Delete individual supplier event type
  deleteSupplierEventType: async (id: string): Promise<void> =>
    api.delete(`/supplier/supplier-event-types/${id}`),
};
