import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { LoadingScreen } from "src/components/loading-screen";
import LoginPage from "src/pages/auth/login";
import ResetPasswordPage from "src/pages/auth/reset-password";
import AuthModernLayout from "src/layouts/auth/modern";
import GuestGuard from "src/auth/guest-guard";

export const authRoutes = [
    {
      path: 'auth',
      element: (
        <GuestGuard>
          <AuthModernLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </AuthModernLayout>
        </GuestGuard>
      ),
      children: [
        { index: true, element: <LoginPage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'reset-password', element: <ResetPasswordPage /> },
      ],
    },
  ];