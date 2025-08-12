import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import AuthGuard from 'src/auth/auth-guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import Calender from 'src/pages/dashboard/Calender';

// ----------------------------------------------------------------------

const Home = lazy(() => import('src/pages/dashboard/Home'));
const Analytics = lazy(() => import('src/pages/dashboard/Analytics'));
const User = lazy(() => import('src/pages/dashboard/User'));
const Vendor = lazy(() => import('src/pages/dashboard/Vendor'));
const Booking = lazy(() => import('src/pages/dashboard/Booking'));
const Events = lazy(() => import('src/pages/dashboard/events'));
const UserProfile = lazy(() => import('src/sections/users/user-profile'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <Home />, index: true },
      { path: 'home', element: <Home /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'booking', element: <Booking /> },
      {
        path: 'management',
        children: [
          { element: <User />, index: true },
          { path: 'user', element: <User /> },
          { path: 'user/profile', element: <UserProfile /> },
          { path: 'vendor', element: <Vendor /> },
          { path: 'events', element: <Events /> },
          { path: 'calender', element: <Calender /> },

        ],
      },
    ],
  },

];
