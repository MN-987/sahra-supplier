import {
  Event,
  CreateEventData,
  UpdateEventData,
  PaginationParams,
  PaginatedResponse,
} from 'src/types/api';
import { api } from './base';

export const eventsApi = {
  // Get paginated events list
  getEvents: async (params: PaginationParams): Promise<PaginatedResponse<Event>> =>
    api.get('/api/events', { params }),

  // Get single event by ID
  getEvent: async (id: string): Promise<Event> => api.get(`/api/events/${id}`),

  // Create new event
  createEvent: async (data: CreateEventData): Promise<Event> => api.post('/api/events', data),

  // Update event
  updateEvent: async (id: string, data: UpdateEventData): Promise<Event> =>
    api.put(`/api/events/${id}`, data),

  // Delete event
  deleteEvent: async (id: string): Promise<void> => api.delete(`/api/events/${id}`),

  // Update event status
  updateEventStatus: async (
    id: string,
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  ): Promise<Event> => api.patch(`/api/events/${id}/status`, { status }),

  // Get events by status
  getEventsByStatus: async (status: string): Promise<Event[]> =>
    api.get(`/api/events/status/${status}`),

  // Get events by date range
  getEventsByDateRange: async (startDate: string, endDate: string): Promise<Event[]> =>
    api.get('/api/events/date-range', {
      params: { startDate, endDate },
    }),

  // Bulk delete events
  bulkDeleteEvents: async (ids: string[]): Promise<void> =>
    api.post('/api/events/bulk-delete', { ids }),

  // Export events
  exportEvents: async (params: PaginationParams): Promise<Blob> =>
    api.get('/api/events/export', {
      params,
      responseType: 'blob',
    }),
};
