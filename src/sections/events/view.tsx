// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import React from 'react';
import { useRouter } from 'src/routes/hooks';
// components
import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
// hooks
import { useSupplierEventTypes, useDeleteSupplierEventTypes } from './hooks';

// ----------------------------------------------------------------------

export default function EventsView() {
  const router = useRouter();
  const { data: eventTypes, isLoading, error } = useSupplierEventTypes();
  const deleteEventTypes = useDeleteSupplierEventTypes();
  console.log(eventTypes,"created events");

  const handleCreateEvent = () => {
    router.push('/dashboard/management/events/create');
  };

  const handleDeleteAllEventTypes = async () => {
    if (window.confirm('Are you sure you want to delete all event types? This action cannot be undone.')) {
      await deleteEventTypes.mutateAsync();
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" color="error">
          Error loading event types: {error.message}
        </Typography>
      </Container>
    );
  }

  const hasEventTypes = eventTypes?.event_types && eventTypes.event_types.length > 0;

  return (
    <Container maxWidth="lg">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
        <Typography variant="h4">Events</Typography>
        
        <Stack direction="row" spacing={2}>
          {hasEventTypes && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Iconify icon="mingcute:delete-2-line" />}
              onClick={handleDeleteAllEventTypes}
              disabled={deleteEventTypes.isPending}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleCreateEvent}
            size="large"
          >
            Create Event
          </Button>
        </Stack>
      </Stack>

      {hasEventTypes ? (
        <Grid container spacing={3}>
          {eventTypes.event_types.map((eventType, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  '&:hover': {
                    boxShadow: (theme) => theme.customShadows.z8,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {eventType.event_type_id}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Chip
                      label={`Min: ${eventType.min_capacity} people`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`Max: ${eventType.max_capacity} people`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
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
      )}
    </Container>
  );
}
