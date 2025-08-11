import { useQuery } from '@tanstack/react-query';

import { analyticsApi } from 'src/services/api';
import { DateRangeParams } from 'src/types/api';

// Query Keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: (params?: DateRangeParams) => [...analyticsKeys.all, 'dashboard', params] as const,
  users: (params?: DateRangeParams) => [...analyticsKeys.all, 'users', params] as const,
  events: (params?: DateRangeParams) => [...analyticsKeys.all, 'events', params] as const,
  bookings: (params?: DateRangeParams) => [...analyticsKeys.all, 'bookings', params] as const,
  revenue: (params?: DateRangeParams) => [...analyticsKeys.all, 'revenue', params] as const,
  vendors: (params?: DateRangeParams) => [...analyticsKeys.all, 'vendors', params] as const,
};

// Queries
export const useDashboardAnalytics = (params?: DateRangeParams) =>
  useQuery({
    queryKey: analyticsKeys.dashboard(params),
    queryFn: () => analyticsApi.getDashboardAnalytics(params),
    staleTime: 2 * 60 * 1000, // 2 minutes for analytics
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

export const useUserAnalytics = (params?: DateRangeParams) =>
  useQuery({
    queryKey: analyticsKeys.users(params),
    queryFn: () => analyticsApi.getUserAnalytics(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export const useEventAnalytics = (params?: DateRangeParams) =>
  useQuery({
    queryKey: analyticsKeys.events(params),
    queryFn: () => analyticsApi.getEventAnalytics(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export const useBookingAnalytics = (params?: DateRangeParams) =>
  useQuery({
    queryKey: analyticsKeys.bookings(params),
    queryFn: () => analyticsApi.getBookingAnalytics(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export const useRevenueAnalytics = (params?: DateRangeParams) =>
  useQuery({
    queryKey: analyticsKeys.revenue(params),
    queryFn: () => analyticsApi.getRevenueAnalytics(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export const useVendorAnalytics = (params?: DateRangeParams) =>
  useQuery({
    queryKey: analyticsKeys.vendors(params),
    queryFn: () => analyticsApi.getVendorAnalytics(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
