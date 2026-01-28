import React from "react";
import { Avatar } from "@mui/material";
import { Rating, Box, Typography, Grid } from "@mui/material";

const ProductReviewCard = ({ item }) => {
  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Get random color for avatar
  const getAvatarColor = () => {
    const colors = ["#9155FD", "#1976d2", "#388e3c", "#f57c00", "#d32f2f"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const userName = item.user?.firstName 
    ? `${item.user.firstName} ${item.user.lastName || ""}`.trim()
    : "Anonymous User";

  return (
    <div className="border-b pb-6 last:border-b-0">
      <Grid container spacing={2} gap={3}>
        <Grid item xs={1}>
          <Box>
            <Avatar
              className="text-white"
              sx={{ width: 56, height: 56, bgcolor: getAvatarColor() }}
              alt={userName}
              src={item.user?.profileImage || ""}
            >
              {getInitials(userName)}
            </Avatar>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-lg">{userName}</p>
              <p className="opacity-70 text-sm">{formatDate(item.createdAt)}</p>
            </div>
            
            {/* Display rating if available */}
            {item.rating && (
              <div>
                <Rating
                  value={item.rating}
                  name="review-rating"
                  readOnly
                  precision={0.5}
                  size="small"
                />
              </div>
            )}

            {/* Display review title/text */}
            <div>
              {item.title && (
                <p className="font-semibold mb-1">{item.title}</p>
              )}
              <p className="text-gray-700">
                {item.review || item.description || "No review text provided."}
              </p>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductReviewCard;