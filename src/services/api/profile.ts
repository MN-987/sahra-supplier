import { api } from './base';

// Types for social media profiles
export interface SocialMediaProfiles {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

// Types for business profile
export interface BusinessProfileItem {
  id: string;
  supplier_id: string;
  key: string;
  value: string | null;
}

export interface BusinessProfile {
  backup_emergency_options?: string;
  cancellation_policy?: string;
  deposit_requirements?: string;
  bank_details?: string;
  minimum_order_value_aed?: number;
  minimum_lead_time_days?: number;
  repeat_rate?: string;
  social_media_profiles?: SocialMediaProfiles;
  setup_teardown_time?: string;
  any_other_information?: string;
  licenses_and_certifications?: string;
}

// Types for API requests/responses
export interface BusinessProfileRequest {
  repeat_rate: string;
  backup_emergency_options: string;
  cancellation_policy: string;
  deposit_requirements: string;
  bank_details: string;
  minimum_order_value_aed: number;
  minimum_lead_time_days: number;
  social_media_profiles: SocialMediaProfiles;
  setup_teardown_time: string;
  any_other_information: string;
}

export interface BusinessProfileResponse {
  data: {
    business_info: BusinessProfileItem[];
  };
  message: string;
  status: number;
}

export const profileApi = {
  // Get business profile information
  getBusinessProfile: async (): Promise<BusinessProfileResponse> =>
    api.get('/supplier/profile/get-business-info'),

  // Update business profile information
  updateBusinessProfile: async (data: BusinessProfileRequest): Promise<BusinessProfileResponse> =>
    api.post('/supplier/profile/update-business-info', data),
};
