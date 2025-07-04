"use client";
import { useGetAllBookingsQuery } from "@/features/bookingApiSlice";
import { 
  Box,
  CircularProgress,
  Container,
  Typography,
  Chip,
  Button,
  Stack
} from '@mui/material';
import { 
  DataGrid, 
  GridToolbar,
  GridActionsCellItem 
} from '@mui/x-data-grid';
import { green, red, orange } from '@mui/material/colors';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { useCallback, useState } from 'react';

export default function AdminBookingsPage() {
  const { data: bookings, error, isLoading } = useGetAllBookingsQuery();
  const [selectedRows, setSelectedRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  console.log("bookings", bookings);
  

  const getStatusChip = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return <Chip label={status} sx={{ backgroundColor: green[100], color: green[800] }} />;
      case 'failed':
        return <Chip label={status} sx={{ backgroundColor: red[100], color: red[800] }} />;
      case 'pending':
        return <Chip label={status} sx={{ backgroundColor: orange[100], color: orange[800] }} />;
      default:
        return <Chip label={status} />;
    }
  };

  const handleView = useCallback((id) => () => {
    console.log('View booking', id);
    // Add your view logic here
  }, []);

  const handleEdit = useCallback((id) => () => {
    console.log('Edit booking', id);
    // Add your edit logic here
  }, []);

  const handleDelete = useCallback((id) => () => {
    console.log('Delete booking', id);
    // Add your delete logic here
  }, []);

  const handleBulkDelete = () => {
    console.log('Delete selected bookings', selectedRows);
    // Add your bulk delete logic here
  };

  const columns = [
    { 
      field: 'user', 
      headerName: 'User', 
      flex: 1,
      minWidth: 150
    },
    { 
      field: 'service', 
      headerName: 'Service', 
      flex: 1,
      minWidth: 150
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      flex: 1,
      minWidth: 120,
      // valueFormatter: (params) => `₹${params.value}`
    },
    { 
      field: 'paymentId', 
      headerName: 'Payment ID', 
      flex: 1.5,
      minWidth: 200,
      cellClassName: 'font-mono'
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 1,
      minWidth: 120,
      renderCell: (params) => getStatusChip(params.value)
    },
    { 
      field: 'createdAt', 
      headerName: 'Date', 
      flex: 1.5,
      minWidth: 180,
      valueFormatter: (params) => 
        params.value?.toLocaleString('en-UK', {
          year: 'numeric',
         
        })
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          onClick={handleView(params.id)}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={handleEdit(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={handleDelete(params.id)}
          showInMenu
          sx={{ color: red[500] }}
        />,
      ],
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">Error loading bookings: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, height: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        fontWeight: 'bold', 
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        📋 All Bookings
      </Typography>
      
      {selectedRows.length > 0 && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleBulkDelete}
            startIcon={<Delete />}
          >
            Delete Selected ({selectedRows.length})
          </Button>
        </Stack>
      )}

      <Box sx={{ height: 'calc(100vh - 180px)', width: '100%' }}>
        <DataGrid
          rows={bookings || []}
          columns={columns}
          getRowId={(row) => row._id}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          onRowSelectionModelChange={(ids) => {
            setSelectedRows(ids);
          }}
          rowSelectionModel={selectedRows}
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              printOptions: { disableToolbarButton: true },
              csvOptions: { 
                fileName: `bookings-${new Date().toISOString()}`,
                delimiter: ',',
                utf8WithBom: true,
              },
            },
          }}
          sx={{
            '& .font-mono': {
              fontFamily: 'monospace',
            },
            '& .MuiDataGrid-toolbarContainer': {
              p: 2,
              pb: 1,
            },
          }}
        />
      </Box>
    </Container>
  );
}