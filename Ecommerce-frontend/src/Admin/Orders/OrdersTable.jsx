import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminOrders, updateOrderStatus, deleteOrder } from '../../Redux/Admin/Action';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  IconButton,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const orderStatuses = ['PENDING', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusColors = {
  PENDING: 'warning',
  PLACED: 'info',
  CONFIRMED: 'primary',
  SHIPPED: 'secondary',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

export default function OrdersTable() {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((store) => store.admin);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    dispatch(getAdminOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus(orderId, newStatus));
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      dispatch(deleteOrder(orderToDelete.id));
    }
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.orderStatus === filterStatus);

  if (isLoading && orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#1f2937' }}>
        Orders Management
      </Typography>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', mb: 3 }}>
        <Tabs
          value={filterStatus}
          onChange={(e, newValue) => setFilterStatus(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All" value="ALL" />
          {orderStatuses.map((status) => (
            <Tab key={status} label={status} value={status} />
          ))}
        </Tabs>
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9fafb' }}>
                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{
                    '&:hover': { bgcolor: '#f9fafb' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      #{order.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.user?.firstName} {order.user?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.user?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹{order.totalPrice?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>{order.orderItems?.length || 0}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      size="small"
                      sx={{ minWidth: 140 }}
                    >
                      {orderStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          <Chip
                            label={status}
                            color={statusColors[status]}
                            size="small"
                            sx={{ width: '100%' }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                      onClick={() => handleDeleteClick(order)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete order #{orderToDelete?.id}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}