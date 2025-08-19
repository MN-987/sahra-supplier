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
const CreateEvent = lazy(() => import('src/pages/dashboard/CreateEvent'));
const Profile = lazy(() => import('src/pages/dashboard/Profile'));
const Services = lazy(() => import('src/pages/dashboard/Services'));
const CreateService = lazy(() => import('src/pages/dashboard/CreateService'));

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
          {
            path: 'user',
            element: <User />,
            children: [{ path: 'profile', element: <Profile /> }],
          },
          {
            path: 'services',
            children: [
              { element: <Services />, index: true },
              { path: 'create', element: <CreateService /> },
            ],
          },
          { path: 'vendor', element: <Vendor /> },
          {
            path: 'events',
            children: [
              { element: <Events />, index: true },
              { path: 'create', element: <CreateEvent /> },
            ],
          },
          { path: 'calender', element: <Calender /> },
        ],
      },
    ],
  },
];
