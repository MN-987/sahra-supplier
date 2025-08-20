import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { eventsApi, SupplierEventTypesRequest } from 'src/services/api/events';

// Query keys
export const eventTypesKeys = {
  all: ['eventTypes'] as const,
  lists: () => [...eventTypesKeys.all, 'list'] as const,
};

export const supplierEventTypesKeys = {
  all: ['supplierEventTypes'] as const,
  lists: () => [...supplierEventTypesKeys.all, 'list'] as const,
  list: (filters: string) => [...supplierEventTypesKeys.lists(), { filters }] as const,
  details: () => [...supplierEventTypesKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierEventTypesKeys.details(), id] as const,
};

// Get available event types for selection
export const useEventTypes = () =>
  useQuery({
    queryKey: eventTypesKeys.lists(),
    queryFn: () => eventsApi.getEventTypes(),
    staleTime: 10 * 60 * 1000, // 10 minutes - event types don't change often
  });

// Get supplier event types
export const useSupplierEventTypes = () =>
  useQuery({
    queryKey: supplierEventTypesKeys.lists(),
    queryFn: () => eventsApi.getSupplierEventTypes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// Create supplier event types
export const useCreateSupplierEventTypes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupplierEventTypesRequest) => eventsApi.createSupplierEventTypes(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierEventTypesKeys.all });
      toast.success('Event types created successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to create event types:', error);
      toast.error(error?.response?.data?.message || 'Failed to create event types');
    },
  });
};

// Update supplier event types
export const useUpdateSupplierEventTypes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupplierEventTypesRequest) => eventsApi.updateSupplierEventTypes(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierEventTypesKeys.all });
      toast.success('Event types updated successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to update event types:', error);
      toast.error(error?.response?.data?.message || 'Failed to update event types');
    },
  });
};

// Delete supplier event types (all)
export const useDeleteSupplierEventTypes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => eventsApi.deleteSupplierEventTypes(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierEventTypesKeys.all });
      toast.success('Event types deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to delete event types:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete event types');
    },
  });
};

// Delete individual supplier event type
export const useDeleteSupplierEventType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.deleteSupplierEventType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierEventTypesKeys.all });
      toast.success('Event type deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to delete event type:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete event type');
    },
  });
};
