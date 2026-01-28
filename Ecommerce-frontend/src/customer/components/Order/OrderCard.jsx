import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Button,
  Avatar,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
  Zoom
} from '@mui/material';

import {
  FiberManualRecord as DeliveredIcon,
  Adjust as ProcessingIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as ConfirmedIcon,
  Cancel as CancelledIcon,
  HourglassEmpty as PendingIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ item, order }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate=useNavigate();

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  // Check order status
  const isDelivered = order?.orderStatus === "DELIVERED" && order?.deliveryDate != null;
  const isPlaced = order?.orderStatus === "PLACED" && order?.deliveryDate == null;

  const deliveryDate = order?.deliveryDate
    ? formatDate(order.deliveryDate)
    : formatDate(order?.orderDate);

  // Status configuration
  const getStatusConfig = () => {
    if (isDelivered) {
      return {
        label: `Delivered on ${deliveryDate}`,
        color: 'success',
        icon: <DeliveredIcon sx={{ fontSize: 16 }} />,
        bgColor: alpha(theme.palette.success.main, 0.1),
        description: 'Your item has been delivered'
      };
    }
    if (isPlaced) {
      return {
        label: `Order placed on ${deliveryDate}`,
        color: 'info',
        icon: <ProcessingIcon sx={{ fontSize: 16 }} />,
        bgColor: alpha(theme.palette.info.main, 0.1),
        description: 'Your order has been placed successfully'
      };
    }

    const statusMap = {
      PENDING: {
        label: 'Order Pending',
        color: 'warning',
        icon: <PendingIcon sx={{ fontSize: 16 }} />,
        bgColor: alpha(theme.palette.warning.main, 0.1),
        description: 'Your order is being processed'
      },
      CONFIRMED: {
        label: 'Order Confirmed',
        color: 'primary',
        icon: <ConfirmedIcon sx={{ fontSize: 16 }} />,
        bgColor: alpha(theme.palette.primary.main, 0.1),
        description: 'Your order has been confirmed'
      },
      SHIPPED: {
        label: 'Shipped',
        color: 'secondary',
        icon: <ShippingIcon sx={{ fontSize: 16 }} />,
        bgColor: alpha(theme.palette.secondary.main, 0.1),
        description: 'Your order is on the way'
      },
      CANCELLED: {
        label: 'Order Cancelled',
        color: 'error',
        icon: <CancelledIcon sx={{ fontSize: 16 }} />,
        bgColor: alpha(theme.palette.error.main, 0.1),
        description: 'Your order has been cancelled'
      }
    };

    return statusMap[order?.orderStatus] || {
      label: 'Processing Order',
      color: 'default',
      icon: <ProcessingIcon sx={{ fontSize: 16 }} />,
      bgColor: alpha(theme.palette.grey[500], 0.1),
      description: 'Your order is being processed'
    };
  };

  const statusConfig = getStatusConfig();

  const handleNavigateToOrder = () => {
    navigate(`/account/order/${order?.id}`)
    console.log('Navigate to order:', order?.id);
  };

  const handleNavigateToReview = () => {
    navigate(`/account/rate/${item?.product?.id}`)
    console.log('Navigate to review:', item?.product?.id);
  };

  return (
    <Zoom in timeout={300}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.12)}`,
            transform: 'translateY(-4px)',
            borderColor: alpha(theme.palette.primary.main, 0.3),
          }
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Product Image and Details */}
            <Grid item xs={12} md={7}>
              <Box
                onClick={handleNavigateToOrder}
                sx={{
                  display: 'flex',
                  gap: 2,
                  cursor: 'pointer',
                  flexDirection: { xs: 'row', sm: 'row' }
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    flexShrink: 0,
                    borderRadius: 2,
                    overflow: 'hidden',
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    bgcolor: alpha(theme.palette.grey[300], 0.2),
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <img
                    src={item?.product?.imageUrl || "https://via.placeholder.com/150"}
                    alt={item?.product?.title || "Product"}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: '0.95rem', sm: '1.1rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      color: theme.palette.text.primary
                    }}
                  >
                    {item?.product?.title || "Product Title"}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                    <Chip
                      label={`Size: ${item?.size || "N/A"}`}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        fontWeight: 500
                      }}
                    />
                    <Chip
                      label={`Color: ${item?.color || "N/A"}`}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        bgcolor: alpha(theme.palette.secondary.main, 0.08),
                        color: theme.palette.secondary.main,
                        fontWeight: 500
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mt: 1.5,
                      color: theme.palette.primary.main,
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    ₹{item?.price?.toLocaleString('en-IN') || 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Divider for mobile */}
            <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' }, py: 0 }}>
              <Divider />
            </Grid>

            {/* Status and Actions */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {/* Status Badge */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: statusConfig.bgColor,
                    border: `1px solid ${alpha(theme.palette[statusConfig.color]?.main || theme.palette.grey[500], 0.2)}`
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Box sx={{ color: `${statusConfig.color}.main` }}>
                      {statusConfig.icon}
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: `${statusConfig.color}.main`,
                        fontSize: { xs: '0.85rem', sm: '0.9rem' }
                      }}
                    >
                      {statusConfig.label}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: 'block',
                      fontSize: '0.75rem'
                    }}
                  >
                    {statusConfig.description}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowIcon />}
                    onClick={handleNavigateToOrder}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1,
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  >
                    View Order Details
                  </Button>

                  {isDelivered && (
                    <Fade in timeout={500}>
                      <Button
                        variant="contained"
                        startIcon={<StarIcon />}
                        onClick={handleNavigateToReview}
                        fullWidth
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1,
                          background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}`,
                          '&:hover': {
                            boxShadow: `0 6px 16px ${alpha(theme.palette.warning.main, 0.4)}`,
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        Rate & Review Product
                      </Button>
                    </Fade>
                  )}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Zoom>
  );
};

export default OrderCard;