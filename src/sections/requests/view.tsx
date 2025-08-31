import React, { useState } from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import { Table } from 'src/components/table';

const FAKE_REQUESTS = [
  { id: 1, name: 'Request A', price: null, status: 'pending' },
  { id: 2, name: 'Request B', price: 100, status: 'pending' },
  { id: 3, name: 'Request C', price: null, status: 'pending' },
];

function getColumns(actions: { onAccept: (row: any) => void; onReject: (row: any) => void }) {
  return [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    {
      key: 'price',
      label: 'Price',
      render: (value: any) => (value !== null ? value : <em>Missing</em>),
    },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            size="small"
            disabled={row.status !== 'pending'}
            onClick={() => actions.onAccept(row)}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            disabled={row.status !== 'pending'}
            onClick={() => actions.onReject(row)}
          >
            Reject
          </Button>
        </Stack>
      ),
      width: 180,
    },
  ];
}

export default function RequestView() {
  const [requests, setRequests] = useState(FAKE_REQUESTS);
  const [dialog, setDialog] = useState<{
    open: boolean;
    type: string;
    request: any;
    price: string;
  }>({ open: false, type: '', request: null, price: '' });

  const handleAccept = (request: any) => {
    if (!request.price) {
      setDialog({ open: true, type: 'price', request, price: '' });
    } else {
      setDialog({ open: true, type: 'confirm-accept', request, price: request.price });
    }
  };

  const handleReject = (request: any) => {
    setDialog({ open: true, type: 'confirm-reject', request, price: request.price || '' });
  };

  const handleDialogClose = () => setDialog({ open: false, type: '', request: null, price: '' });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDialog((prev) => ({ ...prev, price: e.target.value }));
  };

  const handleConfirmAccept = () => {
    if (!dialog.request) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === dialog.request.id ? { ...r, price: Number(dialog.price), status: 'accepted' } : r
      )
    );
    handleDialogClose();
  };

  const handleConfirmReject = () => {
    if (!dialog.request) return;
    setRequests((prev) =>
      prev.map((r) => (r.id === dialog.request.id ? { ...r, status: 'rejected' } : r))
    );
    handleDialogClose();
  };

  return (
    <>
      <Typography variant="h4"> Requests </Typography>

      <Table
        data={requests}
        columns={getColumns({ onAccept: handleAccept, onReject: handleReject })}
        rowIdField="id"
        onRowAction={() => {}}
      />

      {/* Dialogs */}
      <Dialog open={dialog.open && dialog.type === 'price'} onClose={handleDialogClose}>
        <DialogTitle>Add Price</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={dialog.price}
            onChange={handlePriceChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmAccept} disabled={!dialog.price}>
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialog.open && dialog.type === 'confirm-accept'} onClose={handleDialogClose}>
        <DialogTitle>Confirm Accept</DialogTitle>
        <DialogContent>
          Are you sure you want to accept this request
          {dialog.price ? ` with price ${dialog.price}` : ''}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmAccept} autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialog.open && dialog.type === 'confirm-reject'} onClose={handleDialogClose}>
        <DialogTitle>Confirm Reject</DialogTitle>
        <DialogContent>Are you sure you want to reject this request?</DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmReject} color="error" autoFocus>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
