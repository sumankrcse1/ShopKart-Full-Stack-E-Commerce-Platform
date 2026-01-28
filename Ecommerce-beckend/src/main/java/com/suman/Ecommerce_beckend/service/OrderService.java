package com.suman.Ecommerce_beckend.service;

import com.suman.Ecommerce_beckend.exception.OrderException;
import com.suman.Ecommerce_beckend.model.Address;
import com.suman.Ecommerce_beckend.model.Order;
import com.suman.Ecommerce_beckend.model.User;
import com.suman.Ecommerce_beckend.request.CreateOrderRequest;

import java.util.List;

public interface OrderService {
    public Order createOrder(User user, CreateOrderRequest orderRequest);

    public Order findOrderById(Long orderId) throws OrderException;

    public List<Order> usersOrderHistory(Long userId);

    public Order placedOrder(Long orderId) throws OrderException;

    public Order confirmedOrder(Long orderId)throws OrderException;

    public Order shippedOrder(Long orderId) throws OrderException;

    public Order deliveredOrder(Long orderId) throws OrderException;

    public Order cancledOrder(Long orderId) throws OrderException;

    public List<Order>getAllOrders();

    public void deleteOrder(Long orderId) throws OrderException;
}
