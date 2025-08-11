import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { LoadingScreen } from "src/components/loading-screen";
import LoginPage from "src/pages/auth/login";
import AuthModernLayout from "src/layouts/auth/modern";

export const authRoutes = [
    {
      path: 'auth',
      element: (
        <AuthModernLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </AuthModernLayout>
      ),
      children: [
        { index: true, element: <LoginPage /> },
        { path: 'login', element: <LoginPage /> },
      ],
    },
  ];