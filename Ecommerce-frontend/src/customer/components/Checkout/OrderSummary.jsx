import React from "react";
import { Badge, Button, Box, Typography, Chip, Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CartItem from "../Cart/CartItem";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../../Redux/Customers/Order/Action";
import { createPayment } from "../../../Redux/Customers/Payment/Action";
import AddressCard from "../AddressCard/AddressCard";
import { store } from "../../../Redux/Store";
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CelebrationIcon from '@mui/icons-material/Celebration';

const OrderSummary = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("order_id");
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    const { order } = useSelector(store => store)

    console.log("orderId ", order.order)

    useEffect(() => {
        dispatch(getOrderById(orderId))
    }, [orderId])

    const handleCreatePayment = () => {
        const data = { orderId: order.order?.id, jwt }
        dispatch(createPayment(data))
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Delivery Address Card */}
            <Box sx={{
                background: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                border: '1px solid #f3f4f6',
            }}>
                {/* Header */}
                <Box sx={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                    px: 3,
                    py: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                }}>
                    <HomeIcon sx={{ color: 'white', fontSize: 28 }} />
                    <Typography sx={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.125rem'
                    }}>
                        Delivery Address
                    </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    <AddressCard address={order.order?.shippingAddress} />
                </Box>
            </Box>

            {/* Order Items and Price Details */}
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
                {/* Order Items Section */}
                <Box sx={{ flex: 1 }}>
                    <Box sx={{
                        background: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        border: '1px solid #f3f4f6',
                        overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <Box sx={{
                            background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
                            px: 3,
                            py: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <ShoppingBagIcon sx={{ color: 'white', fontSize: 28 }} />
                            <Typography sx={{
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.125rem'
                            }}>
                                Order Items
                            </Typography>
                            <Chip
                                label={`${order.order?.totalItem || 0} items`}
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontWeight: 600,
                                    ml: 'auto'
                                }}
                            />
                        </Box>

                        {/* Items List */}
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {order.order?.orderItems?.map((item) => (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 2,
                                            border: '1px solid #f3f4f6',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                boxShadow: '0 4px 16px rgba(147, 51, 234, 0.1)',
                                                transform: 'translateY(-2px)',
                                                borderColor: '#e9d5ff'
                                            }
                                        }}
                                    >
                                        <CartItem item={item} showButton={false} />
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Price Details Section */}
                <Box sx={{ flex: { xs: 1, lg: '0 0 380px' }, width: { xs: '100%', lg: '380px' } }}>
                    <Box sx={{
                        background: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        border: '1px solid #f3f4f6',
                        overflow: 'hidden',
                        position: 'sticky',
                        top: 20
                    }}>
                        {/* Header */}
                        <Box sx={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            px: 3,
                            py: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <CelebrationIcon sx={{ color: 'white', fontSize: 28 }} />
                            <Typography sx={{
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.125rem'
                            }}>
                                Price Details
                            </Typography>
                        </Box>

                        {/* Price Breakdown */}
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ mb: 2.5 }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 1.5,
                                    pb: 1.5,
                                    borderBottom: '1px dashed #e5e7eb'
                                }}>
                                    <Typography sx={{ color: '#6b7280', fontSize: '0.95rem' }}>
                                        Price ({order.order?.totalItem || 0} items)
                                    </Typography>
                                    <Typography sx={{ color: '#111827', fontWeight: 600, fontSize: '0.95rem' }}>
                                        ₹{order.order?.totalPrice || 0}
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 1.5,
                                    pb: 1.5,
                                    borderBottom: '1px dashed #e5e7eb'
                                }}>
                                    <Typography sx={{ color: '#6b7280', fontSize: '0.95rem' }}>
                                        Discount
                                    </Typography>
                                    <Typography sx={{
                                        color: '#16a34a',
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        <LocalOfferIcon sx={{ fontSize: 16 }} />
                                        -₹{order.order?.discount || 0}
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 1.5,
                                    pb: 1.5,
                                    borderBottom: '1px dashed #e5e7eb'
                                }}>
                                    <Typography sx={{
                                        color: '#6b7280',
                                        fontSize: '0.95rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        <LocalShippingIcon sx={{ fontSize: 18 }} />
                                        Delivery Charges
                                    </Typography>
                                    <Typography sx={{
                                        color: '#16a34a',
                                        fontWeight: 700,
                                        fontSize: '0.95rem'
                                    }}>
                                        Free
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2, borderStyle: 'dashed', borderColor: '#d1d5db' }} />

                            {/* Total Amount */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 3,
                                p: 2,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(219, 39, 119, 0.05) 100%)'
                            }}>
                                <Typography sx={{
                                    color: '#111827',
                                    fontWeight: 700,
                                    fontSize: '1.25rem'
                                }}>
                                    Total Amount
                                </Typography>
                                <Typography sx={{
                                    color: '#9333ea',
                                    fontWeight: 700,
                                    fontSize: '1.5rem'
                                }}>
                                    ₹{order.order?.totalDiscountedPrice || 0}
                                </Typography>
                            </Box>

                            {/* Savings Badge */}
                            {order.order?.discount > 0 && (
                                <Box sx={{
                                    p: 2,
                                    mb: 3,
                                    borderRadius: 2,
                                    background: '#dcfce7',
                                    border: '1px solid #86efac',
                                    textAlign: 'center'
                                }}>
                                    <Typography sx={{
                                        color: '#16a34a',
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1
                                    }}>
                                        <CelebrationIcon sx={{ fontSize: 20 }} />
                                        You will save ₹{order.order?.discount} on this order
                                    </Typography>
                                </Box>
                            )}

                            {/* Payment Button */}
                            <Button
                                onClick={handleCreatePayment}
                                variant="contained"
                                size="large"
                                fullWidth
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    py: 1.8,
                                    background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                                    color: 'white',
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1.125rem',
                                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
                                        boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                Proceed to Payment
                            </Button>

                            {/* Safe Purchase Info */}
                            <Box sx={{
                                mt: 2.5,
                                p: 2,
                                borderRadius: 2,
                                background: '#f9fafb',
                                textAlign: 'center'
                            }}>
                                <Typography sx={{
                                    color: '#6b7280',
                                    fontSize: '0.8rem',
                                    lineHeight: 1.5
                                }}>
                                    🔒 Safe and Secure Payments. Easy returns. 100% Authentic products.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default OrderSummary;