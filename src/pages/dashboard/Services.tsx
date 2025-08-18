import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Card, CardContent, Box, Button, Stack } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function Services() {
  const router = useRouter();

  const handleCreateService = () => {
    router.push('/dashboard/management/services/create');
  };

  return (
    <>
      <Helmet>
        <title>Services | Sahra Supplier</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
          <Typography variant="h4">Services</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleCreateService}
          >
            Add Service
          </Button>
        </Stack>

        <Card>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
                textAlign: 'center',
              }}
            >
              <Iconify
                icon="solar:box-bold-duotone"
                width={120}
                sx={{ color: 'text.disabled', mb: 3 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No services yet
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                Start by adding your first service to showcase what you offer.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleCreateService}
              >
                Add Your First Service
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
