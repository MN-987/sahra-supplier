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
  bank_details?: string;
  additional_information?: string;
  past_event_references?: {
    event_name: string;
    client_name: string;
    event_date: string;
    event_type: string;
    guest_count: number;
    location: string;
    description: string;
  }[];
  social_media_profiles?: SocialMediaProfiles;
}

// Types for API requests/responses
export interface BusinessProfileRequest {
  bank_details: string;
  additional_information: string;
  past_event_references: {
    event_name: string;
    client_name: string;
    event_date: string;
    event_type: string;
    guest_count: number;
    location: string;
    description: string;
  }[];
  social_media_profiles: SocialMediaProfiles;
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
