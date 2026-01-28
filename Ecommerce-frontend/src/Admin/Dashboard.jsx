import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminStats } from '../Redux/Admin/Action';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
  AttachMoney,
} from '@mui/icons-material';
import Chart from 'react-apexcharts';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((store) => store.admin);

  useEffect(() => {
    dispatch(getAdminStats());
  }, [dispatch]);

  if (isLoading || !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue?.toLocaleString() || 0}`,
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts || 0,
      icon: <Inventory sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
  ];

  const orderStatusData = {
    series: [
      stats.pendingOrders || 0,
      stats.shippedOrders || 0,
      stats.deliveredOrders || 0,
      stats.cancelledOrders || 0,
    ],
    options: {
      chart: { type: 'donut' },
      labels: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      colors: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
      legend: { position: 'bottom' },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: 'bottom' }
        }
      }]
    },
  };

  const revenueChartData = {
    series: [{
      name: 'Revenue',
      data: stats.monthlyRevenue || [0, 0, 0, 0, 0, 0]
    }],
    options: {
      chart: {
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false }
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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#1f2937' }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: card.color }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      bgcolor: card.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e5e7eb',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Revenue Trend
            </Typography>
            <Chart
              options={revenueChartData.options}
              series={revenueChartData.series}
              type="area"
              height={300}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e5e7eb',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Order Status
            </Typography>
            <Chart
              options={orderStatusData.options}
              series={orderStatusData.series}
              type="donut"
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}