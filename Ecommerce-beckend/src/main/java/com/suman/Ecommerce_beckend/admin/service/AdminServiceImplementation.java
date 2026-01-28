package com.suman.Ecommerce_beckend.admin.service;

import com.suman.Ecommerce_beckend.admin.dto.response.AdminStats;
import com.suman.Ecommerce_beckend.admin.dto.response.ProductStats;
import com.suman.Ecommerce_beckend.admin.dto.response.SalesReport;
import com.suman.Ecommerce_beckend.exception.ProductException;
import com.suman.Ecommerce_beckend.model.*;
import com.suman.Ecommerce_beckend.repository.*;
import com.suman.Ecommerce_beckend.admin.dto.request.AdminProductRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImplementation implements AdminService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    // Product Management
    @Override
    @Transactional
    public Product createProduct(AdminProductRequest req) throws ProductException {
        Category topLevel = categoryRepository.findByNameAndLevel(req.getTopLevelCategory(), 1);
        if (topLevel == null) {
            topLevel = new Category();
            topLevel.setName(req.getTopLevelCategory());
            topLevel.setLevel(1);
            topLevel = categoryRepository.save(topLevel);
        }

        Category secondLevel = categoryRepository.findByNameAndParentCategoryNameAndLevel(
                req.getSecondLevelCategory(), req.getTopLevelCategory(), 2);
        if (secondLevel == null) {
            secondLevel = new Category();
            secondLevel.setName(req.getSecondLevelCategory());
            secondLevel.setParentCategory(topLevel);
            secondLevel.setLevel(2);
            secondLevel = categoryRepository.save(secondLevel);
        }

        Category thirdLevel = categoryRepository.findByNameAndParentCategoryNameAndLevel(
                req.getThirdLevelCategory(), req.getSecondLevelCategory(), 3);
        if (thirdLevel == null) {
            thirdLevel = new Category();
            thirdLevel.setName(req.getThirdLevelCategory());
            thirdLevel.setParentCategory(secondLevel);
            thirdLevel.setLevel(3);
            thirdLevel = categoryRepository.save(thirdLevel);
        }

        Product product = new Product();
        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setDiscountPrice(req.getDiscountPrice());
        product.setDiscountPercent(req.getDiscountPercent());
        product.setQuantity(req.getQuantity());
        product.setBrand(req.getBrand());
        product.setColor(req.getColor());
        product.setSizes(req.getSizes());
        product.setImageUrl(req.getImageUrl());
        product.setCategory(thirdLevel);
        product.setCreatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Long productId, AdminProductRequest req) throws ProductException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product not found with id: " + productId));

        if (req.getTitle() != null) product.setTitle(req.getTitle());
        if (req.getDescription() != null) product.setDescription(req.getDescription());
        if (req.getPrice() > 0) product.setPrice(req.getPrice());
        if (req.getDiscountPrice() >= 0) product.setDiscountPrice(req.getDiscountPrice());
        if (req.getDiscountPercent() >= 0) product.setDiscountPercent(req.getDiscountPercent());
        if (req.getQuantity() >= 0) product.setQuantity(req.getQuantity());
        if (req.getBrand() != null) product.setBrand(req.getBrand());
        if (req.getColor() != null) product.setColor(req.getColor());
        if (req.getSizes() != null) product.setSizes(req.getSizes());
        if (req.getImageUrl() != null) product.setImageUrl(req.getImageUrl());

        if (req.getTopLevelCategory() != null && req.getSecondLevelCategory() != null
                && req.getThirdLevelCategory() != null) {
            Category topLevel = categoryRepository.findByNameAndLevel(req.getTopLevelCategory(), 1);
            if (topLevel == null) {
                topLevel = new Category();
                topLevel.setName(req.getTopLevelCategory());
                topLevel.setLevel(1);
                topLevel = categoryRepository.save(topLevel);
            }

            Category secondLevel = categoryRepository.findByNameAndParentCategoryNameAndLevel(
                    req.getSecondLevelCategory(), req.getTopLevelCategory(), 2);
            if (secondLevel == null) {
                secondLevel = new Category();
                secondLevel.setName(req.getSecondLevelCategory());
                secondLevel.setParentCategory(topLevel);
                secondLevel.setLevel(2);
                secondLevel = categoryRepository.save(secondLevel);
            }

            Category thirdLevel = categoryRepository.findByNameAndParentCategoryNameAndLevel(
                    req.getThirdLevelCategory(), req.getSecondLevelCategory(), 3);
            if (thirdLevel == null) {
                thirdLevel = new Category();
                thirdLevel.setName(req.getThirdLevelCategory());
                thirdLevel.setParentCategory(secondLevel);
                thirdLevel.setLevel(3);
                thirdLevel = categoryRepository.save(thirdLevel);
            }

            product.setCategory(thirdLevel);
        }

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) throws ProductException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product not found with id: " + productId));
        productRepository.delete(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Page<Product> getProductsPaginated(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return productRepository.findAll(pageable);
    }

    @Override
    public Product getProductById(Long productId) throws ProductException {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product not found with id: " + productId));
    }

    // Order Management
    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, String status) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found with id: " + orderId));

        order.setOrderStatus(status);

        if (status.equalsIgnoreCase("DELIVERED")) {
            order.setDeliveryDate(LocalDateTime.now());
        }

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByOrderStatus(status);
    }

    @Override
    public Order getOrderById(Long orderId) throws Exception {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found with id: " + orderId));
    }

    @Override
    @Transactional
    public void deleteOrder(Long orderId) throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Order not found with id: " + orderId));
        orderRepository.delete(order);
    }

    // Statistics and Reports
    @Override
    public AdminStats getAdminStats(LocalDateTime startDate, LocalDateTime endDate) {
        AdminStats stats = new AdminStats();

        stats.setTotalProducts(productRepository.count());
        stats.setTotalUsers(userRepository.count());

        if (startDate != null && endDate != null) {
            stats.setPeriodStart(startDate);
            stats.setPeriodEnd(endDate);

            List<Order> orders = orderRepository.findByCreatedAtBetween(startDate, endDate);
            stats.setTotalOrders((long) orders.size());

            double totalRevenue = orders.stream()
                    .mapToDouble(Order::getTotalDiscountedPrice)
                    .sum();
            stats.setTotalRevenue(totalRevenue);

            double totalOriginalPrice = orders.stream()
                    .mapToDouble(Order::getTotalPrice)
                    .sum();
            stats.setTotalProfit(totalRevenue);

            int totalProductsSold = orders.stream()
                    .mapToInt(Order::getTotalItem)
                    .sum();
            stats.setTotalProductsSold(totalProductsSold);

            stats.setPendingOrders(orderRepository.countByOrderStatusAndCreatedAtBetween("PENDING", startDate, endDate));
            stats.setShippedOrders(orderRepository.countByOrderStatusAndCreatedAtBetween("SHIPPED", startDate, endDate));
            stats.setDeliveredOrders(orderRepository.countByOrderStatusAndCreatedAtBetween("DELIVERED", startDate, endDate));
            stats.setCancelledOrders(orderRepository.countByOrderStatusAndCreatedAtBetween("CANCELLED", startDate, endDate));
        } else {
            stats.setTotalOrders(orderRepository.count());

            List<Order> allOrders = orderRepository.findAll();
            double totalRevenue = allOrders.stream()
                    .mapToDouble(Order::getTotalDiscountedPrice)
                    .sum();
            stats.setTotalRevenue(totalRevenue);
            stats.setTotalProfit(totalRevenue);

            int totalProductsSold = allOrders.stream()
                    .mapToInt(Order::getTotalItem)
                    .sum();
            stats.setTotalProductsSold(totalProductsSold);

            stats.setPendingOrders(orderRepository.countByOrderStatus("PENDING"));
            stats.setShippedOrders(orderRepository.countByOrderStatus("SHIPPED"));
            stats.setDeliveredOrders(orderRepository.countByOrderStatus("DELIVERED"));
            stats.setCancelledOrders(orderRepository.countByOrderStatus("CANCELLED"));
        }

        return stats;
    }

    @Override
    public List<SalesReport> getSalesReport(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findByCreatedAtBetween(startDate, endDate);

        return orders.stream()
                .collect(Collectors.groupingBy(order -> order.getOrderDate().toLocalDate()))
                .entrySet().stream()
                .map(entry -> {
                    List<Order> dayOrders = entry.getValue();
                    double revenue = dayOrders.stream()
                            .mapToDouble(Order::getTotalDiscountedPrice)
                            .sum();
                    int itemsSold = dayOrders.stream()
                            .mapToInt(Order::getTotalItem)
                            .sum();

                    return new SalesReport(
                            entry.getKey(),
                            (long) dayOrders.size(),
                            revenue,
                            revenue,
                            itemsSold
                    );
                })
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductStats> getTopSellingProducts(int limit) {
        List<Object[]> results = orderItemRepository.findTopSellingProducts((java.awt.print.Pageable) PageRequest.of(0, limit));

        return results.stream()
                .map(result -> {
                    Product product = (Product) result[0];
                    Long totalSold = (Long) result[1];
                    Double totalRevenue = (Double) result[2];

                    Double avgRating = product.getRatings().stream()
                            .mapToDouble(Rating::getRating)
                            .average()
                            .orElse(0.0);

                    return new ProductStats(
                            product.getId(),
                            product.getTitle(),
                            product.getImageUrl(),
                            totalSold.intValue(),
                            totalRevenue,
                            product.getQuantity(),
                            avgRating,
                            product.getReviews().size()
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductStats> getLowStockProducts(int threshold) {
        List<Product> products = productRepository.findByQuantityLessThan(threshold);

        return products.stream()
                .map(product -> {
                    Long totalSold = orderItemRepository.countByProductId(product.getId());
                    Double totalRevenue = orderItemRepository.sumRevenueByProductId(product.getId());

                    Double avgRating = product.getRatings().stream()
                            .mapToDouble(Rating::getRating)
                            .average()
                            .orElse(0.0);

                    return new ProductStats(
                            product.getId(),
                            product.getTitle(),
                            product.getImageUrl(),
                            totalSold != null ? totalSold.intValue() : 0,
                            totalRevenue != null ? totalRevenue : 0.0,
                            product.getQuantity(),
                            avgRating,
                            product.getReviews().size()
                    );
                })
                .collect(Collectors.toList());
    }

    // User Management
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long userId) throws Exception {
        return userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found with id: " + userId));
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found with id: " + userId));

        Cart cart = cartRepository.findByUserId(userId);
        if (cart != null) {
            cartRepository.delete(cart);
        }

        List<Order> orders = orderRepository.findByUserId(userId);
        if (orders != null && !orders.isEmpty()) {
            orderRepository.deleteAll(orders);
        }

        // Step 3: Delete password reset tokens
        PasswordResetToken resetToken = passwordResetTokenRepository.findByUserId(userId).orElse(null);;
        if (resetToken != null) {
            passwordResetTokenRepository.delete(resetToken);
        }

        // Step 4: Delete the user (cascade will handle addresses, ratings, reviews, payment info)
        userRepository.delete(user);
    }

    // Category Management
    @Override
    @Transactional
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Category updateCategory(Long categoryId, Category categoryDetails) throws Exception {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new Exception("Category not found with id: " + categoryId));

        category.setName(categoryDetails.getName());
        if (categoryDetails.getParentCategory() != null) {
            category.setParentCategory(categoryDetails.getParentCategory());
        }
        category.setLevel(categoryDetails.getLevel());

        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long categoryId) throws Exception {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new Exception("Category not found with id: " + categoryId));
        categoryRepository.delete(category);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}