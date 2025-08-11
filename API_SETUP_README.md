# API Management with React Query Setup

This document explains how to use the API management system implemented with TanStack Query (React Query) in your dashboard application.

## 🚀 Overview

The API system provides:

- **Type-safe API calls** with TypeScript
- **Automatic caching** and background updates
- **Error handling** with toast notifications
- **Loading states** management
- **Optimistic updates** for better UX
- **Retry logic** for failed requests

## 📁 Project Structure

```
src/
├── services/api/          # API service functions
│   ├── base.ts           # Axios configuration & interceptors
│   ├── users.ts          # User-related API calls
│   ├── vendors.ts        # Vendor-related API calls
│   ├── events.ts         # Event-related API calls
│   ├── bookings.ts       # Booking-related API calls
│   ├── analytics.ts      # Analytics API calls
│   ├── auth.ts           # Authentication API calls
│   └── index.ts          # API exports
├── hooks/api/             # React Query hooks
│   ├── use-users.ts      # User management hooks
│   ├── use-vendors.ts    # Vendor management hooks
│   ├── use-events.ts     # Event management hooks
│   ├── use-bookings.ts   # Booking management hooks
│   ├── use-analytics.ts  # Analytics hooks
│   ├── use-auth.ts       # Authentication hooks
│   └── index.ts          # Hook exports
├── types/api/             # TypeScript types
│   ├── common.ts         # Common types (pagination, etc.)
│   ├── user.ts           # User-related types
│   ├── vendor.ts         # Vendor-related types
│   ├── event.ts          # Event-related types
│   ├── booking.ts        # Booking-related types
│   ├── analytics.ts      # Analytics types
│   ├── auth.ts           # Authentication types
│   └── index.ts          # Type exports
└── providers/
    └── query-provider.tsx # React Query provider setup
```

## 🔧 Setup

### 1. Dependencies Installed

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools sonner
```

### 2. Provider Setup

The `QueryProvider` is already configured in `src/main.tsx`:

```tsx
import { QueryProvider } from './providers';

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <QueryProvider>
        <Suspense>
          <App />
        </Suspense>
      </QueryProvider>
    </BrowserRouter>
  </HelmetProvider>
);
```

## 📚 Usage Examples

### Basic Data Fetching

```tsx
import { useUsers } from 'src/hooks/api';

function UsersList() {
  const { data, isLoading, error } = useUsers({
    page: 1,
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.data.map((user) => <div key={user.id}>{user.name}</div>)}</div>;
}
```

### Creating Data

```tsx
import { useCreateUser } from 'src/hooks/api';

function CreateUserForm() {
  const createUser = useCreateUser();

  const handleSubmit = async (formData) => {
    try {
      await createUser.mutateAsync(formData);
      // Success toast will be shown automatically
    } catch (error) {
      // Error toast will be shown automatically
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

### Updating Data

```tsx
import { useUpdateUser } from 'src/hooks/api';

function EditUserForm({ userId, initialData }) {
  const updateUser = useUpdateUser();

  const handleUpdate = async (formData) => {
    try {
      await updateUser.mutateAsync({
        id: userId,
        data: formData,
      });
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  // Form implementation...
}
```

### Pagination

```tsx
import { useState } from 'react';
import { useUsers } from 'src/hooks/api';

function PaginatedUsersList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useUsers({
    page,
    limit: 10,
    search,
  });

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
      />

      {/* Users list */}
      {data?.data.map((user) => <div key={user.id}>{user.name}</div>)}

      {/* Pagination */}
      <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>
        Page {page} of {data?.totalPages}
      </span>
      <button onClick={() => setPage((p) => p + 1)} disabled={page === data?.totalPages}>
        Next
      </button>
    </div>
  );
}
```

## 🔑 Available Hooks

### Users

- `useUsers(params)` - Get paginated users
- `useUser(id)` - Get single user
- `useCreateUser()` - Create new user
- `useUpdateUser()` - Update user
- `useDeleteUser()` - Delete user
- `useUpdateUserStatus()` - Update user status
- `useBulkDeleteUsers()` - Delete multiple users

### Vendors

- `useVendors(params)` - Get paginated vendors
- `useVendor(id)` - Get single vendor
- `useVendorsByCategory(category)` - Get vendors by category
- `useCreateVendor()` - Create new vendor
- `useUpdateVendor()` - Update vendor
- `useDeleteVendor()` - Delete vendor
- `useUpdateVendorStatus()` - Update vendor status
- `useBulkDeleteVendors()` - Delete multiple vendors

### Events

- `useEvents(params)` - Get paginated events
- `useEvent(id)` - Get single event
- `useEventsByStatus(status)` - Get events by status
- `useEventsByDateRange(start, end)` - Get events by date range
- `useCreateEvent()` - Create new event
- `useUpdateEvent()` - Update event
- `useDeleteEvent()` - Delete event
- `useUpdateEventStatus()` - Update event status
- `useBulkDeleteEvents()` - Delete multiple events

### Bookings

- `useBookings(params)` - Get paginated bookings
- `useBooking(id)` - Get single booking
- `useBookingsByUser(userId)` - Get bookings by user
- `useBookingsByEvent(eventId)` - Get bookings by event
- `useBookingsByStatus(status)` - Get bookings by status
- `useCreateBooking()` - Create new booking
- `useUpdateBooking()` - Update booking
- `useDeleteBooking()` - Delete booking
- `useUpdateBookingStatus()` - Update booking status
- `useBulkUpdateBookingStatus()` - Update multiple booking statuses

### Analytics

- `useDashboardAnalytics(dateRange?)` - Get dashboard analytics
- `useUserAnalytics(dateRange?)` - Get user analytics
- `useEventAnalytics(dateRange?)` - Get event analytics
- `useBookingAnalytics(dateRange?)` - Get booking analytics
- `useRevenueAnalytics(dateRange?)` - Get revenue analytics
- `useVendorAnalytics(dateRange?)` - Get vendor analytics

### Authentication

- `useCurrentUser()` - Get current user
- `useLogin()` - Login user
- `useRegister()` - Register user
- `useLogout()` - Logout user
- `useForgotPassword()` - Send forgot password email
- `useResetPassword()` - Reset password
- `useChangePassword()` - Change password
- `useVerifyEmail()` - Verify email
- `useResendVerificationEmail()` - Resend verification email

## ⚙️ Configuration

### Environment Variables

Set your API base URL in `.env`:

```
VITE_HOST_API=http://localhost:3001
```

### Error Handling

Errors are automatically handled with toast notifications using Sonner. You can customize error handling in `src/services/api/base.ts`.

### Authentication

The API client automatically includes the JWT token from localStorage in requests. On 401 errors, it automatically redirects to the login page.

## 🎯 Best Practices

1. **Use TypeScript types** for all API calls
2. **Handle loading states** in your components
3. **Use optimistic updates** for better UX
4. **Implement proper error boundaries**
5. **Cache invalidation** is handled automatically
6. **Use pagination** for large datasets
7. **Debounce search inputs** to avoid excessive API calls

## 🔧 Customization

To add new entities:

1. **Create types** in `src/types/api/`
2. **Create API service** in `src/services/api/`
3. **Create hooks** in `src/hooks/api/`
4. **Use in components** with proper error handling

## 📱 Example Components

Check these example components to see the API system in action:

- `src/sections/users/user-list-view.tsx`
- `src/sections/vendors/vendor-list-view.tsx`
- `src/sections/analytics/analytics-view.tsx`

## 🔍 Development Tools

React Query DevTools are enabled in development mode. Access them via the floating dev tools panel in the bottom-right corner of your browser.

---

This setup provides a robust, scalable API management solution for your dashboard application with excellent developer experience and user experience.
