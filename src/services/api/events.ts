
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
  event_type_id: string;
  min_capacity: number;
  max_capacity: number;
}

export interface SupplierEventTypesRequest {
  event_types: SupplierEventType[];
}

export interface SupplierEventTypesResponse {
  event_types: SupplierEventType[];
}

export const eventsApi = {
  // Get available event types for selection
  getEventTypes: async (): Promise<EventTypesResponse> =>
    api.get('/supplier/event-types'),

  // Supplier Event Types CRUD operations
  // Get supplier event types
  getSupplierEventTypes: async (): Promise<SupplierEventTypesResponse> =>
    api.get('/supplier/supplier-event-types'),

  // Create supplier event types
  createSupplierEventTypes: async (data: SupplierEventTypesRequest): Promise<SupplierEventTypesResponse> =>
    api.post('/supplier/supplier-event-types', data),

  // Update supplier event types
  updateSupplierEventTypes: async (data: SupplierEventTypesRequest): Promise<SupplierEventTypesResponse> =>
    api.put('/supplier/supplier-event-types', data),

  // Delete supplier event types
  deleteSupplierEventTypes: async (): Promise<void> =>
    api.delete('/supplier/supplier-event-types'),
};
