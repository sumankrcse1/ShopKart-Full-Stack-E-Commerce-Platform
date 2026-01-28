import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSalesReport } from '../../Redux/Admin/Action';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Chart from 'react-apexcharts';

export default function Reports() {
  const dispatch = useDispatch();
  const { salesReport, isLoading } = useSelector((store) => store.admin);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    handleGenerateReport();
  }, []);

  const handleGenerateReport = () => {
    const formatDate = (date) => date.toISOString().split('T')[0];
    dispatch(getSalesReport(formatDate(startDate), formatDate(endDate)));
  };

  if (isLoading || !salesReport) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const chartData = {
    series: [{
      name: 'Sales',
      data: salesReport.map(item => item.revenue || 0)
    }],
    options: {
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      colors: ['#8b5cf6'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
        }
      },
      xaxis: {
        categories: salesReport.map(item => new Date(item.date).toLocaleDateString()),
      },
      yaxis: {
        labels: {
          formatter: (value) => `₹${value.toLocaleString()}`
        }
      },
      tooltip: {
        y: {
          formatter: (value) => `₹${value.toLocaleString()}`
        }
      }
    },
  };

  const totalRevenue = salesReport.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalOrders = salesReport.reduce((sum, item) => sum + (item.orders || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#1f2937' }}>
        Sales Reports
      </Typography>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Select Date Range
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateReport}
                sx={{
                  background: 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                  height: 56,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #7c3aed, #db2777)',
                  },
                }}
              >
                Generate Report
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Revenue
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
              ₹{totalRevenue.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Orders
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
              {totalOrders}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Avg Order Value
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
              ₹{avgOrderValue.toFixed(0)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Sales Trend
        </Typography>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={350}
        />
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Daily Breakdown
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9fafb' }}>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Orders</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Revenue</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Avg Order Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesReport.map((item, index) => (
                <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </TableCell>
                  <TableCell align="right">{item.orders || 0}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ₹{(item.revenue || 0).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    ₹{item.orders > 0 ? ((item.revenue || 0) / item.orders).toFixed(0) : 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}