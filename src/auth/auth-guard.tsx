import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import LoginIcon from '@mui/icons-material/Login';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { useCurrentUser, useLogout } from 'src/hooks/api/use-auth';

import { LoadingScreen } from 'src/components/loading-screen';

import { paths } from 'src/routes/paths';



type Props = {
  children: React.ReactNode;
};


function LoginRequiredScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
     
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 480,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          {/* Red Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              p: 4,
              textAlign: 'center',
              color: 'white',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                mb: 2,
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Authentication Required
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Please sign in to access this page
            </Typography>
          </Box>

          {/* Content */}
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Access Restricted
                </Typography>
                <Typography variant="body2">
                  You need to be authenticated to view this content.
                </Typography>
              </Alert>

          

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<LoginIcon />}
                onClick={() => navigate(paths.auth.login, { 
                  state: { from: location.pathname },
                  replace: true 
                })}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
                    boxShadow: '0 6px 16px rgba(220, 38, 38, 0.4)',
                  },
                }}
              >
                Sign In
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}


function PasswordResetRequired({ userEmail }: { userEmail: string }) {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate(paths.auth.login, { replace: true });
    } catch (error) {
      // Even if logout fails, clear local data and navigate
      localStorage.removeItem('accessToken');
      navigate(paths.auth.login, { replace: true });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 480,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          {/* Red Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              p: 4,
              textAlign: 'center',
              color: 'white',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                mb: 2,
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              Password Reset Required
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Security update needed for your account
            </Typography>
          </Box>

          {/* Content */}
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Temporary Password Detected
                </Typography>
                <Typography variant="body2">
                  You must create a new password before accessing the dashboard.
                </Typography>
              </Alert>

              <Box
                sx={{
                  p: 3,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight="500">
                  Account
                </Typography>
                <Typography variant="body1" fontWeight="500" sx={{ wordBreak: 'break-word' }}>
                  {userEmail}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  Required Action
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  For security reasons, you need to create a new password before you can access your dashboard.
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<VpnKeyIcon />}
                  onClick={() => navigate(paths.auth.resetPassword, { 
                    state: { 
                      email: userEmail, 
                      requireReset: true 
                    },
                    replace: true 
                  })}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
                      boxShadow: '0 6px 16px rgba(220, 38, 38, 0.4)',
                    },
                  }}
                >
                  Reset Password
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: '#d1d5db',
                    color: 'text.secondary',
                    '&:hover': {
                      borderColor: '#9ca3af',
                      bgcolor: '#f9fafb',
                    },
                  }}
                >
                  {logout.isPending ? 'Signing out...' : 'Sign Out'}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default function AuthGuard({ children }: Props) {
  const [checked, setChecked] = useState(false);
  
  const { data: user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('accessToken');
      
      // TODO: When API changes to return separate tokens, also check:
      // const refreshToken = localStorage.getItem('refreshToken');
      
      if (!token) {
        // User is not logged in - show login required screen
        setChecked(true);
        return;
      }

      if (error) {
        localStorage.removeItem('accessToken');
        // TODO: When API changes to return separate tokens, also clear:
        // localStorage.removeItem('refreshToken');
        // User token is invalid - show login required screen
        setChecked(true);
        return;
      }

      if (user) {
        if (user.need_to_reset) {
          // User is logged in but needs password reset
          setChecked(true);
          return;
        }
      }
      
      setChecked(true);
    };

    checkAuthentication();
  }, [user, error]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!checked) {
    return null;
  }

  
  if (!localStorage.getItem('accessToken') || error) {
    return <LoginRequiredScreen />;
  }


  if (!user) {
    return <LoadingScreen />;
  }

 
  if (user.need_to_reset) {
    return <PasswordResetRequired userEmail={user.email} />;
  }

  
  return <>{children}</>;
}
