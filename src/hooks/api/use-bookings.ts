import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { bookingsApi } from 'src/services/api';
import { PaginationParams, Booking, CreateBookingData, UpdateBookingData } from 'src/types/api';

// Query Keys
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...bookingKeys.lists(), params] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
  user: (userId: string) => [...bookingKeys.all, 'user', userId] as const,
  event: (eventId: string) => [...bookingKeys.all, 'event', eventId] as const,
  status: (status: string) => [...bookingKeys.all, 'status', status] as const,
};

// Queries
export const useBookings = (params: PaginationParams) =>
  useQuery({
    queryKey: bookingKeys.list(params),
    queryFn: () => bookingsApi.getBookings(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useBooking = (id: string) =>
  useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingsApi.getBooking(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useBookingsByUser = (userId: string) =>
  useQuery({
    queryKey: bookingKeys.user(userId),
    queryFn: () => bookingsApi.getBookingsByUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

export const useBookingsByEvent = (eventId: string) =>
  useQuery({
    queryKey: bookingKeys.event(eventId),
    queryFn: () => bookingsApi.getBookingsByEvent(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });

export const useBookingsByStatus = (status: string) =>
  useQuery({
    queryKey: bookingKeys.status(status),
    queryFn: () => bookingsApi.getBookingsByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
  });

// Mutations
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingData) => bookingsApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      toast.success('Booking created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create booking');
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingData }) =>
      bookingsApi.updateBooking(id, data),
    onSuccess: (updatedBooking: Booking) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.setQueryData(bookingKeys.detail(updatedBooking.id), updatedBooking);
      toast.success('Booking updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update booking');
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingsApi.deleteBooking(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.removeQueries({ queryKey: bookingKeys.detail(deletedId) });
      toast.success('Booking deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete booking');
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    }) => bookingsApi.updateBookingStatus(id, status),
    onSuccess: (updatedBooking: Booking) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.setQueryData(bookingKeys.detail(updatedBooking.id), updatedBooking);
      toast.success('Booking status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update booking status');
    },
  });
};

export const useBulkUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) =>
      bookingsApi.bulkUpdateBookingStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      toast.success('Booking statuses updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update booking statuses');
    },
  });
};
