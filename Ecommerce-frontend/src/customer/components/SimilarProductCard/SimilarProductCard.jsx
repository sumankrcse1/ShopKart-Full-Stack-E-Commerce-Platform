import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Rating,
    Chip,
    IconButton,
    Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const SimilarProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = React.useState(false);

    const handleProductClick = () => {
        navigate(`/product/${product.id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        // TODO: Add to favorites API call
    };

    const discountPercentage = product.price && product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    return (
        <Card
            onClick={handleProductClick}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
                    transform: "translateY(-4px)",
                    "& .product-image": {
                        transform: "scale(1.1)",
                    },
                    "& .cart-button": {
                        opacity: 1,
                        transform: "translateY(0)",
                    },
                },
            }}
        >
            {/* Discount Badge */}
            {discountPercentage > 0 && (
                <Chip
                    label={`${discountPercentage}% OFF`}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 2,
                        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        boxShadow: "0 2px 8px rgba(245,87,108,0.4)",
                    }}
                />
            )}

            {/* Product Image */}
            <Box
                sx={{
                    position: "relative",
                    paddingTop: "100%",
                    overflow: "hidden",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <CardMedia
                    component="img"
                    image={product.imageUrl || "https://via.placeholder.com/300"}
                    alt={product.title || "Product"}
                    className="product-image"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                    }}
                />

            </Box>

            {/* Product Details */}
            <CardContent sx={{ flexGrow: 1, p: 1.5, pt: 2 }}>
                {/* Brand */}
                {product.brand && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: "text.secondary",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            display: "block",
                            mb: 0.5,
                        }}
                    >
                        {product.brand}
                    </Typography>
                )}

                {/* Product Title */}
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: "2.5rem",
                        lineHeight: 1.3,
                    }}
                >
                    {product.title || "Product Name"}
                </Typography>

                {/* Rating */}
                {product.rating !== undefined && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                        <Rating
                            value={product.rating || 0}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{ fontSize: "0.875rem" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            ({product.numRatings || 0})
                        </Typography>
                    </Box>
                )}

                {/* Price Section */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: "primary.main",
                            fontSize: "1.125rem",
                        }}
                    >
                        ₹{product.discountedPrice?.toLocaleString() || product.price?.toLocaleString() || 0}
                    </Typography>

                    {product.discountedPrice && product.price && product.discountedPrice < product.price && (
                        <Typography
                            variant="body2"
                            sx={{
                                textDecoration: "line-through",
                                color: "text.secondary",
                                fontSize: "0.875rem",
                            }}
                        >
                            ₹{product.price.toLocaleString()}
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default SimilarProductCard;