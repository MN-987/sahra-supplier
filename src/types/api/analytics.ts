export interface Analytics {
  totalUsers: number;
  totalVendors: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  revenueGrowth: number;
  userGrowth: number;
  eventGrowth: number;
  monthlyData: {
    month: string;
    users: number;
    events: number;
    bookings: number;
    revenue: number;
  }[];
  topEvents: {
    id: string;
    title: string;
    bookings: number;
    revenue: number;
  }[];
  topVendors: {
    id: string;
    name: string;
    events: number;
    revenue: number;
  }[];
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}
