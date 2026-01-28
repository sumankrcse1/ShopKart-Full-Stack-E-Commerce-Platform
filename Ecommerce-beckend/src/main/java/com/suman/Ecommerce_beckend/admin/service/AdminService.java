package com.suman.Ecommerce_beckend.admin.service;


import com.suman.Ecommerce_beckend.admin.dto.response.AdminStats;
import com.suman.Ecommerce_beckend.admin.dto.response.ProductStats;
import com.suman.Ecommerce_beckend.admin.dto.response.SalesReport;
import com.suman.Ecommerce_beckend.exception.ProductException;
import com.suman.Ecommerce_beckend.model.*;
import com.suman.Ecommerce_beckend.admin.dto.request.AdminProductRequest;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminService {

    // Product Management
    Product createProduct(AdminProductRequest req) throws ProductException;
    Product updateProduct(Long productId, AdminProductRequest req) throws ProductException;
    void deleteProduct(Long productId) throws ProductException;
    List<Product> getAllProducts();
    Page<Product> getProductsPaginated(int page, int size, String sortBy);
    Product getProductById(Long productId) throws ProductException;

    // Order Management
    List<Order> getAllOrders();
    Order updateOrderStatus(Long orderId, String status) throws Exception;
    List<Order> getOrdersByStatus(String status);
    Order getOrderById(Long orderId) throws Exception;
    void deleteOrder(Long orderId) throws Exception;

    // Statistics and Reports
    AdminStats getAdminStats(LocalDateTime startDate, LocalDateTime endDate);
    List<SalesReport> getSalesReport(LocalDateTime startDate, LocalDateTime endDate);
    List<ProductStats> getTopSellingProducts(int limit);
    List<ProductStats> getLowStockProducts(int threshold);

    // User Management
    List<User> getAllUsers();
    User getUserById(Long userId) throws Exception;
    void deleteUser(Long userId) throws Exception;

    // Category Management
    Category createCategory(Category category);
    Category updateCategory(Long categoryId, Category category) throws Exception;
    void deleteCategory(Long categoryId) throws Exception;
    List<Category> getAllCategories();
}
