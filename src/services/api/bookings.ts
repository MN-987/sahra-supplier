import {
  Booking,
  CreateBookingData,
  UpdateBookingData,
  PaginationParams,
  PaginatedResponse,
} from 'src/types/api';
import { api } from './base';

export const bookingsApi = {
  // Get paginated bookings list
  getBookings: async (params: PaginationParams): Promise<PaginatedResponse<Booking>> =>
    api.get('/api/bookings', { params }),

  // Get single booking by ID
  getBooking: async (id: string): Promise<Booking> => api.get(`/api/bookings/${id}`),

  // Create new booking
  createBooking: async (data: CreateBookingData): Promise<Booking> =>
    api.post('/api/bookings', data),

  // Update booking
  updateBooking: async (id: string, data: UpdateBookingData): Promise<Booking> =>
    api.put(`/api/bookings/${id}`, data),

  // Delete booking
  deleteBooking: async (id: string): Promise<void> => api.delete(`/api/bookings/${id}`),

  // Update booking status
  updateBookingStatus: async (
    id: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ): Promise<Booking> => api.patch(`/api/bookings/${id}/status`, { status }),

  // Get bookings by user
  getBookingsByUser: async (userId: string): Promise<Booking[]> =>
    api.get(`/api/bookings/user/${userId}`),

  // Get bookings by event
  getBookingsByEvent: async (eventId: string): Promise<Booking[]> =>
    api.get(`/api/bookings/event/${eventId}`),

  // Get bookings by status
  getBookingsByStatus: async (status: string): Promise<Booking[]> =>
    api.get(`/api/bookings/status/${status}`),

  // Bulk update booking status
  bulkUpdateBookingStatus: async (ids: string[], status: string): Promise<void> =>
    api.post('/api/bookings/bulk-update-status', { ids, status }),

  // Export bookings
  exportBookings: async (params: PaginationParams): Promise<Blob> =>
    api.get('/api/bookings/export', {
      params,
      responseType: 'blob',
    }),
};
