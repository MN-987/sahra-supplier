import React from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
// @mui/icons-material
import LogoutIcon from '@mui/icons-material/Logout';
// hooks
import { useLogout } from 'src/hooks/api/use-auth';
// routes
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

type LogoutButtonProps = {
  variant?: 'button' | 'icon' | 'menuItem';
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
  onClick?: () => void; 
};

export default function LogoutButton({ 
  variant = 'button', 
  size = 'medium',
  children,
  onClick
}: LogoutButtonProps) {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate(paths.auth.login, { replace: true });
      onClick?.(); 
    } catch (error) {
     
      localStorage.removeItem('accessToken');
      navigate(paths.auth.login, { replace: true });
      onClick?.();
    }
  };

  if (variant === 'icon') {
    return (
      <IconButton
        onClick={handleLogout}
        disabled={logout.isPending}
        size={size}
        color="error"
        sx={{
          '&:hover': {
            bgcolor: 'error.lighter',
          },
        }}
      >
        <LogoutIcon />
      </IconButton>
    );
  }

  if (variant === 'menuItem') {
    return (
      <MenuItem
        onClick={handleLogout}
        disabled={logout.isPending}
        sx={{
          color: 'error.main',
          '&:hover': {
            bgcolor: 'error.lighter',
          },
        }}
      >
        <LogoutIcon sx={{ mr: 2 }} />
        {logout.isPending ? 'Logging out...' : children || 'Logout'}
      </MenuItem>
    );
  }

  return (
    <LoadingButton
      variant="outlined"
      color="error"
      size={size}
      startIcon={<LogoutIcon />}
      onClick={handleLogout}
      loading={logout.isPending}
      sx={{
        textTransform: 'none',
        fontWeight: 500,
        '&:hover': {
          borderColor: 'error.main',
          bgcolor: 'error.lighter',
        },
      }}
    >
      {children || 'Logout'}
    </LoadingButton>
  );
}
