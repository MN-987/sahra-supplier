import { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import { useDashboardAnalytics } from 'src/hooks/api';
import { DateRangeParams } from 'src/types/api';

// ----------------------------------------------------------------------

export default function AnalyticsView() {
  const [dateRange, setDateRange] = useState<DateRangeParams>({});

  const { data: analytics, isLoading, error, refetch } = useDashboardAnalytics(dateRange);

  const handleDateRangeChange = (period: string) => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        setDateRange({});
        return;
    }

    setDateRange({
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
    });
  };

  if (error) {
    return (
      <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
        {error.message}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select value="" label="Period" onChange={(e) => handleDateRangeChange(e.target.value)}>
            <MenuItem value="">All Time</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
            <MenuItem value="1y">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">{analytics?.totalUsers?.toLocaleString() || 0}</Typography>
              <Typography variant="body2" color="textSecondary">
                {analytics?.userGrowth && analytics.userGrowth > 0 ? '+' : ''}
                {analytics?.userGrowth?.toFixed(1) || 0}% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Events
              </Typography>
              <Typography variant="h4">{analytics?.totalEvents?.toLocaleString() || 0}</Typography>
              <Typography variant="body2" color="textSecondary">
                {analytics?.eventGrowth && analytics.eventGrowth > 0 ? '+' : ''}
                {analytics?.eventGrowth?.toFixed(1) || 0}% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h4">
                {analytics?.totalBookings?.toLocaleString() || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">
                ${analytics?.totalRevenue?.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {analytics?.revenueGrowth && analytics.revenueGrowth > 0 ? '+' : ''}
                {analytics?.revenueGrowth?.toFixed(1) || 0}% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Events */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Events
              </Typography>
              {analytics?.topEvents?.map((event, index) => (
                <Box key={event.id} display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    {index + 1}. {event.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {event.bookings} bookings
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Vendors */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Vendors
              </Typography>
              {analytics?.topVendors?.map((vendor, index) => (
                <Box key={vendor.id} display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    {index + 1}. {vendor.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {vendor.events} events
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
