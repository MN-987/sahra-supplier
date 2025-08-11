import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { EditDialogProps } from '../../types/edit-dialog-props';

export const EditDialog = <T extends Record<string, any>>({
  open,
  onClose,
  onSave,
  data,
  columns,
}: EditDialogProps<T>) => {
  const [formData, setFormData] = React.useState<T | null>(null);

  React.useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleChange = (key: string, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [key]: value,
      });
    }
  };

  const handleSubmit = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Details</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            {columns.map((column) => (
              <Grid item xs={12} sm={6} key={column.key}>
                {column.type === 'select' && column.options ? (
                  <FormControl fullWidth>
                    <InputLabel>{column.label}</InputLabel>
                    <Select
                      value={formData[column.key] || ''}
                      label={column.label}
                      onChange={(e) => handleChange(column.key, e.target.value)}
                    >
                      {column.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    label={column.label}
                    value={formData[column.key] || ''}
                    onChange={(e) => handleChange(column.key, e.target.value)}
                    type={column.type === 'email' ? 'email' : column.type === 'tel' ? 'tel' : 'text'}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 