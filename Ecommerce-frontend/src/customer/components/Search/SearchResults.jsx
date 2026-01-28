import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProducts } from "../../../Redux/Customers/Product/Action";
import {
  Grid,
  CircularProgress,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Chip,
} from "@mui/material";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customersProduct } = useSelector((store) => store);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      // Search across all categories
      dispatch(
        findProducts({
          category: "", // Empty to search all
          minPrice: 0,
          maxPrice: 100000,
          minDiscount: 0,
          sort: "price_low",
          pageNumber: 0,
          pageSize: 50,
        })
      );
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [searchQuery, dispatch]);

  // Filter products based on search query
  const filteredProducts = customersProduct.products?.content?.filter(
    (product) =>
      product.title?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      product.category?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MagnifyingGlassIcon className="h-8 w-8 text-indigo-600" />
            <Typography variant="h4" className="font-bold text-gray-900">
              Search Results
            </Typography>
          </div>
          <Typography variant="body1" className="text-gray-600">
            Showing {filteredProducts.length} results for "
            <span className="font-semibold text-indigo-600">{searchQuery}</span>
            "
          </Typography>
        </div>

        {/* Results */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-600 mb-2">
              No products found
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Try adjusting your search terms
            </Typography>
          </div>
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-xl overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <CardMedia
                      component="img"
                      height="300"
                      image={product.imageUrl}
                      alt={product.title}
                      className="h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.discountPercent > 0 && (
                      <Chip
                        label={`${product.discountPercent}% OFF`}
                        className="absolute top-3 right-3"
                        sx={{
                          bgcolor: "#dc2626",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                        }}
                      />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <Typography
                      variant="subtitle2"
                      className="text-indigo-600 font-semibold mb-1"
                    >
                      {product.brand}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-800 font-medium mb-2 line-clamp-2"
                    >
                      {product.title}
                    </Typography>
                    <div className="flex items-center gap-2 mb-2">
                      <Typography
                        variant="h6"
                        className="font-bold text-gray-900"
                      >
                        ₹{product.discountPrice}
                      </Typography>
                      {product.price > product.discountedPrice && (
                        <Typography
                          variant="body2"
                          className="line-through text-gray-500"
                        >
                          ₹{product.price}
                        </Typography>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
}