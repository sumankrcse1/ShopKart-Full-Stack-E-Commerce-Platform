package com.suman.Ecommerce_beckend.admin.controller;

import com.suman.Ecommerce_beckend.admin.dto.response.AdminStats;
import com.suman.Ecommerce_beckend.admin.dto.response.ProductStats;
import com.suman.Ecommerce_beckend.admin.dto.response.SalesReport;
import com.suman.Ecommerce_beckend.exception.ProductException;
import com.suman.Ecommerce_beckend.model.*;
import com.suman.Ecommerce_beckend.admin.dto.request.AdminProductRequest;
import com.suman.Ecommerce_beckend.admin.dto.request.OrderStatusRequest;
import com.suman.Ecommerce_beckend.admin.dto.response.ApiResponse;
import com.suman.Ecommerce_beckend.admin.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;


    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody AdminProductRequest req) {
        try {
            Product product = adminService.createProduct(req);
            return new ResponseEntity<>(product, HttpStatus.CREATED);
        } catch (ProductException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long productId,
            @RequestBody AdminProductRequest req) {
        try {
            Product product = adminService.updateProduct(productId, req);
            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch (ProductException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long productId) {
        try {
            adminService.deleteProduct(productId);
            ApiResponse response = new ApiResponse("Product deleted successfully", true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (ProductException e) {
            ApiResponse response = new ApiResponse(e.getMessage(), false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = adminService.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/products/paginated")
    public ResponseEntity<Page<Product>> getProductsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        Page<Product> products = adminService.getProductsPaginated(page, size, sortBy);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable Long productId) {
        try {
            Product product = adminService.getProductById(productId);
            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch (ProductException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/products/low-stock")
    public ResponseEntity<List<ProductStats>> getLowStockProducts(
            @RequestParam(defaultValue = "10") int threshold) {
        List<ProductStats> products = adminService.getLowStockProducts(threshold);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/products/top-selling")
    public ResponseEntity<List<ProductStats>> getTopSellingProducts(
            @RequestParam(defaultValue = "10") int limit) {
        List<ProductStats> products = adminService.getTopSellingProducts(limit);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }


    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = adminService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        try {
            Order order = adminService.getOrderById(orderId);
            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/orders/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = adminService.getOrdersByStatus(status.toUpperCase());
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody OrderStatusRequest statusRequest) {
        try {
            Order order = adminService.updateOrderStatus(orderId, statusRequest.getStatus().toUpperCase());
            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse> deleteOrder(@PathVariable Long orderId) {
        try {
            adminService.deleteOrder(orderId);
            ApiResponse response = new ApiResponse("Order deleted successfully", true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(e.getMessage(), false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStats> getAdminStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        AdminStats stats = adminService.getAdminStats(startDate, endDate);
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @GetMapping("/reports/sales")
    public ResponseEntity<List<SalesReport>> getSalesReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<SalesReport> report = adminService.getSalesReport(startDate, endDate);
        return new ResponseEntity<>(report, HttpStatus.OK);
    }


    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        try {
            User user = adminService.getUserById(userId);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUser(userId);
            ApiResponse response = new ApiResponse("User deleted successfully", true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(e.getMessage(), false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = adminService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category createdCategory = adminService.createCategory(category);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @PutMapping("/categories/{categoryId}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody Category category) {
        try {
            Category updatedCategory = adminService.updateCategory(categoryId, category);
            return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long categoryId) {
        try {
            adminService.deleteCategory(categoryId);
            ApiResponse response = new ApiResponse("Category deleted successfully", true);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse(e.getMessage(), false);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}