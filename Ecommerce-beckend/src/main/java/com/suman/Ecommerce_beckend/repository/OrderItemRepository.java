package com.suman.Ecommerce_beckend.repository;

import com.suman.Ecommerce_beckend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {
    //admin
    @Query("SELECT oi.product, SUM(oi.quantity), SUM(oi.discountedPrice * oi.quantity) " +
            "FROM OrderItem oi " +
            "GROUP BY oi.product " +
            "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopSellingProducts(Pageable pageable);

    @Query("SELECT COUNT(oi) FROM OrderItem oi WHERE oi.product.id = :productId")
    Long countByProductId(@Param("productId") Long productId);

    @Query("SELECT SUM(oi.discountedPrice * oi.quantity) FROM OrderItem oi WHERE oi.product.id = :productId")
    Double sumRevenueByProductId(@Param("productId") Long productId);
}
