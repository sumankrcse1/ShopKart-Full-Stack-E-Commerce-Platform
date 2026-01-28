package com.suman.Ecommerce_beckend.admin.dto.response;

import java.time.LocalDateTime;

public class AdminStats {
    private Long totalProducts;
    private Long totalOrders;
    private Long totalUsers;
    private Double totalRevenue;
    private Double totalProfit;
    private Long pendingOrders;
    private Long shippedOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
    private Integer totalProductsSold;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;

    public AdminStats() {
    }

    public AdminStats(Long totalProducts, Long totalOrders, Long totalUsers, Double totalRevenue,
                      Double totalProfit, Long pendingOrders, Long shippedOrders,
                      Long deliveredOrders, Long cancelledOrders, Integer totalProductsSold,
                      LocalDateTime periodStart, LocalDateTime periodEnd) {
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.totalUsers = totalUsers;
        this.totalRevenue = totalRevenue;
        this.totalProfit = totalProfit;
        this.pendingOrders = pendingOrders;
        this.shippedOrders = shippedOrders;
        this.deliveredOrders = deliveredOrders;
        this.cancelledOrders = cancelledOrders;
        this.totalProductsSold = totalProductsSold;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
    }

    // Getters and Setters
    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Double getTotalProfit() {
        return totalProfit;
    }

    public void setTotalProfit(Double totalProfit) {
        this.totalProfit = totalProfit;
    }

    public Long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(Long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public Long getShippedOrders() {
        return shippedOrders;
    }

    public void setShippedOrders(Long shippedOrders) {
        this.shippedOrders = shippedOrders;
    }

    public Long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(Long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public Long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(Long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public Integer getTotalProductsSold() {
        return totalProductsSold;
    }

    public void setTotalProductsSold(Integer totalProductsSold) {
        this.totalProductsSold = totalProductsSold;
    }

    public LocalDateTime getPeriodStart() {
        return periodStart;
    }

    public void setPeriodStart(LocalDateTime periodStart) {
        this.periodStart = periodStart;
    }

    public LocalDateTime getPeriodEnd() {
        return periodEnd;
    }

    public void setPeriodEnd(LocalDateTime periodEnd) {
        this.periodEnd = periodEnd;
    }
}