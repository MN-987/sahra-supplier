import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { profileApi, BusinessProfileRequest } from 'src/services/api/profile';

// Query keys
export const businessProfileKeys = {
  all: ['businessProfile'] as const,
  detail: () => [...businessProfileKeys.all, 'detail'] as const,
};

// Get business profile
export const useBusinessProfile = () =>
  useQuery({
    queryKey: businessProfileKeys.detail(),
    queryFn: () => profileApi.getBusinessProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

// Update business profile
export const useUpdateBusinessProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BusinessProfileRequest) => profileApi.updateBusinessProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessProfileKeys.all });
      toast.success('Business profile updated successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to update business profile:', error);
      toast.error(error?.response?.data?.message || 'Failed to update business profile');
    },
  });
};
