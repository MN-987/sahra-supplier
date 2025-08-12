import React from 'react';
import { Alert, Box } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  error?: string | null;
  sx?: object;
};

export default function FormErrorAlert({ error, sx }: Props) {
  if (!error) return null;

  return (
    <Box sx={{ mb: 2, ...sx }}>
      <Alert severity="error" variant="filled">
        {error}
      </Alert>
    </Box>
  );
}
