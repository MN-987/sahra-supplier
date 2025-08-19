// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function EventsView() {
  const router = useRouter();

  const handleCreateEvent = () => {
    router.push('/dashboard/management/events/create');
  };

  return (
    <Container maxWidth="lg">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Typography variant="h4">Events</Typography>
        
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleCreateEvent}
          size="large"
        >
          Create Event
        </Button>
      </Stack>

      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No events created yet. Click &quot;Create Event&quot; to get started.
        </Typography>
      </Box>

  {/* No Outlet here; create event page is separate */}
    </Container>
  );
}
