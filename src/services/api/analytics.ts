import { Analytics, DateRangeParams } from 'src/types/api';
import { api } from './base';

export const analyticsApi = {
  // Get dashboard analytics
  getDashboardAnalytics: async (params?: DateRangeParams): Promise<Analytics> =>
    api.get('/api/analytics/dashboard', { params }),

  // Get user analytics
  getUserAnalytics: async (params?: DateRangeParams): Promise<any> =>
    api.get('/api/analytics/users', { params }),

  // Get event analytics
  getEventAnalytics: async (params?: DateRangeParams): Promise<any> =>
    api.get('/api/analytics/events', { params }),

  // Get booking analytics
  getBookingAnalytics: async (params?: DateRangeParams): Promise<any> =>
    api.get('/api/analytics/bookings', { params }),

  // Get revenue analytics
  getRevenueAnalytics: async (params?: DateRangeParams): Promise<any> =>
    api.get('/api/analytics/revenue', { params }),

  // Get vendor analytics
  getVendorAnalytics: async (params?: DateRangeParams): Promise<any> =>
    api.get('/api/analytics/vendors', { params }),

  // Export analytics report
  exportAnalyticsReport: async (params?: DateRangeParams): Promise<Blob> =>
    api.get('/api/analytics/export', {
      params,
      responseType: 'blob',
    }),
};
