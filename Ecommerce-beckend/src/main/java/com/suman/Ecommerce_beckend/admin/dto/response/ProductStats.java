package com.suman.Ecommerce_beckend.admin.dto.response;

public class ProductStats {
    private Long productId;
    private String productTitle;
    private String imageUrl;
    private Integer totalSold;
    private Double totalRevenue;
    private Integer currentStock;
    private Double averageRating;
    private Integer totalReviews;

    public ProductStats() {
    }

    public ProductStats(Long productId, String productTitle, String imageUrl, Integer totalSold,
                        Double totalRevenue, Integer currentStock, Double averageRating, Integer totalReviews) {
        this.productId = productId;
        this.productTitle = productTitle;
        this.imageUrl = imageUrl;
        this.totalSold = totalSold;
        this.totalRevenue = totalRevenue;
        this.currentStock = currentStock;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
    }

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getTotalSold() {
        return totalSold;
    }

    public void setTotalSold(Integer totalSold) {
        this.totalSold = totalSold;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }
}