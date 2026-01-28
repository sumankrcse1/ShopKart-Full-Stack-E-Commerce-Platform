import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLayout from '../Admin/AdminLayout';
import Dashboard from '../Admin/Dashboard';
import ProductsTable from '../Admin/Products/ProductsTable';
import CreateProduct from '../Admin/Products/CreateProduct';
import OrdersTable from '../Admin/Orders/OrdersTable';
import UsersTable from '../Admin/Users/UsersTable';
import Reports from '../Admin/Reports/Reports';
import { CircularProgress } from '@mui/material';
import { Box } from 'lucide-react';

// Protected Route Component
const AdminProtectedRoute = ({ children }) => {
  const { user, isLoading } = useSelector((store) => store.auth);
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Check if user exists and has ADMIN role
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default function AdminRoutes() {
  return (
    <AdminProtectedRoute>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductsTable />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="orders" element={<OrdersTable />} />
          <Route path="users" element={<UsersTable />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </AdminProtectedRoute>
  );
}