import React, { useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  Fade,
  Zoom,
  Container,
  Stack,
  Avatar,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../../Redux/Customers/Order/Action";
import OrderTracker from "./OrderTracker";
import AddressCard from "../AddressCard/AddressCard";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import KeyboardReturnOutlinedIcon from "@mui/icons-material/KeyboardReturnOutlined";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { orderId } = useParams();
  const { order } = useSelector((store) => store);
  const navigate = useNavigate();

  console.log("order", order.order);

  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [orderId, dispatch]);

  const getActiveStep = (status) => {
    switch (status) {
      case "PLACED":
        return 1;
      case "CONFIRMED":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 0;
    }
  };

  const handleCancelOrder = () => {
    console.log("Cancel order:", orderId);
    // TODO: Add cancel order API call
  };

  const handleReturnOrder = () => {
    console.log("Return order:", orderId);
    // TODO: Add return order API call
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "SHIPPED":
        return "info";
      case "CONFIRMED":
        return "primary";
      case "PLACED":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  if (!order.order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <Typography variant="h6" color="text.secondary">
            Loading order details...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Fade in timeout={600}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Order Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Order ID: #{order.order?.id}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} lg={7}>
              {/* Order Tracker Card */}
              <Zoom in timeout={400}>
                <Card
                  elevation={0}
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      p: 2.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <LocalShippingOutlinedIcon sx={{ color: "white", fontSize: 28 }} />
                      <Box>
                        <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                          Order Status
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                          Track your order delivery
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={order.order?.orderStatus || "N/A"}
                      color={getStatusColor(order.order?.orderStatus)}
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        height: 36,
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <OrderTracker activeStep={getActiveStep(order.order?.orderStatus)} />

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "flex-end" }}>
                      {order.order?.orderStatus === "DELIVERED" && (
                        <Button
                          onClick={handleReturnOrder}
                          variant="outlined"
                          color="error"
                          startIcon={<KeyboardReturnOutlinedIcon />}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            px: 3,
                            fontWeight: 600,
                          }}
                        >
                          Return Order
                        </Button>
                      )}

                      {order.order?.orderStatus !== "DELIVERED" &&
                        order.order?.orderStatus !== "CANCELLED" && (
                          <Button
                            onClick={handleCancelOrder}
                            variant="outlined"
                            color="error"
                            startIcon={<CancelOutlinedIcon />}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              px: 3,
                              fontWeight: 600,
                            }}
                          >
                            Cancel Order
                          </Button>
                        )}

                      {order.order?.orderStatus === "CANCELLED" && (
                        <Chip
                          label="Order Cancelled"
                          color="error"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Zoom>

              {/* Delivery Address Card */}
              <Zoom in timeout={500}>
                <Card
                  elevation={0}
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                    <LocationOnOutlinedIcon sx={{ color: "primary.main", fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Delivery Address
                    </Typography>
                  </Box>
                  <Divider />
                  <CardContent sx={{ p: 3 }}>
                    <AddressCard address={order.order?.shippingAddress} />
                  </CardContent>
                </Card>
              </Zoom>

              {/* Order Items */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  <ReceiptLongOutlinedIcon sx={{ color: "primary.main" }} />
                  Order Items ({order.order?.totalItem || 0})
                </Typography>

                <Stack spacing={2}>
                  {order.order?.orderItems?.map((item, index) => (
                    <Zoom in timeout={600 + index * 100} key={item.id || index}>
                      <Card
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          border: "1px solid",
                          borderColor: "divider",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            transform: "translateY(-4px)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                          <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between", flexWrap: { xs: "wrap", md: "nowrap" } }}>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1, minWidth: 0 }}>
                              <Avatar
                                src={item?.product?.imageUrl || "https://via.placeholder.com/150"}
                                alt={item?.product?.title || "Product"}
                                variant="rounded"
                                sx={{
                                  width: { xs: 80, sm: 100 },
                                  height: { xs: 80, sm: 100 },
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                  flexShrink: 0,
                                }}
                              />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {item?.product?.title || "Product Title"}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
                                  <Chip label={`Color: ${item?.color || "N/A"}`} size="small" variant="outlined" />
                                  <Chip label={`Size: ${item?.size || "N/A"}`} size="small" variant="outlined" />
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  Brand: {item?.product?.brand || "Unknown"}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                                  ₹{item?.price?.toLocaleString() || 0}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ flexShrink: 0, ml: { md: 2 } }}>
                              <Button
                                onClick={() => navigate(`/account/rate/${item.product.id}`)}
                                variant="outlined"
                                startIcon={<StarBorderIcon />}
                                sx={{
                                  borderRadius: 2,
                                  textTransform: "none",
                                  fontWeight: 600,
                                  py: 1,
                                  px: 2.5,
                                  borderColor: "primary.main",
                                  color: "primary.main",
                                  whiteSpace: "nowrap",
                                  "&:hover": {
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    borderColor: "transparent",
                                    color: "white",
                                  },
                                }}
                              >
                                Rate Product
                              </Button>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Zoom>
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* Right Column - Order Summary */}
            <Grid item xs={12} lg={5}>
              <Zoom in timeout={700}>
                <Card
                  elevation={0}
                  sx={{
                    position: { lg: "sticky" },
                    top: { lg: 24 },
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                  }}
                >
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      p: 2.5,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "white", fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
                      <PaymentOutlinedIcon />
                      Order Summary
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.5}>
                      {/* Order Date */}
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            Order Date
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, ml: 3 }}>
                          {order.order?.orderDate
                            ? new Date(order.order.orderDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                              })
                            : "N/A"}
                        </Typography>
                      </Box>

                      {/* Delivery Date */}
                      {order.order?.deliveryDate && (
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: "success.main" }} />
                            <Typography variant="body2" color="text.secondary">
                              Delivery Date
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: "success.main", ml: 3 }}>
                            {new Date(order.order.deliveryDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            })}
                          </Typography>
                        </Box>
                      )}

                      <Divider />

                      {/* Price Breakdown */}
                      <Box>
                        <Stack spacing={1.5}>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" color="text.secondary">
                              Total Items
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {order.order?.totalItem || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" color="text.secondary">
                              Subtotal
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              ₹{order.order?.totalPrice?.toLocaleString() || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="body2" sx={{ color: "success.main" }}>
                              Discount
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: "success.main" }}>
                              -₹{order.order?.discount?.toLocaleString() || 0}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      <Divider sx={{ borderStyle: "dashed" }} />

                      {/* Total */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 2,
                          borderRadius: 2,
                          background: "rgba(102, 126, 234, 0.1)",
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Total Amount
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
                          ₹{order.order?.totalDiscountedPrice?.toLocaleString() || 0}
                        </Typography>
                      </Box>

                      <Divider />

                      {/* Payment Status */}
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Payment Status
                        </Typography>
                        <Chip
                          label={order.order?.paymentDetails?.status || "PENDING"}
                          color={
                            order.order?.paymentDetails?.status === "COMPLETED"
                              ? "success"
                              : "warning"
                          }
                          sx={{
                            fontWeight: 600,
                            width: "100%",
                            height: 36,
                          }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
};

export default OrderDetails;