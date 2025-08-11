import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { eventsApi } from 'src/services/api';
import { PaginationParams, Event, CreateEventData, UpdateEventData } from 'src/types/api';

// Query Keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  statuses: () => [...eventKeys.all, 'statuses'] as const,
  status: (status: string) => [...eventKeys.statuses(), status] as const,
  dateRange: (start: string, end: string) => [...eventKeys.all, 'dateRange', start, end] as const,
};

// Queries
export const useEvents = (params: PaginationParams) =>
  useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventsApi.getEvents(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useEvent = (id: string) =>
  useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.getEvent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useEventsByStatus = (status: string) =>
  useQuery({
    queryKey: eventKeys.status(status),
    queryFn: () => eventsApi.getEventsByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
  });

export const useEventsByDateRange = (startDate: string, endDate: string) =>
  useQuery({
    queryKey: eventKeys.dateRange(startDate, endDate),
    queryFn: () => eventsApi.getEventsByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });

// Mutations
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventData) => eventsApi.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      toast.success('Event created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create event');
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventData }) =>
      eventsApi.updateEvent(id, data),
    onSuccess: (updatedEvent: Event) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent);
      toast.success('Event updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update event');
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.deleteEvent(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.removeQueries({ queryKey: eventKeys.detail(deletedId) });
      toast.success('Event deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });
};

export const useUpdateEventStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    }) => eventsApi.updateEventStatus(id, status),
    onSuccess: (updatedEvent: Event) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent);
      toast.success('Event status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update event status');
    },
  });
};

export const useBulkDeleteEvents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => eventsApi.bulkDeleteEvents(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      toast.success('Events deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete events');
    },
  });
};
