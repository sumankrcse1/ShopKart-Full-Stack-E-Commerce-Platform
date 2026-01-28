package com.suman.Ecommerce_beckend.service;

import com.suman.Ecommerce_beckend.exception.OrderException;
import com.suman.Ecommerce_beckend.model.*;
import com.suman.Ecommerce_beckend.repository.*;
import com.suman.Ecommerce_beckend.request.CreateOrderRequest;
import com.suman.Ecommerce_beckend.user.domain.OrderStatus;
import com.suman.Ecommerce_beckend.user.domain.PaymentStatus;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImplementation implements OrderService{

    private OrderRepository orderRepository;
    private CartService cartService;
    private AddressRepository addressRepository;
    private UserRepository userRepository;
    private OrderItemService orderItemService;
    private OrderItemRepository orderItemRepository;
    private ProductRepository productRepository;

    public OrderServiceImplementation(OrderRepository orderRepository, CartService cartService, AddressRepository addressRepository, UserRepository userRepository, OrderItemService orderItemService, OrderItemRepository orderItemRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.orderItemService = orderItemService;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Order createOrder(User user, CreateOrderRequest orderRequest) {
        Address shipAddress = new Address();
        shipAddress.setCity(orderRequest.getCity());
        shipAddress.setFirstName(orderRequest.getFirstName());
        shipAddress.setLastName(orderRequest.getLastName());
        shipAddress.setMobile(orderRequest.getMobile());
        shipAddress.setState(orderRequest.getState());
        shipAddress.setStreetAddress(orderRequest.getStreetAddress());
        shipAddress.setZipCode(orderRequest.getZipCode());
        shipAddress.setUser(user);
        Address address= addressRepository.save(shipAddress);
        user.getAddress().add(address);
        userRepository.save(user);

        Cart cart=cartService.findUserCart(user.getId());
        List<OrderItem> orderItems=new ArrayList<>();

        for(CartItem item: cart.getCartItems()) {
            OrderItem orderItem=new OrderItem();

            orderItem.setPrice(item.getPrice());
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setSize(item.getSize());
            orderItem.setUserId(item.getUserId());
            orderItem.setDiscountedPrice(item.getDiscountedPrice());

            OrderItem createdOrderItem=orderItemRepository.save(orderItem);

            orderItems.add(createdOrderItem);

            // FIX: Reduce product quantity
            Product product = item.getProduct();
            int newQuantity = product.getQuantity() - item.getQuantity();

            // Optional: Add validation to prevent negative inventory
            if (newQuantity < 0) {
                throw new RuntimeException("Insufficient stock for product: " + product.getTitle() +
                        ". Available: " + product.getQuantity() +
                        ", Requested: " + item.getQuantity());
            }

            product.setQuantity(newQuantity);
            productRepository.save(product);
        }


        Order createdOrder=new Order();
        createdOrder.setUser(user);
        createdOrder.setOrderItems(orderItems);
        createdOrder.setTotalPrice(cart.getTotalPrice());
        createdOrder.setTotalDiscountedPrice(cart.getTotalDiscountedPrice());
        createdOrder.setDiscount(cart.getDiscount());
        createdOrder.setTotalItem(cart.getTotalItem());

        createdOrder.setShippingAddress(address);
        createdOrder.setOrderDate(LocalDateTime.now());
        createdOrder.setOrderStatus(String.valueOf(OrderStatus.PENDING));
        createdOrder.getPaymentDetails().setStatus(String.valueOf(PaymentStatus.PENDING));
        createdOrder.getPaymentDetails().setCardholderName(orderRequest.getCardholderName());
        createdOrder.getPaymentDetails().setCardNumber(orderRequest.getCardNumber());
        createdOrder.getPaymentDetails().setPaymentMethod(String.valueOf(orderRequest.getPaymentMethod()));
        createdOrder.getPaymentDetails().setPaymentId(generatePaymentId());
        createdOrder.setCreatedAt(LocalDateTime.now());


        Order savedOrder=orderRepository.save(createdOrder);

        for(OrderItem item:orderItems) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }

        return savedOrder;

    }

    @Override
    public Order placedOrder(Long orderId) throws OrderException {
        Order order=findOrderById(orderId);
        order.setOrderStatus(String.valueOf(OrderStatus.PLACED));
        order.getPaymentDetails().setStatus(String.valueOf(PaymentStatus.COMPLETED));
        return order;
    }

    @Override
    public Order confirmedOrder(Long orderId) throws OrderException {
        Order order=findOrderById(orderId);
        order.setOrderStatus(String.valueOf(OrderStatus.CONFIRMED));


        return orderRepository.save(order);
    }

    @Override
    public Order shippedOrder(Long orderId) throws OrderException {
        Order order=findOrderById(orderId);
        order.setOrderStatus(String.valueOf(OrderStatus.SHIPPED));
        return orderRepository.save(order);
    }

    @Override
    public Order deliveredOrder(Long orderId) throws OrderException {
        Order order=findOrderById(orderId);
        order.setOrderStatus(String.valueOf(OrderStatus.DELIVERED));
        return orderRepository.save(order);
    }

    @Override
    public Order cancledOrder(Long orderId) throws OrderException {
        Order order=findOrderById(orderId);
        order.setOrderStatus(String.valueOf(OrderStatus.CANCELLED));
        return orderRepository.save(order);
    }

    @Override
    public Order findOrderById(Long orderId) throws OrderException {
        Optional<Order> opt=orderRepository.findById(orderId);

        if(opt.isPresent()) {
            return opt.get();
        }
        throw new OrderException("order not exist with id "+orderId);
    }

    @Override
    public List<Order> usersOrderHistory(Long userId) {
        List<Order> orders=orderRepository.getUsersOrders(userId);
        return orders;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public void deleteOrder(Long orderId) throws OrderException {

        orderRepository.deleteById(orderId);

    }

    public static String generatePaymentId() {
        String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        int LENGTH = 30;

        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(LENGTH);
        for (int i = 0; i < LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            char randomChar = CHARACTERS.charAt(randomIndex);
            sb.append(randomChar);
        }
        return sb.toString();
    }
}
