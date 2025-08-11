import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { vendorsApi } from 'src/services/api';
import { PaginationParams, Vendor, CreateVendorData, UpdateVendorData } from 'src/types/api';

// Query Keys
export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...vendorKeys.lists(), params] as const,
  details: () => [...vendorKeys.all, 'detail'] as const,
  detail: (id: string) => [...vendorKeys.details(), id] as const,
  categories: () => [...vendorKeys.all, 'categories'] as const,
  category: (category: string) => [...vendorKeys.categories(), category] as const,
};

// Queries
export const useVendors = (params: PaginationParams) =>
  useQuery({
    queryKey: vendorKeys.list(params),
    queryFn: () => vendorsApi.getVendors(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useVendor = (id: string) =>
  useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: () => vendorsApi.getVendor(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

export const useVendorsByCategory = (category: string) =>
  useQuery({
    queryKey: vendorKeys.category(category),
    queryFn: () => vendorsApi.getVendorsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });

// Mutations
export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVendorData) => vendorsApi.createVendor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      toast.success('Vendor created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create vendor');
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVendorData }) =>
      vendorsApi.updateVendor(id, data),
    onSuccess: (updatedVendor: Vendor) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.setQueryData(vendorKeys.detail(updatedVendor.id), updatedVendor);
      toast.success('Vendor updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update vendor');
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vendorsApi.deleteVendor(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.removeQueries({ queryKey: vendorKeys.detail(deletedId) });
      toast.success('Vendor deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete vendor');
    },
  });
};

export const useUpdateVendorStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' | 'pending' }) =>
      vendorsApi.updateVendorStatus(id, status),
    onSuccess: (updatedVendor: Vendor) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.setQueryData(vendorKeys.detail(updatedVendor.id), updatedVendor);
      toast.success('Vendor status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update vendor status');
    },
  });
};

export const useBulkDeleteVendors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => vendorsApi.bulkDeleteVendors(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      toast.success('Vendors deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete vendors');
    },
  });
};
