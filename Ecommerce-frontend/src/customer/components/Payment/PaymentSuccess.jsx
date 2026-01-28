import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updatePayment } from '../../../Redux/Customers/Payment/Action';
import { getOrderById } from '../../../Redux/Customers/Order/Action';
import OrderTracker from '../Order/OrderTracker';
import AddressCard from '../AddressCard/AddressCard';
import { Box, Typography, Chip, Divider, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [paymentId, setPaymentId] = useState("");
  const [paymentLinkId, setPaymentLinkId] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const { orderId } = useParams();

  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);

  const handleDownloadInvoice = () => {
    const orderData = order.order;
    if (!orderData) return;

    // Create a new window for the PDF
    const printWindow = window.open('', '', 'width=800,height=600');

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${referenceId || orderId || 'N/A'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 40px; 
            color: #333;
            background: white;
          }
          .invoice-container { max-width: 800px; margin: 0 auto; }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 3px solid #9333ea;
            padding-bottom: 20px;
          }
          .header h1 { 
            color: #9333ea; 
            font-size: 36px;
            margin-bottom: 10px;
          }
          .header p { color: #666; font-size: 14px; }
          .info-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
          }
          .info-block h3 {
            color: #9333ea;
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 10px;
            letter-spacing: 1px;
          }
          .info-block p {
            margin: 5px 0;
            font-size: 14px;
            line-height: 1.6;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          .items-table thead {
            background: #9333ea;
            color: white;
          }
          .items-table th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
          }
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 13px;
          }
          .items-table tbody tr:hover {
            background: #f9fafb;
          }
          .total-section {
            margin-top: 30px;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
          }
          .total-row.grand-total {
            border-top: 2px solid #9333ea;
            margin-top: 10px;
            padding-top: 15px;
            font-size: 18px;
            font-weight: bold;
            color: #9333ea;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #666;
            font-size: 13px;
          }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>ShopKart</h1>
            <h2>INVOICE</h2>
            <p>Thank you for your purchase!</p>
          </div>

          <div class="info-section">
            <div class="info-block">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> ${referenceId || orderId || 'N/A'}</p>
              <p><strong>Payment ID:</strong> ${paymentId || 'N/A'}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Status:</strong> ${paymentStatus || 'Paid'}</p>
            </div>

            <div class="info-block">
              <h3>Shipping Address</h3>
              <p><strong>${orderData.shippingAddress?.firstName || ''} ${orderData.shippingAddress?.lastName || ''}</strong></p>
              <p>${orderData.shippingAddress?.streetAddress || ''}</p>
              <p>${orderData.shippingAddress?.city || ''}, ${orderData.shippingAddress?.state || ''} ${orderData.shippingAddress?.zipCode || ''}</p>
              <p><strong>Phone:</strong> ${orderData.shippingAddress?.mobile || ''}</p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Brand</th>
                <th>Color/Size</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.orderItems?.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.product.title}</td>
                  <td>${item.product.brand}</td>
                  <td>${item.color || 'N/A'} / ${item.size}</td>
                  <td>${item.quantity || 1}</td>
                  <td>₹${item.price}</td>
                </tr>
              `).join('') || '<tr><td colspan="6">No items</td></tr>'}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${orderData.totalPrice || 0}</span>
            </div>
            <div class="total-row">
              <span>Discount:</span>
              <span>-₹${(orderData.totalPrice - orderData.totalDiscountedPrice) || 0}</span>
            </div>
            <div class="total-row">
              <span>Delivery Charges:</span>
              <span>Free</span>
            </div>
            <div class="total-row grand-total">
              <span>TOTAL AMOUNT:</span>
              <span>₹${orderData.totalDiscountedPrice || 0}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for shopping with us!</p>
            <p>For any queries, please contact our customer support.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();

    // Wait for content to load, then trigger print dialog
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setPaymentId(urlParams.get("razorpay_payment_id") || "");
    setPaymentLinkId(urlParams.get("razorpay_payment_link_id") || "");
    setReferenceId(urlParams.get("razorpay_payment_link_reference_id") || "");
    setPaymentStatus(urlParams.get("razorpay_payment_link_status") || "");
  }, []);

    useEffect(() => {
    // parse numeric order id (handles "10-<timestamp>" reference)
    const parsedOrderId = (() => {
      const rid = referenceId || orderId;
      if (!rid) return null;
      return rid.toString().includes('-') ? rid.toString().split('-')[0] : rid;
    })();

    if (paymentStatus === "paid" && parsedOrderId) {
      // wrap in async IIFE so we can await dispatches
      (async () => {
        try {
          const data = {
            orderId: parsedOrderId,
            paymentId,
            paymentLinkId,
            paymentStatus,
            jwt,
          };

          // 1) Dispatch updatePayment and wait for it to complete
          await dispatch(updatePayment(data));

          // 2) After backend updated, fetch fresh order data
          await dispatch(getOrderById(parsedOrderId));
        } catch (err) {
          console.error("Error finalizing payment:", err);
          // optionally show a toast or retry logic
        }
      })();
    }
  }, [orderId, paymentId, paymentLinkId, referenceId, paymentStatus, jwt, dispatch]);


  useEffect(() => {
    if (paymentStatus === "paid") {
      const data = {
        orderId: referenceId || orderId,
        paymentId,
        paymentLinkId,
        paymentStatus,
        jwt
      };
      dispatch(updatePayment(data));
      dispatch(getOrderById(referenceId || orderId));
    }
  }, [orderId, paymentId, paymentLinkId, referenceId, paymentStatus, jwt, dispatch]);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #fce7f3 50%, #dbeafe 100%)',
      py: 6,
      px: { xs: 2, md: 6, lg: 20 }
    }}>
      {/* Success Banner */}
      <Box sx={{
        maxWidth: '1200px',
        mx: 'auto',
        mb: 5
      }}>
        <Box sx={{
          background: 'white',
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.2)',
          overflow: 'hidden',
          border: '2px solid #10b981'
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            py: 4,
            px: 4,
            textAlign: 'center'
          }}>
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'white',
              mb: 2,
              animation: 'scaleIn 0.5s ease-out'
            }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: '#10b981' }} />
            </Box>
            <Typography sx={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: 700,
              mb: 1
            }}>
              Payment Successful!
            </Typography>
            <Typography sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.125rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}>
              <CelebrationIcon /> Congratulations! Your order has been placed successfully
            </Typography>
          </Box>

          {/* Order Details Summary */}
          <Box sx={{ p: 3, background: '#f9fafb' }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', mb: 0.5 }}>
                  Order ID
                </Typography>
                <Typography sx={{ color: '#111827', fontWeight: 700, fontSize: '1.125rem' }}>
                  #{referenceId || orderId || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', mb: 0.5 }}>
                  Payment ID
                </Typography>
                <Typography sx={{
                  color: '#111827',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  wordBreak: 'break-all',
                  px: 1
                }}>
                  {paymentId || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#6b7280', fontSize: '0.875rem', mb: 0.5 }}>
                  Total Amount
                </Typography>
                <Typography sx={{ color: '#10b981', fontWeight: 700, fontSize: '1.25rem' }}>
                  ₹{order.order?.totalDiscountedPrice || 0}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Order Tracker */}
      <Box sx={{
        maxWidth: '1200px',
        mx: 'auto',
        mb: 5,
        background: 'white',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        p: 4,
        border: '1px solid #f3f4f6'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 3
        }}>
          <LocalShippingIcon sx={{ color: '#9333ea', fontSize: 28 }} />
          <Typography sx={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#111827'
          }}>
            Order Tracking
          </Typography>
        </Box>
        <OrderTracker activeStep={1} />
      </Box>

      {/* Order Items and Single Shipping Address */}
      <Box sx={{
        maxWidth: '1200px',
        mx: 'auto',
        display: 'flex',
        gap: 3,
        flexDirection: { xs: 'column', lg: 'row' }
      }}>
        {/* Order Items Section */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 3
          }}>
            <ShoppingBagIcon sx={{ color: '#9333ea', fontSize: 28 }} />
            <Typography sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#111827'
            }}>
              Order Items
            </Typography>
            <Chip
              label={`${order.order?.orderItems?.length || 0} items`}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {order.order?.orderItems?.map((item, index) => (
              <Box
                key={`order-item-${item.id || index}`}
                sx={{
                  background: 'white',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  border: '1px solid #f3f4f6',
                  p: 3,
                  display: 'flex',
                  gap: 2.5,
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(147, 51, 234, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 2,
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb'
                }}>
                  <img
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top'
                    }}
                    src={item?.product.imageUrl}
                    alt={item?.product.title}
                  />
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Typography sx={{
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    color: '#111827',
                    lineHeight: 1.3
                  }}>
                    {item.product.title}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Color: ${item.color || 'undefined'}`}
                      size="small"
                      sx={{
                        background: '#f3f4f6',
                        color: '#374151',
                        fontWeight: 600
                      }}
                    />
                    <Chip
                      label={`Size: ${item.size}`}
                      size="small"
                      sx={{
                        background: '#f3f4f6',
                        color: '#374151',
                        fontWeight: 600
                      }}
                    />
                  </Box>

                  <Typography sx={{
                    color: '#6b7280',
                    fontSize: '0.875rem'
                  }}>
                    <strong>Seller:</strong> {item.product.brand}
                  </Typography>

                  <Typography sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#9333ea',
                    mt: 'auto'
                  }}>
                    ₹{item.price}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Single Shipping Address Section */}
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
            <Box sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              px: 3,
              py: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <HomeIcon sx={{ color: 'white', fontSize: 24 }} />
              <Typography sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: '1.125rem'
              }}>
                Shipping To
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <AddressCard address={order.order?.shippingAddress} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{
        maxWidth: '1200px',
        mx: 'auto',
        mt: 5,
        display: 'flex',
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'center'
      }}>
        <Button
          onClick={handleDownloadInvoice}
          variant="outlined"
          size="large"
          startIcon={<DownloadIcon />}
          sx={{
            borderColor: '#9333ea',
            color: '#9333ea',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              borderColor: '#7c3aed',
              background: 'rgba(147, 51, 234, 0.05)'
            }
          }}
        >
          Download Invoice
        </Button>
        <Button
          onClick={() => navigate('/')}
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
          sx={{
            background: 'linear-gradient(90deg, #9333ea 0%, #db2777 100%)',
            color: 'white',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 16px rgba(147, 51, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(90deg, #7c3aed 0%, #be185d 100%)',
              boxShadow: '0 6px 24px rgba(147, 51, 234, 0.5)'
            }
          }}
        >
          Continue Shopping
        </Button>
      </Box>

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
}

export default PaymentSuccess