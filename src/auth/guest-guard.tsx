import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useCurrentUser } from 'src/hooks/api/use-auth';

import { LoadingScreen } from 'src/components/loading-screen';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = useState(false);
  
  const { data: user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    
    const timer = setTimeout(() => {
      const hasToken = !!localStorage.getItem('accessToken');
      
      // TODO: When API changes to return separate tokens, also check:
      // const hasRefreshToken = !!localStorage.getItem('refreshToken');
      
      // If no token, user is guest - allow access
      if (!hasToken) {
        setChecked(true);
        return;
      }

      // If we have a token but query failed, clear token and allow access
      if (error) {
        localStorage.removeItem('accessToken');
        // TODO: When API changes to return separate tokens, also clear:
        // localStorage.removeItem('refreshToken');
        setChecked(true);
        return;
      }

      // If loading, wait
      if (isLoading) {
        return;
      }

      // If user is loaded
      if (user) {
        // If we're on the reset password page and user needs to reset, allow access
        if (location.pathname === paths.auth.resetPassword && user.need_to_reset) {
          setChecked(true);
          return;
        }
        
  
        if (user.need_to_reset) {
          navigate(paths.auth.resetPassword, {
            state: {
              email: user.email,
              requireReset: true
            },
            replace: true 
          });
        } else {
          navigate(paths.dashboard.root, { replace: true });
        }
        return;
      }

      // If we have a token but no user data and not loading, clear token
      if (hasToken && !user && !isLoading) {
        localStorage.removeItem('accessToken');
        // TODO: When API changes to return separate tokens, also clear:
        // localStorage.removeItem('refreshToken');
        setChecked(true);
      }
    }, 100); 

    return () => clearTimeout(timer);
  }, [user, isLoading, error, navigate, location.pathname]);

 
  if (!checked) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
