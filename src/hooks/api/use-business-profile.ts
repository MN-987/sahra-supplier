import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  profileApi,
  BusinessProfileRequest,
  BusinessProfileResponse,
  BusinessProfile,
} from 'src/services/api/profile';

// Query key factory
const businessProfileKeys = {
  all: ['business-profile'] as const,
  profile: () => [...businessProfileKeys.all, 'profile'] as const,
};

// Helper function to transform API response to BusinessProfile
const transformBusinessProfileData = (apiData: any): BusinessProfile => {
  const profile: BusinessProfile = {};

  if (apiData?.business_info) {
    apiData.business_info.forEach((item: any) => {
      switch (item.key) {
        case 'backup_emergency_options':
          profile.backup_emergency_options = item.value;
          break;
        case 'cancellation_policy':
          profile.cancellation_policy = item.value;
          break;
        case 'deposit_requirements':
          profile.deposit_requirements = item.value;
          break;
        case 'bank_details':
          profile.bank_details = item.value;
          break;
        case 'minimum_order_value_aed':
          profile.minimum_order_value_aed = item.value ? parseInt(item.value, 10) : 0;
          break;
        case 'minimum_lead_time_days':
          profile.minimum_lead_time_days = item.value ? parseInt(item.value, 10) : 0;
          break;
        case 'repeat_rate':
          profile.repeat_rate = item.value;
          break;
        case 'social_media_profiles':
          try {
            profile.social_media_profiles = item.value ? JSON.parse(item.value) : {};
          } catch {
            profile.social_media_profiles = {};
          }
          break;
        case 'setup_teardown_time':
          profile.setup_teardown_time = item.value;
          break;
        case 'any_other_information':
          profile.any_other_information = item.value;
          break;
        case 'licenses_and_certifications':
          profile.licenses_and_certifications = item.value;
          break;
        default:
          // Handle unknown keys
          break;
      }
    });
  }

  return profile;
};

// Get business profile - only when enabled
export function useBusinessProfile(enabled = true) {
  return useQuery({
    queryKey: businessProfileKeys.profile(),
    queryFn: async () => {
      const response = await profileApi.getBusinessProfile();
      return {
        ...response,
        data: transformBusinessProfileData(response.data),
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  });
}

// Update business profile
export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BusinessProfileRequest) => profileApi.updateBusinessProfile(data),
    onSuccess: (response: BusinessProfileResponse) => {
      // Invalidate and refetch business profile data
      queryClient.invalidateQueries({ queryKey: businessProfileKeys.all });

      toast.success(response.message || 'Business profile updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update business profile';
      toast.error(errorMessage);
    },
  });
}
