import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Rating,
  TextField,
  Typography,
  Chip,
  Stack,
  Avatar,
  Paper,
  Fade,
  Zoom,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createReview, createRating } from "../../../Redux/Customers/Review/Action";
import { useNavigate, useParams } from "react-router-dom";
import { findProductById } from "../../../Redux/Customers/Product/Action";
import { getOrderById } from "../../../Redux/Customers/Order/Action";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import SendIcon from "@mui/icons-material/Send";

const RateProduct = () => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const dispatch = useDispatch();
  const { customersProduct, order } = useSelector((store) => store);
  const { productId, orderId } = useParams();
  const navigate = useNavigate();

  const handleRateProduct = (e, value) => {
    setRating(value);
  };

  const handleChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (review.trim()) {
      dispatch(createReview({ 
        review: review, 
        productId 
      }));
    }
    
    if (rating > 0) {
      dispatch(createRating({ 
        rating: rating, 
        productId 
      }));
    }
    
    setReview("");
    setRating(0);
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    dispatch(findProductById({ productId }));
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, productId, orderId]);

  const getRatingLabel = (value) => {
    const labels = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent"
    };
    return labels[value] || "";
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
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
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                fontSize: { xs: "1.75rem", md: "2.125rem" },
              }}
            >
              <RateReviewOutlinedIcon sx={{ fontSize: { xs: 32, md: 40 }, color: "#667eea" }} />
              Rate & Review Product
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Share your experience and help others make informed decisions
            </Typography>
          </Box>

          {/* Main Flex Container */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 3,
              alignItems: { lg: "flex-start" },
            }}
          >
            {/* Product Info Card - Left Side */}
            <Zoom in timeout={400}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  flex: { xs: "1 1 100%", lg: "0 0 400px" },
                  maxWidth: { lg: "400px" },
                  position: { lg: "sticky" },
                  top: { lg: 24 },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    p: 2.5,
                  }}
                >
                  <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                    Product Details
                  </Typography>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  {/* Product Image and Info */}
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Avatar
                      src={customersProduct.product?.imageUrl || "https://via.placeholder.com/150"}
                      alt={customersProduct.product?.title}
                      variant="rounded"
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxWidth: 250,
                        maxHeight: 250,
                        margin: "0 auto",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        mb: 2,
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {customersProduct.product?.title || "Product Title"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      {customersProduct.product?.brand || "Brand"}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}>
                      ₹{customersProduct.product?.price?.toLocaleString() || 0}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "center", flexWrap: "wrap", gap: 1 }}>
                      <Chip label="Size: Free" size="small" variant="outlined" />
                      {customersProduct.product?.color && (
                        <Chip label={`Color: ${customersProduct.product.color}`} size="small" variant="outlined" />
                      )}
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2.5 }} />

                  {/* Delivery Status */}
                  {order?.order?.deliveryDate && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                        border: "1px solid #81c784",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                        <CheckCircleIcon sx={{ color: "success.main", mt: 0.2 }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "success.dark" }}>
                            Delivered on{" "}
                            {new Date(order.order.deliveryDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Your item has been delivered successfully
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  )}
                </CardContent>
              </Card>
            </Zoom>

            {/* Review Form Section - Right Side */}
            <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
              <Stack spacing={3}>
                {/* Rating Section */}
                <Zoom in timeout={500}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                        <StarIcon sx={{ color: "#FFA726", fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Rate This Product
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        How would you rate your overall experience?
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          gap: 2,
                        }}
                      >
                        <Rating
                          name="product-rating"
                          value={rating}
                          onChange={handleRateProduct}
                          onChangeActive={(event, newHover) => {
                            setHoveredRating(newHover);
                          }}
                          size="large"
                          sx={{
                            fontSize: { xs: "2rem", md: "2.5rem" },
                            "& .MuiRating-iconFilled": {
                              color: "#FFA726",
                            },
                            "& .MuiRating-iconHover": {
                              color: "#FF9800",
                              transform: "scale(1.1)",
                            },
                            "& .MuiRating-icon": {
                              transition: "transform 0.2s ease",
                            },
                          }}
                        />
                        {rating > 0 && (
                          <Chip
                            label={getRatingLabel(hoveredRating > 0 ? hoveredRating : rating)}
                            color="primary"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              height: 32,
                              animation: "fadeIn 0.3s ease",
                              "@keyframes fadeIn": {
                                from: { opacity: 0, transform: "scale(0.8)" },
                                to: { opacity: 1, transform: "scale(1)" },
                              },
                            }}
                          />
                        )}
                      </Box>

                      {rating > 0 && (
                        <Paper
                          elevation={0}
                          sx={{
                            mt: 2.5,
                            p: 2,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                            border: "1px solid #64b5f6",
                            animation: "slideIn 0.3s ease",
                            "@keyframes slideIn": {
                              from: { opacity: 0, transform: "translateY(-10px)" },
                              to: { opacity: 1, transform: "translateY(0)" },
                            },
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.dark" }}>
                            ✨ Thank you for rating! Your {getRatingLabel(rating).toLowerCase()} rating helps other shoppers.
                          </Typography>
                        </Paper>
                      )}
                    </CardContent>
                  </Card>
                </Zoom>

                {/* Review Section */}
                <Zoom in timeout={600}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                        <RateReviewOutlinedIcon sx={{ color: "primary.main", fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Write Your Review
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Share your thoughts about this product with other customers
                      </Typography>

                      <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                          label="Your Review"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={5}
                          value={review}
                          onChange={handleChange}
                          name="review"
                          placeholder="Tell us what you liked or disliked about this product. How did it meet your expectations? Would you recommend it to others?"
                          sx={{
                            mb: 3,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                              "&:hover fieldset": {
                                borderColor: "primary.main",
                              },
                              "&.Mui-focused": {
                                "& fieldset": {
                                  borderWidth: "2px",
                                },
                              },
                            },
                          }}
                        />

                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                          sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "flex", alignItems: "center", gap: 0.5, order: { xs: 2, sm: 1 } }}
                          >
                            <VerifiedIcon sx={{ fontSize: 16, color: "success.main" }} />
                            Your review will be verified before publishing
                          </Typography>

                          <Stack direction="row" spacing={2} sx={{ order: { xs: 1, sm: 2 } }}>
                            <Button
                              variant="outlined"
                              onClick={() => navigate(`/product/${productId}`)}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                px: 3,
                                flex: { xs: 1, sm: "0 0 auto" },
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                },
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              variant="contained"
                              disabled={!review.trim() && rating === 0}
                              endIcon={<SendIcon />}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                px: 4,
                                flex: { xs: 1, sm: "0 0 auto" },
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  background: "linear-gradient(135deg, #5568d3 0%, #6941a1 100%)",
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                                },
                                "&:disabled": {
                                  background: "rgba(0, 0, 0, 0.12)",
                                },
                              }}
                            >
                              Submit Review
                            </Button>
                          </Stack>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>

                {/* Tips Section */}
                <Zoom in timeout={700}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2.5, md: 3 },
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                      border: "1px solid #ffb74d",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 16px rgba(255, 183, 77, 0.3)",
                      },
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: "#e65100", fontSize: "1rem" }}>
                      💡 Tips for Writing a Great Review
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                        <span style={{ color: "#e65100", fontWeight: 600 }}>•</span>
                        <span>Mention what you liked and what could be improved</span>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                        <span style={{ color: "#e65100", fontWeight: 600 }}>•</span>
                        <span>Share details about quality, fit, or performance</span>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                        <span style={{ color: "#e65100", fontWeight: 600 }}>•</span>
                        <span>Keep it honest and helpful for other shoppers</span>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                        <span style={{ color: "#e65100", fontWeight: 600 }}>•</span>
                        <span>Avoid personal information or inappropriate content</span>
                      </Typography>
                    </Stack>
                  </Paper>
                </Zoom>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default RateProduct;