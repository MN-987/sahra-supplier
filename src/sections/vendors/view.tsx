// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// components
import React from 'react';

// ----------------------------------------------------------------------

export default function VendorsView() {

  return (
 
    <>
    <Typography variant="h4"> Vendors </Typography>
    <Box
            sx={{
              mt: 5,
              width: 1,
              height: 320,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          />
    </>
  );
}
