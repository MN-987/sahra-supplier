import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { servicesApi, SupplierServicesRequest } from 'src/services/api/services';

// Query keys
export const supplierServicesKeys = {
  all: ['supplierServices'] as const,
  lists: () => [...supplierServicesKeys.all, 'list'] as const,
};


// Separate key for service types to avoid cache collisions with supplier services
export const serviceTypesKeys = {
  all: ['serviceTypes'] as const,
  lists: () => [...serviceTypesKeys.all, 'list'] as const,
};

// Get supplier services
export const useSupplierServices = () =>
  useQuery({
    queryKey: supplierServicesKeys.lists(),
    queryFn: () => servicesApi.getSupplierServices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// Create supplier services
export const useCreateSupplierServices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupplierServicesRequest) => servicesApi.createSupplierServices(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierServicesKeys.all });
      toast.success('Services created successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to create services:', error);
      toast.error(error?.response?.data?.message || 'Failed to create services');
    },
  });
};

// Update supplier services
export const useUpdateSupplierServices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupplierServicesRequest) => servicesApi.updateSupplierServices(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierServicesKeys.all });
      toast.success('Services updated successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to update services:', error);
      toast.error(error?.response?.data?.message || 'Failed to update services');
    },
  });
};

// Delete supplier services (all)
export const useDeleteSupplierServices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => servicesApi.deleteSupplierServices(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierServicesKeys.all });
      toast.success('Services deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to delete services:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete services');
    },
  });
};

// Delete individual supplier service
export const useDeleteSupplierService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicesApi.deleteSupplierService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierServicesKeys.all });
      toast.success('Service deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to delete service:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete service');
    },
  });
};

export const useServicesTypes = () =>
  useQuery({
    queryKey: serviceTypesKeys.lists(),
    queryFn: () => servicesApi.getServiceTypes(),
    staleTime: 10 * 60 * 1000,
  });

