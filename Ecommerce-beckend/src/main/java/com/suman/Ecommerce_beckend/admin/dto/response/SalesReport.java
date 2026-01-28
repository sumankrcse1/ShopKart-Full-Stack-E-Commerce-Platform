package com.suman.Ecommerce_beckend.admin.dto.response;

import java.time.LocalDate;

public class SalesReport {
    private LocalDate date;
    private Long ordersCount;
    private Double revenue;
    private Double profit;
    private Integer itemsSold;

    public SalesReport() {
    }

    public SalesReport(LocalDate date, Long ordersCount, Double revenue, Double profit, Integer itemsSold) {
        this.date = date;
        this.ordersCount = ordersCount;
        this.revenue = revenue;
        this.profit = profit;
        this.itemsSold = itemsSold;
    }

    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getOrdersCount() {
        return ordersCount;
    }

    public void setOrdersCount(Long ordersCount) {
        this.ordersCount = ordersCount;
    }

    public Double getRevenue() {
        return revenue;
    }

    public void setRevenue(Double revenue) {
        this.revenue = revenue;
    }

    public Double getProfit() {
        return profit;
    }

    public void setProfit(Double profit) {
        this.profit = profit;
    }

    public Integer getItemsSold() {
        return itemsSold;
    }

    public void setItemsSold(Integer itemsSold) {
        this.itemsSold = itemsSold;
    }
}